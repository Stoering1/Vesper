import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Download, FileSpreadsheet, ReceiptText } from "lucide-react";
import { AppShell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePosStore, checkTotal } from "@/lib/pos/store";
import { createBookings, toDatevCsv, toDsfinvkCsv, toEurSummary, toWisoEurXml, type WisoEurOptions } from "@/lib/pos/accounting";
import { useState } from "react";

export const Route = createFileRoute("/buchhaltung")({ component: AccountingPage });

function download(name: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function AccountingPage() {
  const checks = usePosStore((s) => s.checks);
  const receipts = usePosStore((s) => s.receipts);
  const staff = usePosStore((s) => s.staff);
  const settings = usePosStore((s) => s.settings);
  const paid = checks.filter((c) => c.status === "paid");
  const gross = paid.reduce((sum, c) => sum + checkTotal(c), 0);
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const to = now.toISOString().slice(0, 10);
  const [ownerName, setOwnerName] = useState(staff.find((s) => s.role === "inhaber")?.name ?? staff[0]?.name ?? "");
  const [legalForm, setLegalForm] = useState<WisoEurOptions["legalForm"]>("Einzelunternehmen");
  const [taxOfficeNumber, setTaxOfficeNumber] = useState("");

  const exportWiso = () => {
    const xml = toWisoEurXml(checks, from, to, {
      taxYear: new Date(from).getFullYear(),
      ownerName,
      legalForm,
      taxOfficeNumber,
      businessName: settings.restaurantName,
      address: settings.address,
      taxId: settings.taxId,
    });
    download(`WISO Sparbuch-Export EÜR ${new Date(from).getFullYear()}.xml`, xml, "application/xml;charset=utf-8");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <h1 className="text-xl font-semibold">Buchhaltung & Exporte</h1>
        <p className="mt-1 text-sm text-muted">EÜR, DATEV, DSFinV-K und WISO-Übergaben. WISO-XML zunächst als Testexport; vor produktivem Import mit deiner WISO-Version validieren.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Bezahlte Bons" value={String(paid.length)} />
          <Stat label="Bruttoumsatz" value={`${(gross / 100).toFixed(2).replace(".", ",")} €`} />
          <Stat label="TSE-Belege" value={String(receipts.length)} />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-4">
          <div className="font-medium">WISO Steuer / EÜR</div>
          <p className="mt-1 text-sm text-muted">Erzeugt eine XML-Übergabedatei für die EÜR. WISO dokumentiert den Import über „Daten importieren → Bürosoftware → WISO Mein Büro“; die konkrete XML-Struktur ist nicht öffentlich spezifiziert.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div><label className="mb-1 block text-xs text-muted">Betriebsinhaber</label><Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Vorname Nachname" /></div>
            <div><label className="mb-1 block text-xs text-muted">Rechtsform</label><select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={legalForm} onChange={(e) => setLegalForm(e.target.value as WisoEurOptions["legalForm"])}><option>Einzelunternehmen</option><option>GbR</option><option>GmbH</option><option>UG</option><option>Sonstige</option></select></div>
            <div><label className="mb-1 block text-xs text-muted">Finanzamtsnummer (optional)</label><Input value={taxOfficeNumber} onChange={(e) => setTaxOfficeNumber(e.target.value)} placeholder="z. B. 1234" /></div>
          </div>
          <Button className="mt-4" onClick={exportWiso}><Download className="size-4" /> WISO EÜR XML exportieren</Button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ExportCard title="DATEV Buchungsstapel" text="CSV mit Buchungssätzen und Steuersätzen." icon={<FileSpreadsheet className="size-5" />} onClick={() => download(`vesper-datev-${to}.csv`, toDatevCsv(createBookings(checks)), "text/csv;charset=utf-8")} />
          <ExportCard title="DSFinV-K Arbeitsdatei" text="Maschinenlesbare Bon-/TSE-Grunddaten für Tests." icon={<ReceiptText className="size-5" />} onClick={() => download(`vesper-dsfinvk-${to}.csv`, toDsfinvkCsv(receipts), "text/csv;charset=utf-8")} />
          <ExportCard title="EÜR-Zusammenfassung" text="Umsatz und Umsatzsteuer nach Zeitraum." icon={<FileSpreadsheet className="size-5" />} onClick={() => download(`vesper-eur-${to}.json`, JSON.stringify(toEurSummary(checks, from, to), null, 2), "application/json;charset=utf-8")} />
          <ExportCard title="Buchungsvorschau" text="Erzeugt die aktuelle Buchungslogik für die Prüfung." icon={<Download className="size-5" />} onClick={() => download(`vesper-bookings-${to}.csv`, toDatevCsv(createBookings(checks)), "text/csv;charset=utf-8")} />
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-border bg-surface p-4"><div className="text-xs text-muted">{label}</div><div className="mt-1 text-lg font-semibold tabular-nums">{value}</div></div>; }
function ExportCard({ title, text, icon, onClick }: { title: string; text: string; icon: ReactNode; onClick: () => void }) { return <div className="rounded-xl border border-border bg-surface p-4"><div className="flex items-center gap-2 font-medium">{icon}{title}</div><p className="mt-1 text-sm text-muted">{text}</p><Button className="mt-4" variant="outline" onClick={onClick}><Download className="size-4" /> Exportieren</Button></div>; }
