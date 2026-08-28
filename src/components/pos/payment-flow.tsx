import { useEffect, useMemo, useState } from "react";
import { CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";
import { formatEUR, parseEuroInput } from "@/lib/pos/money";
import { checkDue, checkTotal, usePosStore } from "@/lib/pos/store";
import { DEFAULT_SUMUP, withSumupSettings, type Check, type PayMethod, type Receipt } from "@/lib/pos/types";
import { isSumupLiveReady, type TerminalResult } from "@/lib/pos/sumup";
import { SumupTerminal } from "@/components/pos/sumup-terminal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function PaymentFlow({
  open,
  onOpenChange,
  check,
  onPaid,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  check: Check;
  onPaid: (r: Receipt) => void;
}) {
  const pay = usePosStore((s) => s.pay);
  const rawSettings = usePosStore((s) => s.settings);
  const settings = withSumupSettings(rawSettings).sumup;
  const [method, setMethod] = useState<PayMethod>("bar");
  const [received, setReceived] = useState("");
  const [tipPct, setTipPct] = useState(0);
  const [splitCard, setSplitCard] = useState("");
  const [terminalOn, setTerminalOn] = useState(false);
  const [cardAmount, setCardAmount] = useState(0);

  const sub = checkTotal({ ...check, tipCents: 0 });
  const tip = Math.round((sub * tipPct) / 100);
  const total = sub + tip;
  const rec = parseEuroInput(received) || total;
  const change = method === "bar" ? rec - total : 0;
  const live = isSumupLiveReady(settings);

  useEffect(() => {
    if (open) {
      setReceived("");
      setTipPct(0);
      setMethod("bar");
      setSplitCard("");
      setTerminalOn(false);
      setCardAmount(0);
    }
  }, [open, check.id]);

  const keypad = useMemo(() => ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "C"], []);

  function key(k: string) {
    if (k === "C") {
      setReceived("");
      return;
    }
    setReceived((v) => (k === "," && v.includes(",") ? v : v + k));
  }

  function finish(
    payments: {
      method: PayMethod;
      amountCents: number;
      receivedCents: number;
      cardBrand?: string;
      cardLast4?: string;
      sumupTxId?: string;
      readerName?: string;
    }[],
  ) {
    const receipt = pay(check.id, payments, tip);
    if (receipt) {
      toast.success("Bezahlt");
      onPaid(receipt);
    } else {
      toast.message("Teilzahlung erfasst");
    }
  }

  function payCash() {
    if (rec < total) {
      finish([{ method: "bar", amountCents: rec, receivedCents: rec }]);
      return;
    }
    finish([{ method: "bar", amountCents: total, receivedCents: rec }]);
  }

  function startCard(amount: number) {
    if (amount <= 0) {
      toast.error("Kartenbetrag muss größer als 0 sein");
      return;
    }
    setCardAmount(amount);
    setTerminalOn(true);
  }

  function payMixed() {
    const card = parseEuroInput(splitCard);
    if (card <= 0 || card >= total) {
      toast.error("Kartenanteil muss zwischen 0 und Gesamt liegen");
      return;
    }
    startCard(card);
  }

  function onTerminalDone(result: TerminalResult) {
    setTerminalOn(false);
    if (result.status === "successful") {
      const cardPay = {
        method: "karte" as const,
        amountCents: cardAmount,
        receivedCents: cardAmount,
        cardBrand: result.cardBrand,
        cardLast4: result.cardLast4,
        sumupTxId: result.sumupTxId,
        readerName: result.readerName ?? settings.readerName,
      };
      if (cardAmount < total) {
        const cash = total - cardAmount;
        finish([cardPay, { method: "bar", amountCents: cash, receivedCents: cash }]);
      } else {
        finish([cardPay]);
      }
      return;
    }
    if (result.status === "cancelled") {
      toast.message("Kartenzahlung abgebrochen");
      return;
    }
    toast.error(result.error ?? "Kartenzahlung fehlgeschlagen");
  }

  const tableHint = check.tableId ? `Tischzahlung` : "Theke";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && terminalOn) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="w-[min(96vw,640px)]">
        <DialogHeader>
          <DialogTitle>Zahlung</DialogTitle>
          <DialogDescription>
            Offen {formatEUR(checkDue({ ...check, tipCents: tip }))}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted">Zu zahlen</p>
            <p className="font-mono text-3xl font-semibold tabular-nums">{formatEUR(total)}</p>
          </div>
          <div className="flex gap-1">
            {[0, 5, 10].map((p) => (
              <Button
                key={p}
                size="sm"
                variant={tipPct === p ? "default" : "outline"}
                disabled={terminalOn}
                onClick={() => setTipPct(p)}
              >
                {p === 0 ? "ohne Trinkgeld" : `${p} %`}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant={method === "bar" ? "sage" : "outline"}
            disabled={terminalOn}
            onClick={() => setMethod("bar")}
          >
            <Banknote className="size-4" />
            Bar
          </Button>
          <Button
            variant={method === "karte" ? "sage" : "outline"}
            disabled={terminalOn}
            onClick={() => setMethod("karte")}
          >
            <CreditCard className="size-4" />
            Karte
          </Button>
        </div>

        {method === "bar" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Erhalten</Label>
              <Input
                className="mt-1 font-mono text-lg tabular-nums"
                value={received}
                onChange={(e) => setReceived(e.target.value)}
                placeholder={formatEUR(total)}
              />
              <div className="mt-2 grid grid-cols-3 gap-1">
                {keypad.map((k) => (
                  <Button key={k} variant="muted" className="h-12 text-lg" onClick={() => key(k)}>
                    {k}
                  </Button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {[500, 1000, 2000, 5000, 10000].map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant="outline"
                    onClick={() => setReceived((c / 100).toFixed(2).replace(".", ","))}
                  >
                    {formatEUR(c)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-border bg-bg p-4">
              <div>
                <p className="text-xs text-muted">Rückgeld</p>
                <p className={cn("font-mono text-3xl tabular-nums", change < 0 && "text-danger")}>
                  {formatEUR(Math.max(0, change))}
                </p>
              </div>
              <Button size="xl" className="mt-4 w-full" onClick={payCash}>
                Bar kassieren
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <SumupTerminal
              amountCents={terminalOn ? cardAmount : total}
              description={`${rawSettings.restaurantName} · ${tableHint}`}
              settings={settings.readerName ? settings : { ...DEFAULT_SUMUP, ...settings }}
              running={terminalOn}
              onFinished={onTerminalDone}
              onCancel={() => {
                setTerminalOn(false);
                toast.message("Kartenzahlung abgebrochen");
              }}
            />
            {!terminalOn ? (
              <>
                <div>
                  <Label>Oder gemischt: Kartenanteil</Label>
                  <Input
                    className="mt-1 font-mono"
                    placeholder="z. B. 20,00"
                    value={splitCard}
                    onChange={(e) => setSplitCard(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" size="lg" onClick={() => startCard(total)}>
                    <CreditCard className="size-4" />
                    {live ? "An SumUp senden" : "Karte kassieren"}
                  </Button>
                  <Button variant="outline" size="lg" onClick={payMixed} disabled={!splitCard}>
                    Gemischt
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
