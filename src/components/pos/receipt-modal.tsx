import { Printer } from "lucide-react";
import type { Receipt } from "@/lib/pos/types";
import { METHOD_LABEL } from "@/lib/pos/types";
import { formatDateTime, formatEUR, netFromGross, taxFromGross } from "@/lib/pos/money";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";

export function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: Receipt | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  if (!receipt) return null;
  const s = receipt.snapshot;
  const lines = s.lines.filter((l) => !l.voided);
  const gross = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0) - s.discountCents;
  const byRate = new Map<number, number>();
  for (const l of lines) {
    byRate.set(l.taxRate, (byRate.get(l.taxRate) ?? 0) + l.unitPrice * l.qty);
  }

  const title =
    receipt.type === "storno"
      ? "Stornobeleg"
      : receipt.type === "zwischen"
        ? "Zwischenbon"
        : receipt.type === "z-abschluss"
          ? "Z-Abschluss"
          : "Rechnung";

  return (
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          if (receipt.type === "rechnung" || receipt.type === "storno") {
            void navigate({ to: "/" });
          }
        }
      }}
    >
      <DialogContent className="w-[min(96vw,420px)]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div
          id="print-receipt"
          className="rounded-md border border-border bg-accent px-4 py-5 font-mono text-[12px] leading-relaxed text-accent-fg"
        >
          <p className="text-center text-sm font-semibold tracking-wide">{s.restaurantName}</p>
          <p className="text-center">{s.address}</p>
          <p className="text-center">USt-IdNr. {s.taxId}</p>
          <p className="my-2 text-center">--------------------------------</p>
          <p>
            {s.tableLabel} · {s.guestCount} Gäste
          </p>
          <p>Bedienung: {s.staffName}</p>
          <p>Bon {receipt.number} · {formatDateTime(receipt.printedAt)}</p>
          <p className="my-2">--------------------------------</p>
          {lines.map((l, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span>
                {l.qty}× {l.name}
              </span>
              <span>{formatEUR(l.unitPrice * l.qty)}</span>
            </div>
          ))}
          {s.discountCents > 0 ? (
            <div className="flex justify-between">
              <span>{s.discountLabel || "Rabatt"}</span>
              <span>− {formatEUR(s.discountCents)}</span>
            </div>
          ) : null}
          {s.tipCents > 0 ? (
            <div className="flex justify-between">
              <span>Trinkgeld</span>
              <span>{formatEUR(s.tipCents)}</span>
            </div>
          ) : null}
          <p className="my-2">--------------------------------</p>
          <div className="flex justify-between text-sm font-semibold">
            <span>Summe</span>
            <span>{formatEUR(gross + s.tipCents)}</span>
          </div>
          {[...byRate.entries()].map(([rate, g]) => {
            const share = s.discountCents > 0 && gross + s.discountCents > 0
              ? Math.round(g - (s.discountCents * g) / (gross + s.discountCents))
              : g;
            return (
              <div key={rate} className="flex justify-between text-[11px]">
                <span>
                  MwSt {rate}% (netto {formatEUR(netFromGross(share, rate))})
                </span>
                <span>{formatEUR(taxFromGross(share, rate))}</span>
              </div>
            );
          })}
          {s.payments.map((p, i) => (
            <div key={i} className="flex justify-between">
              <span>{METHOD_LABEL[p.method]}</span>
              <span>{formatEUR(p.amountCents)}</span>
            </div>
          ))}
          <p className="my-2">--------------------------------</p>
          <p className="text-[10px] leading-snug">
            TSE-Seriennr. {receipt.tse.serial}
            <br />
            Signaturzähler {receipt.tse.txNumber}
            <br />
            Prüfwert {receipt.tse.signature}
            <br />
            {receipt.tse.processType}
            <br />
            Demo-TSE — nicht zertifiziert nach KassenSichV.
          </p>
          <p className="mt-3 text-center text-[11px]">Vielen Dank für Ihren Besuch.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            Drucken
          </Button>
          <Button
            onClick={() => {
              onClose();
              if (receipt.type === "rechnung" || receipt.type === "storno") {
                void navigate({ to: "/" });
              }
            }}
          >
            Fertig
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
