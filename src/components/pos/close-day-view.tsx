import { useMemo, useState } from "react";
import { formatDateTime, formatEUR, parseEuroInput } from "@/lib/pos/money";
import { checkTotal, lastCloseAt, usePosStore, vatBreakdown } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReceiptModal } from "@/components/pos/receipt-modal";
import type { Receipt } from "@/lib/pos/types";

export function CloseDayView() {
  const checks = usePosStore((s) => s.checks);
  const receipts = usePosStore((s) => s.receipts);
  const dayCloses = usePosStore((s) => s.dayCloses);
  const closeDay = usePosStore((s) => s.closeDay);
  const [counted, setCounted] = useState("");
  const [lastReceipt, setLastReceipt] = useState<Receipt | null>(null);

  const since = lastCloseAt(dayCloses);
  const paid = checks.filter((c) => c.status === "paid" && (c.paidAt ?? 0) >= since);
  const methods = { bar: 0, karte: 0 };
  for (const c of paid) for (const p of c.payments) methods[p.method] += p.amountCents;
  const sales = paid.reduce((s, c) => s + checkTotal(c), 0);
  const countedCents = parseEuroInput(counted);
  const diff = counted ? countedCents - methods.bar : 0;
  const openChecks = checks.filter((c) => c.status !== "paid" && c.status !== "voided");

  const vat = useMemo(() => {
    const map = new Map<number, { gross: number; tax: number }>();
    for (const c of paid) {
      for (const v of vatBreakdown(c)) {
        const cur = map.get(v.rate) ?? { gross: 0, tax: 0 };
        map.set(v.rate, { gross: cur.gross + v.gross, tax: cur.tax + v.tax });
      }
    }
    return [...map.entries()];
  }, [paid]);

  return (
    <div className="mx-auto max-w-xl p-4 sm:p-6">
      <h1 className="text-xl font-semibold">Kassenabschluss</h1>
      <p className="mt-1 text-sm text-muted">
        Schicht seit {formatDateTime(since)}. Z-Bon mit Demo-TSE, analog zum Tagesabschluss.
      </p>

      <div className="mt-6 space-y-2 rounded-xl border border-border bg-surface p-4">
        <Line k="Bons" v={String(receipts.filter((r) => r.printedAt >= since && r.type === "rechnung").length)} />
        <Line k="Umsatz" v={formatEUR(sales)} />
        <Line k="Bar (Soll)" v={formatEUR(methods.bar)} />
        <Line k="Karte" v={formatEUR(methods.karte)} />
        {vat.map(([rate, v]) => (
          <Line key={rate} k={`MwSt ${rate}%`} v={formatEUR(v.tax)} />
        ))}
      </div>

      {openChecks.length > 0 ? (
        <div className="mt-6 rounded-xl border border-amber/40 bg-amber/10 p-4">
          <p className="font-medium">Schicht kann noch nicht geschlossen werden</p>
          <p className="mt-1 text-sm text-muted">
            Es sind noch {openChecks.length} offene Vorgänge vorhanden. Erst alle Rechnungen bezahlen,
            stornieren oder abschließen.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {openChecks.slice(0, 8).map((c) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.tableId ? `Tisch ${c.tableId}` : c.type === "takeaway" ? "Mitnahme" : "Theke"}</span>
                <span className="font-mono">{formatEUR(checkTotal(c))}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6">
        <Label>Gezählter Kassenbestand (Bar)</Label>
        <Input
          className="mt-1 font-mono"
          placeholder={formatEUR(methods.bar)}
          value={counted}
          onChange={(e) => setCounted(e.target.value)}
        />
        {counted ? (
          <p className={`mt-2 text-sm ${diff === 0 ? "text-sage" : "text-amber"}`}>
            Differenz: {formatEUR(diff)}
          </p>
        ) : null}
      </div>

      <Button
        className="mt-6 w-full"
        size="lg"
        disabled={!counted || openChecks.length > 0}
        onClick={() => {
          const close = closeDay(countedCents);
          if (close) {
            const rec = usePosStore.getState().receipts.at(-1) ?? null;
            setLastReceipt(rec);
            setCounted("");
          }
        }}
      >
        Schicht schließen & Z-Abschluss erstellen
      </Button>

      {dayCloses.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-2 text-sm font-medium text-muted">Letzte Abschlüsse</h2>
          <ul className="space-y-2">
            {dayCloses
              .slice()
              .reverse()
              .slice(0, 8)
              .map((d) => (
                <li key={d.id} className="flex justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span>
                    {formatDateTime(d.at)} · {d.staffName}
                  </span>
                  <span className="font-mono tabular-nums">{formatEUR(d.salesByMethod.bar + d.salesByMethod.karte)}</span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      <ReceiptModal receipt={lastReceipt} onClose={() => setLastReceipt(null)} />
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <p className="flex justify-between text-sm">
      <span className="text-muted">{k}</span>
      <span className="font-mono tabular-nums">{v}</span>
    </p>
  );
}
