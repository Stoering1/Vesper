import type { Check, PayMethod, Receipt } from "./types";
import { checkTotal, vatBreakdown } from "./store";

export type Chart = "SKR03" | "SKR04";

export interface AccountMap {
  cash: string;
  card: string;
  revenue7: string;
  revenue19: string;
  vat7: string;
  vat19: string;
  tips: string;
  discounts: string;
}

export const DEFAULT_ACCOUNTS: Record<Chart, AccountMap> = {
  SKR03: { cash: "1000", card: "1200", revenue7: "8300", revenue19: "8400", vat7: "1771", vat19: "1776", tips: "1220", discounts: "8736" },
  SKR04: { cash: "1600", card: "1800", revenue7: "4300", revenue19: "4400", vat7: "3801", vat19: "3806", tips: "1800", discounts: "4736" },
};

export interface BookingRow {
  date: string;
  documentNo: string;
  description: string;
  debit: string;
  credit: string;
  amountCents: number;
  taxRate?: number;
  sourceType: string;
  sourceId: string;
}

const isoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const csv = (value: unknown) => {
  const s = String(value ?? "");
  return /[;"\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};

export function createBookings(checks: Check[], chart: Chart = "SKR03", accounts = DEFAULT_ACCOUNTS[chart]): BookingRow[] {
  const rows: BookingRow[] = [];
  for (const check of checks.filter((c) => c.status === "paid")) {
    const date = isoDate(check.paidAt ?? check.openedAt);
    const documentNo = `V-${check.id}`;
    const payments: Record<PayMethod, number> = { bar: 0, karte: 0 };
    for (const p of check.payments) payments[p.method] += p.amountCents;
    const paymentTotal = payments.bar + payments.karte;
    if (!paymentTotal) continue;
    const tip = Math.max(0, check.tipCents);
    const salesPaymentTotal = Math.max(0, paymentTotal - tip);
    const tipByMethod: Record<PayMethod, number> = { bar: 0, karte: 0 };
    for (const [method, amount] of Object.entries(payments) as [PayMethod, number][]) {
      if (amount && tip) tipByMethod[method] = Math.round((amount * tip) / paymentTotal);
    }
    // Correct rounding so split payment methods still add up exactly to the tip.
    if (tipByMethod.bar + tipByMethod.karte !== tip) {
      tipByMethod.bar += tip - tipByMethod.bar - tipByMethod.karte;
    }
    for (const [method, amount] of Object.entries(payments) as [PayMethod, number][]) {
      if (!amount) continue;
      const debit = method === "bar" ? accounts.cash : accounts.card;
      if (tipByMethod[method] > 0) {
        rows.push({ date, documentNo, description: `Trinkgeld ${documentNo}`, debit, credit: accounts.tips, amountCents: tipByMethod[method], sourceType: "check", sourceId: check.id });
      }
    }
    if (!salesPaymentTotal) continue;
    for (const v of vatBreakdown(check)) {
      const gross = v.gross;
      const net = v.net;
      const tax = v.tax;
      const revenue = v.rate === 7 ? accounts.revenue7 : accounts.revenue19;
      const vat = v.rate === 7 ? accounts.vat7 : accounts.vat19;
      for (const [method, amount] of Object.entries(payments) as [PayMethod, number][]) {
        const salesAmount = Math.max(0, amount - tipByMethod[method]);
        if (!salesAmount || !gross) continue;
        const allocatedGross = Math.round((salesAmount * gross) / salesPaymentTotal);
        const debit = method === "bar" ? accounts.cash : accounts.card;
        rows.push({ date, documentNo, description: `Umsatz ${v.rate}% ${documentNo}`, debit, credit: revenue, amountCents: Math.max(0, Math.round((net * allocatedGross) / gross)), taxRate: v.rate, sourceType: "check", sourceId: check.id });
        rows.push({ date, documentNo, description: `USt ${v.rate}% ${documentNo}`, debit, credit: vat, amountCents: Math.max(0, Math.round((tax * allocatedGross) / gross)), taxRate: v.rate, sourceType: "check", sourceId: check.id });
      }
    }
  }
  return rows;
}

export function toDatevCsv(rows: BookingRow[]): string {
  const header = ["Datum", "Belegnummer", "Beschreibung", "Soll", "Haben", "Betrag", "Steuersatz", "Quelle", "Quell-ID"].join(";");
  return "\ufeff" + [header, ...rows.map((r) => [r.date, r.documentNo, r.description, r.debit, r.credit, (r.amountCents / 100).toFixed(2).replace(".", ","), r.taxRate ?? "", r.sourceType, r.sourceId].map(csv).join(";"))].join("\n");
}

export function toEurSummary(checks: Check[], from: string, to: string) {
  const filtered = checks.filter((c) => c.status === "paid" && isoDate(c.paidAt ?? c.openedAt) >= from && isoDate(c.paidAt ?? c.openedAt) <= to);
  const vat = new Map<number, { gross: number; net: number; tax: number }>();
  let gross = 0;
  let tips = 0;
  for (const c of filtered) {
    gross += checkTotal(c);
    tips += c.tipCents;
    for (const v of vatBreakdown(c)) {
      const x = vat.get(v.rate) ?? { gross: 0, net: 0, tax: 0 };
      vat.set(v.rate, { gross: x.gross + v.gross, net: x.net + v.net, tax: x.tax + v.tax });
    }
  }
  return { from, to, receipts: filtered.length, grossCents: gross, tipCents: tips, vat: [...vat.entries()].map(([rate, v]) => ({ rate, ...v })) };
}

export function toDsfinvkCsv(receipts: Receipt[]): string {
  const header = ["receipt_id", "bon_number", "printed_at", "type", "tse_tx", "tse_serial", "total_gross_cents"].join(";");
  const rows = receipts.map((r) => [r.id, r.number, new Date(r.printedAt).toISOString(), r.type, r.tse.txNumber, r.tse.serial, Math.max(0, Math.round(r.snapshot.lines.filter((l) => !l.voided).reduce((s, l) => s + l.unitPrice * l.qty, 0) - r.snapshot.discountCents + r.snapshot.tipCents))].map(csv).join(";"));
  return [header, ...rows].join("\n");
}

export function checksum(text: string): string {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}


export interface WisoEurOptions {
  taxYear: number;
  ownerName: string;
  legalForm: "Einzelunternehmen" | "GbR" | "GmbH" | "UG" | "Sonstige";
  taxOfficeNumber?: string;
  businessName: string;
  address: string;
  taxId: string;
}

const xml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

/**
 * Creates a WISO Steuer / MeinBüro-style EÜR XML handoff.
 *
 * Important: WISO's import format is a vendor-specific XML exchange format;
 * Buhl documents the supported workflow but does not publish a public schema.
 * Therefore this exporter is intentionally marked experimental until it has
 * been validated against the user's installed WISO Steuer version.
 */
export function toWisoEurXml(checks: Check[], from: string, to: string, options: WisoEurOptions): string {
  const summary = toEurSummary(checks, from, to);
  const paid = checks.filter((c) => c.status === "paid" && isoDate(c.paidAt ?? c.openedAt) >= from && isoDate(c.paidAt ?? c.openedAt) <= to);
  const paymentTotals = paid.reduce((acc, check) => {
    for (const p of check.payments) acc[p.method] += p.amountCents;
    return acc;
  }, { bar: 0, karte: 0 });
  const vat7 = summary.vat.find((v) => v.rate === 7) ?? { rate: 7, gross: 0, net: 0, tax: 0 };
  const vat19 = summary.vat.find((v) => v.rate === 19) ?? { rate: 19, gross: 0, net: 0, tax: 0 };
  const money = (cents: number) => (cents / 100).toFixed(2);

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<!-- VESPER WISO EÜR EXPORT — EXPERIMENTAL / VALIDATION REQUIRED -->\n` +
`<WisoEurExport version="1.0" taxYear="${options.taxYear}" from="${xml(from)}" to="${xml(to)}">\n` +
`  <Betrieb>\n` +
`    <Name>${xml(options.businessName)}</Name>\n` +
`    <Adresse>${xml(options.address)}</Adresse>\n` +
`    <Steuernummer>${xml(options.taxId)}</Steuernummer>\n` +
`    <Finanzamtsnummer>${xml(options.taxOfficeNumber)}</Finanzamtsnummer>\n` +
`    <Betriebsinhaber>${xml(options.ownerName)}</Betriebsinhaber>\n` +
`    <Rechtsform>${xml(options.legalForm)}</Rechtsform>\n` +
`    <Einkunftsart>Gewerbebetrieb</Einkunftsart>\n` +
`  </Betrieb>\n` +
`  <Zeitraum von="${xml(from)}" bis="${xml(to)}"/>\n` +
`  <Euer>\n` +
`    <Betriebseinnahmen>\n` +
`      <Umsatzsteuerpflichtig7Prozent netto="${money(vat7.net)}" brutto="${money(vat7.gross)}" umsatzsteuer="${money(vat7.tax)}"/>\n` +
`      <Umsatzsteuerpflichtig19Prozent netto="${money(vat19.net)}" brutto="${money(vat19.gross)}" umsatzsteuer="${money(vat19.tax)}"/>\n` +
`      <GesamtBrutto>${money(summary.grossCents - summary.tipCents)}</GesamtBrutto>\n` +
`      <VereinnahmteUmsatzsteuer>${money(vat7.tax + vat19.tax)}</VereinnahmteUmsatzsteuer>\n` +
`      <TrinkgeldAusgenommen>${money(summary.tipCents)}</TrinkgeldAusgenommen>\n` +
`    </Betriebseinnahmen>\n` +
`    <Zahlungsarten>\n` +
`      <Bar>${money(paymentTotals.bar)}</Bar>\n` +
`      <Karte>${money(paymentTotals.karte)}</Karte>\n` +
`    </Zahlungsarten>\n` +
`    <BelegeAnzahl>${summary.receipts}</BelegeAnzahl>\n` +
`  </Euer>\n` +
`  <VesperQuelle>\n` +
`    <Bons>${paid.length}</Bons>\n` +
`    <Hinweis>Dieses XML wurde von Vesper erzeugt und ist vor produktivem Import gegen die installierte WISO Steuer-Version zu validieren.</Hinweis>\n` +
`  </VesperQuelle>\n` +
`</WisoEurExport>\n`;
}
