import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatEUR, todayKey } from "@/lib/pos/money";
import { checkTotal, lastCloseAt, usePosStore, vatBreakdown } from "@/lib/pos/store";
import { METHOD_LABEL } from "@/lib/pos/types";
import { Button } from "@/components/ui/button";

export function ReportsView() {
  const checks = usePosStore((s) => s.checks);
  const receipts = usePosStore((s) => s.receipts);
  const staff = usePosStore((s) => s.staff);
  const products = usePosStore((s) => s.products);
  const dayCloses = usePosStore((s) => s.dayCloses);
  const [scope, setScope] = useState<"schicht" | "heute">("schicht");

  const since = useMemo(() => {
    if (scope === "schicht") return lastCloseAt(dayCloses);
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, [scope, dayCloses]);

  const paid = checks.filter((c) => c.status === "paid" && (c.paidAt ?? 0) >= since);
  const sales = paid.reduce((s, c) => s + checkTotal(c), 0);
  const covers = paid.reduce((s, c) => s + c.guestCount, 0);
  const avg = covers ? Math.round(sales / covers) : 0;
  const open = checks.filter((c) => c.status !== "paid" && c.status !== "voided");

  const hourly = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8;
    const sum = paid
      .filter((c) => new Date(c.paidAt ?? 0).getHours() === hour)
      .reduce((s, c) => s + checkTotal(c), 0);
    return { hour: `${String(hour).padStart(2, "0")}:00`, umsatz: Math.round(sum / 100) };
  });

  const byStaff = staff.map((s) => ({
    name: s.name,
    umsatz: paid.filter((c) => c.staffId === s.id).reduce((n, c) => n + checkTotal(c), 0),
    bons: paid.filter((c) => c.staffId === s.id).length,
  }));

  const productMap = new Map<string, { name: string; qty: number; umsatz: number }>();
  for (const c of paid) {
    for (const item of c.items) {
      if (item.voided) continue;
      const cur = productMap.get(item.productId) ?? {
        name: item.name,
        qty: 0,
        umsatz: 0,
      };
      cur.qty += item.qty;
      cur.umsatz += item.unitPrice * item.qty;
      productMap.set(item.productId, cur);
    }
  }
  const top = [...productMap.values()].sort((a, b) => b.umsatz - a.umsatz).slice(0, 8);

  const methods = { bar: 0, karte: 0 };
  for (const c of paid) for (const p of c.payments) methods[p.method] += p.amountCents;

  const vatMap = new Map<number, { gross: number; net: number; tax: number }>();
  for (const c of paid) {
    for (const v of vatBreakdown(c)) {
      const cur = vatMap.get(v.rate) ?? { gross: 0, net: 0, tax: 0 };
      vatMap.set(v.rate, {
        gross: cur.gross + v.gross,
        net: cur.net + v.net,
        tax: cur.tax + v.tax,
      });
    }
  }

  function exportGobd() {
    const payload = {
      exportDate: new Date().toISOString(),
      periodFrom: new Date(since).toISOString(),
      receipts: receipts.filter((r) => r.printedAt >= since),
      checks: paid,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vesper-gobd-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-xl font-semibold tracking-tight">Berichte</h1>
        <Button size="sm" variant={scope === "schicht" ? "default" : "outline"} onClick={() => setScope("schicht")}>
          Seit Abschluss
        </Button>
        <Button size="sm" variant={scope === "heute" ? "default" : "outline"} onClick={() => setScope("heute")}>
          Heute
        </Button>
        <Button size="sm" variant="outline" onClick={exportGobd}>
          GoBD-Export
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Umsatz" value={formatEUR(sales)} />
        <Stat label="Gäste" value={String(covers)} />
        <Stat label="Ø Bon / Gast" value={formatEUR(avg)} />
        <Stat label="Offene Tische" value={String(open.length)} />
      </div>

      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-medium text-muted">Stundenumsatz</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourly}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="hour" stroke="var(--color-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--color-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                formatter={(v: number) => [`${v} €`, "Umsatz"]}
              />
              <Bar dataKey="umsatz" fill="var(--color-sage)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-muted">Top-Artikel</h2>
          <ul className="space-y-2">
            {top.map((p) => (
              <li key={p.name} className="flex justify-between text-sm">
                <span>
                  {p.name} <span className="text-muted">×{p.qty}</span>
                </span>
                <span className="font-mono tabular-nums">{formatEUR(p.umsatz)}</span>
              </li>
            ))}
            {top.length === 0 ? <p className="text-sm text-muted">Noch keine Verkäufe in diesem Zeitraum.</p> : null}
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-medium text-muted">Personal</h2>
          <ul className="space-y-2">
            {byStaff.map((s) => (
              <li key={s.name} className="flex justify-between text-sm">
                <span>
                  {s.name} <span className="text-muted">{s.bons} Bons</span>
                </span>
                <span className="font-mono tabular-nums">{formatEUR(s.umsatz)}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 mb-3 text-sm font-medium text-muted">Zahlarten & MwSt</h2>
          <p className="flex justify-between text-sm">
            <span>{METHOD_LABEL.bar}</span>
            <span className="font-mono tabular-nums">{formatEUR(methods.bar)}</span>
          </p>
          <p className="flex justify-between text-sm">
            <span>{METHOD_LABEL.karte}</span>
            <span className="font-mono tabular-nums">{formatEUR(methods.karte)}</span>
          </p>
          {[...vatMap.entries()].map(([rate, v]) => (
            <p key={rate} className="flex justify-between text-sm text-muted">
              <span>MwSt {rate}%</span>
              <span className="font-mono tabular-nums">{formatEUR(v.tax)}</span>
            </p>
          ))}
        </section>
      </div>
      <p className="text-xs text-subtle">{products.length} Artikel im Stamm · Live-Kennzahlen wie MY orderbird Insights.</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl tabular-nums">{value}</p>
    </div>
  );
}
