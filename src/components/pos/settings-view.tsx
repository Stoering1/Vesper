import { type ReactNode, useState } from "react";
import { Eye, EyeOff, Loader2, Nfc, Unplug, Wifi } from "lucide-react";
import { usePosStore } from "@/lib/pos/store";
import { DEFAULT_SUMUP, withSumupSettings, type SumUpSettings } from "@/lib/pos/types";
import {
  isSumupLiveReady,
  maskApiKey,
  sumupDeleteReader,
  sumupListReaders,
  sumupPairReader,
  sumupReaderStatus,
  type SumUpReader,
  type SumUpReaderLiveStatus,
} from "@/lib/pos/sumup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const settings = usePosStore((s) => s.settings);
  const updateSettings = usePosStore((s) => s.updateSettings);
  const resetDemo = usePosStore((s) => s.resetDemo);

  return (
    <div className="mx-auto max-w-xl p-4 sm:p-6">
      <h1 className="text-xl font-semibold">Einstellungen</h1>
      <p className="mt-1 mb-6 text-sm text-muted">Betrieb, SumUp-Terminal, TSE-Demo und Happy Hour.</p>
      <div className="grid gap-4">
        <Field label="Betriebsname">
          <Input
            value={settings.restaurantName}
            onChange={(e) => updateSettings({ restaurantName: e.target.value })}
          />
        </Field>
        <Field label="Adresse">
          <Input value={settings.address} onChange={(e) => updateSettings({ address: e.target.value })} />
        </Field>
        <Field label="USt-IdNr. / Steuernummer">
          <Input value={settings.taxId} onChange={(e) => updateSettings({ taxId: e.target.value })} />
        </Field>
        <Field label="TSE-Seriennummer (Demo)">
          <Input value={settings.tseSerial} onChange={(e) => updateSettings({ tseSerial: e.target.value })} />
        </Field>
        <Field label="Bon-Fußtext">
          <Input
            value={settings.receiptFooter}
            onChange={(e) => updateSettings({ receiptFooter: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Happy Hour von">
            <Input
              type="time"
              value={settings.happyHourStart}
              onChange={(e) => updateSettings({ happyHourStart: e.target.value })}
            />
          </Field>
          <Field label="Happy Hour bis">
            <Input
              type="time"
              value={settings.happyHourEnd}
              onChange={(e) => updateSettings({ happyHourEnd: e.target.value })}
            />
          </Field>
        </div>
        <p className="text-xs text-subtle">
          Nächster Bon {settings.nextBonNumber} · TSE-Zähler {settings.tseCounter}
        </p>

        <SumupSettingsCard />

        <Button
          variant="outline"
          onClick={() => {
            resetDemo();
            toast.success("Demo-Daten zurückgesetzt");
          }}
        >
          Demo zurücksetzen
        </Button>
      </div>
    </div>
  );
}

function SumupSettingsCard() {
  const raw = usePosStore((s) => s.settings);
  const updateSettings = usePosStore((s) => s.updateSettings);
  const sumup = withSumupSettings(raw).sumup;
  const liveOn = sumup.mode === "live";
  const ready = isSumupLiveReady(sumup);

  const [showKey, setShowKey] = useState(false);
  const [pairingCode, setPairingCode] = useState("");
  const [readerName, setReaderName] = useState(sumup.readerName || "Theke");
  const [busy, setBusy] = useState<"pair" | "list" | "status" | "delete" | null>(null);
  const [readers, setReaders] = useState<SumUpReader[]>([]);
  const [status, setStatus] = useState<SumUpReaderLiveStatus | null>(null);

  function patch(next: Partial<SumUpSettings>) {
    updateSettings({ sumup: next });
  }

  const creds = { apiKey: sumup.apiKey, merchantCode: sumup.merchantCode };

  async function pair() {
    if (!sumup.apiKey.trim() || !sumup.merchantCode.trim()) {
      toast.error("Bitte zuerst Händlercode und API-Schlüssel eintragen");
      return;
    }
    setBusy("pair");
    try {
      const res = await sumupPairReader({
        data: { ...creds, pairingCode, name: readerName },
      });
      if (!res.ok || !res.data) {
        toast.error(res.error ?? "Koppeln fehlgeschlagen");
        return;
      }
      patch({
        readerId: res.data.id,
        readerName: res.data.name,
        readerModel: res.data.model,
        mode: "live",
      });
      setReaders((list) => {
        const rest = list.filter((r) => r.id !== res.data!.id);
        return [res.data!, ...rest];
      });
      toast.success(`${res.data.name} gekoppelt`);
      setPairingCode("");
    } finally {
      setBusy(null);
    }
  }

  async function refreshList() {
    if (!sumup.apiKey.trim() || !sumup.merchantCode.trim()) {
      toast.error("Bitte Händlercode und API-Schlüssel eintragen");
      return;
    }
    setBusy("list");
    try {
      const res = await sumupListReaders({ data: creds });
      if (!res.ok || !res.data) {
        toast.error(res.error ?? "Terminals konnten nicht geladen werden");
        return;
      }
      setReaders(res.data);
      if (res.data.length === 0) toast.message("Keine gekoppelten Terminals");
    } finally {
      setBusy(null);
    }
  }

  async function pingStatus() {
    if (!ready) {
      toast.error("Bitte zuerst ein Terminal koppeln");
      return;
    }
    setBusy("status");
    try {
      const res = await sumupReaderStatus({ data: { ...creds, readerId: sumup.readerId } });
      if (!res.ok || !res.data) {
        toast.error(res.error ?? "Status nicht erreichbar");
        setStatus(null);
        return;
      }
      setStatus(res.data);
      toast.success(res.data.online ? "Terminal online" : "Terminal offline");
    } finally {
      setBusy(null);
    }
  }

  async function unpair() {
    if (!sumup.readerId || sumup.readerId.includes("demo")) return;
    setBusy("delete");
    try {
      const res = await sumupDeleteReader({ data: { ...creds, readerId: sumup.readerId } });
      if (!res.ok) {
        toast.error(res.error ?? "Trennen fehlgeschlagen");
        return;
      }
      patch({
        readerId: DEFAULT_SUMUP.readerId,
        readerName: DEFAULT_SUMUP.readerName,
        readerModel: DEFAULT_SUMUP.readerModel,
      });
      setStatus(null);
      setReaders((list) => list.filter((r) => r.id !== sumup.readerId));
      toast.success("Terminal getrennt");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Nfc className="size-4 text-sage" />
            SumUp Kartenterminal
          </h2>
          <p className="mt-1 text-sm text-muted">
            Solo oder Go per Cloud API ansteuern — Betrag geht direkt aufs Gerät, Gast zahlt kontaktlos
            oder mit Chip.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{liveOn ? "Live" : "Demo"}</span>
          <Switch
            checked={liveOn}
            onCheckedChange={(on) => patch({ mode: on ? "live" : "demo" })}
            aria-label="SumUp Live-Modus"
          />
        </div>
      </div>

      {!liveOn ? (
        <div className="mt-4 rounded-lg border border-border bg-bg p-3 text-sm">
          <p>
            Demo-Terminal <span className="font-medium">{sumup.readerName}</span> ist aktiv. Kartenzahlung
            simuliert Kontaktlos / Chip, ohne echtes Gerät.
          </p>
          <p className="mt-2 text-xs text-subtle">
            Für den Betrieb: SumUp-Konto → API-Schlüssel, Solo einschalten, Pairing-Code hier eingeben.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <Field label="Händlercode">
            <Input
              autoComplete="off"
              spellCheck={false}
              placeholder="z. B. MXXXXXXX"
              value={sumup.merchantCode}
              onChange={(e) => patch({ merchantCode: e.target.value.trim() })}
            />
          </Field>
          <Field label="API-Schlüssel">
            <div className="flex gap-2">
              <Input
                type={showKey ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                placeholder="sup_sk_…"
                value={sumup.apiKey}
                onChange={(e) => patch({ apiKey: e.target.value.trim() })}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={showKey ? "Schlüssel verbergen" : "Schlüssel anzeigen"}
                onClick={() => setShowKey((v) => !v)}
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            {sumup.apiKey ? (
              <p className="mt-1 font-mono text-xs text-subtle">{maskApiKey(sumup.apiKey)}</p>
            ) : null}
          </Field>

          <div className="rounded-lg border border-border bg-bg p-3">
            <p className="text-sm font-medium">Gerät koppeln</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted">
              <li>Solo/Go einschalten und mit WLAN oder Mobilfunk verbinden.</li>
              <li>Am Gerät Pairing starten, bis der 8-stellige Code erscheint.</li>
              <li>Code und Namen hier eintragen, dann koppeln.</li>
            </ol>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                className="font-mono uppercase"
                placeholder="Pairing-Code"
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                maxLength={9}
              />
              <Input
                placeholder="Name, z. B. Theke"
                value={readerName}
                onChange={(e) => setReaderName(e.target.value)}
              />
              <Button onClick={() => void pair()} disabled={busy !== null || pairingCode.length < 8}>
                {busy === "pair" ? <Loader2 className="size-4 animate-spin" /> : null}
                Koppeln
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void refreshList()} disabled={busy !== null}>
              {busy === "list" ? <Loader2 className="size-4 animate-spin" /> : null}
              Terminals laden
            </Button>
            <Button variant="outline" onClick={() => void pingStatus()} disabled={busy !== null || !ready}>
              {busy === "status" ? <Loader2 className="size-4 animate-spin" /> : <Wifi className="size-4" />}
              Status
            </Button>
            {ready ? (
              <Button variant="ghost" onClick={() => void unpair()} disabled={busy !== null}>
                {busy === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Unplug className="size-4" />}
                Trennen
              </Button>
            ) : null}
          </div>

          {status ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant={status.online ? "sage" : "danger"}>{status.online ? "Online" : "Offline"}</Badge>
              <span className="text-muted">{status.state.replaceAll("_", " ")}</span>
              {typeof status.battery === "number" ? (
                <span className="text-muted">{status.battery} % Akku</span>
              ) : null}
              {status.connection ? <span className="text-muted">{status.connection}</span> : null}
            </div>
          ) : null}

          {readers.length > 0 ? (
            <ul className="space-y-1">
              {readers.map((r) => {
                const active = r.id === sumup.readerId;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm",
                        active ? "border-sage bg-sage/10" : "border-border hover:bg-surface-2",
                      )}
                      onClick={() =>
                        patch({
                          readerId: r.id,
                          readerName: r.name,
                          readerModel: r.model,
                        })
                      }
                    >
                      <span>
                        {r.name}
                        <span className="text-muted"> · {r.model}</span>
                      </span>
                      {active ? <Badge variant="sage">aktiv</Badge> : <Badge variant="outline">{r.status}</Badge>}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : ready ? (
            <p className="text-sm text-muted">
              Aktiv: <span className="text-fg">{sumup.readerName}</span> ({sumup.readerModel})
            </p>
          ) : (
            <p className="text-sm text-amber">Noch kein Live-Terminal gekoppelt.</p>
          )}
        </div>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
