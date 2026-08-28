import { useEffect, useRef, useState } from "react";
import { Check, Contact, CreditCard, Loader2, Nfc, Unplug, Wifi, X } from "lucide-react";
import { formatEUR } from "@/lib/pos/money";
import {
  createDemoGate,
  isSumupLiveReady,
  PHASE_COPY,
  runSumupCheckout,
  type DemoChoice,
  type SumUpReaderLiveStatus,
  type TerminalPhase,
  type TerminalResult,
} from "@/lib/pos/sumup";
import type { SumUpSettings } from "@/lib/pos/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SumupTerminal({
  amountCents,
  description,
  settings,
  running,
  onFinished,
  onCancel,
}: {
  amountCents: number;
  description: string;
  settings: SumUpSettings;
  running: boolean;
  onFinished: (result: TerminalResult) => void;
  onCancel: () => void;
}) {
  const live = isSumupLiveReady(settings);
  const [phase, setPhase] = useState<TerminalPhase>("idle");
  const [liveStatus, setLiveStatus] = useState<SumUpReaderLiveStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const gateRef = useRef<ReturnType<typeof createDemoGate> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    if (!running) {
      abortRef.current?.abort();
      abortRef.current = null;
      gateRef.current = null;
      setPhase("idle");
      setError(null);
      return;
    }

    const ac = new AbortController();
    abortRef.current = ac;
    const gate = createDemoGate();
    gateRef.current = gate;
    setError(null);
    setPhase("sending");

    void runSumupCheckout({
      settings,
      amountCents,
      description,
      signal: ac.signal,
      demoGate: gate,
      onPhase: (next, extra) => {
        setPhase(next);
        if (extra) setLiveStatus(extra);
      },
    })
      .then((result) => {
        if (ac.signal.aborted) return;
        if (result.status === "failed") setError(result.error ?? "Zahlung fehlgeschlagen");
        onFinishedRef.current(result);
      })
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
        if (msg === "Aborted") return;
        setPhase("failed");
        setError(msg);
        onFinishedRef.current({ status: "failed", error: msg, readerName: settings.readerName });
      });

    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, amountCents, settings.readerId, settings.mode]);

  function choose(choice: DemoChoice) {
    gateRef.current?.choose(choice);
  }

  const waiting = phase === "waiting_card" || phase === "waiting_pin" || phase === "selecting_tip";
  const busy = running && phase !== "successful" && phase !== "failed" && phase !== "cancelled";

  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">
            {live ? "SumUp Cloud" : "SumUp Demo-Terminal"}
          </p>
          <p className="mt-0.5 text-sm font-medium">
            {settings.readerName || "Theke Solo"}
            <span className="text-muted"> · {modelLabel(settings.readerModel)}</span>
          </p>
        </div>
        <StatusPill phase={phase} live={live} battery={liveStatus?.battery} />
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
        <SoloDevice phase={phase} amountCents={amountCents} />
        <div className="min-w-0 flex-1 space-y-3">
          <p className={cn("text-sm", phase === "failed" || phase === "offline" ? "text-danger" : "text-fg")}>
            {error && (phase === "failed" || phase === "offline") ? error : PHASE_COPY[phase]}
          </p>
          {live && liveStatus?.connection ? (
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Wifi className="size-3.5" />
              {liveStatus.connection}
              {liveStatus.firmware ? ` · FW ${liveStatus.firmware}` : ""}
            </p>
          ) : null}

          {!live && running && waiting ? (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="sage" onClick={() => choose("contactless")}>
                <Nfc className="size-4" />
                Kontaktlos
              </Button>
              <Button size="sm" variant="outline" onClick={() => choose("chip")}>
                <CreditCard className="size-4" />
                Chip + PIN
              </Button>
              <Button size="sm" variant="ghost" onClick={() => choose("decline")}>
                Ablehnen
              </Button>
            </div>
          ) : null}

          {busy ? (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                abortRef.current?.abort();
                onCancel();
              }}
            >
              <X className="size-4" />
              Am Terminal abbrechen
            </Button>
          ) : null}

          {phase === "idle" && !live && settings.mode === "live" ? (
            <p className="text-xs text-amber">
              Live-Modus ist an, aber API-Schlüssel oder Terminal fehlen. Es wird das Demo-Terminal
              verwendet — unter Einstellungen kannst du ein echtes Solo/Go koppeln.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function modelLabel(model: string) {
  const m = model.toLowerCase();
  if (m.includes("go")) return "Go";
  if (m.includes("virtual")) return "Virtual Solo";
  return "Solo";
}

function StatusPill({
  phase,
  live,
  battery,
}: {
  phase: TerminalPhase;
  live: boolean;
  battery: number | null | undefined;
}) {
  if (phase === "offline") {
    return (
      <Badge variant="danger">
        <Unplug className="mr-1 size-3" />
        Offline
      </Badge>
    );
  }
  if (phase === "successful") return <Badge variant="sage">Genehmigt</Badge>;
  if (phase === "failed" || phase === "cancelled") return <Badge variant="danger">Abbruch</Badge>;
  if (phase !== "idle") {
    return (
      <Badge variant="amber">
        <Loader2 className="mr-1 size-3 animate-spin" />
        Aktiv
      </Badge>
    );
  }
  return (
    <Badge variant="sage">
      {live ? "Online" : "Demo"}
      {typeof battery === "number" ? ` · ${battery} %` : ""}
    </Badge>
  );
}

function SoloDevice({ phase, amountCents }: { phase: TerminalPhase; amountCents: number }) {
  const glow =
    phase === "waiting_card" || phase === "waiting_pin" || phase === "selecting_tip" || phase === "processing";
  return (
    <div
      className={cn(
        "relative mx-auto w-[168px] shrink-0 rounded-[28px] border border-border bg-accent px-3 pt-3 pb-4 text-accent-fg shadow-[var(--shadow-panel)]",
        glow && "ring-2 ring-sage/50",
      )}
    >
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-accent-fg/20" />
      <div className="flex h-[92px] flex-col items-center justify-center rounded-2xl bg-accent-fg px-3 text-accent">
        {phase === "successful" ? (
          <Check className="size-8 text-sage" />
        ) : phase === "failed" || phase === "cancelled" ? (
          <X className="size-8 text-danger" />
        ) : phase === "waiting_card" ? (
          <NfcWaves />
        ) : phase === "waiting_pin" ? (
          <Contact className="size-7" />
        ) : phase === "idle" ? (
          <p className="font-mono text-xs tracking-widest text-accent/70">SUMUP</p>
        ) : (
          <Loader2 className="size-7 animate-spin" />
        )}
        <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{formatEUR(amountCents)}</p>
      </div>
      <div className="mt-3 flex justify-center">
        <div className="h-8 w-12 rounded-sm border border-accent-fg/20 bg-accent-fg/10" />
      </div>
      <p className="mt-2 text-center font-mono text-[10px] tracking-[0.2em] text-accent-fg/50">SUMUP</p>
    </div>
  );
}

function NfcWaves() {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center">
      <span className="vesper-nfc-ring absolute size-8 rounded-full border border-sage/80" />
      <span className="vesper-nfc-ring absolute size-5 rounded-full border border-sage/70 [animation-delay:180ms]" />
      <Nfc className="relative size-4 text-sage" />
    </div>
  );
}
