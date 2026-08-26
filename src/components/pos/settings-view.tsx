import { type ReactNode } from "react";
import { usePosStore } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SettingsView() {
  const settings = usePosStore((s) => s.settings);
  const updateSettings = usePosStore((s) => s.updateSettings);
  const resetDemo = usePosStore((s) => s.resetDemo);

  return (
    <div className="mx-auto max-w-xl p-4 sm:p-6">
      <h1 className="text-xl font-semibold">Einstellungen</h1>
      <p className="mt-1 mb-6 text-sm text-muted">Betrieb, TSE-Demo und Happy Hour.</p>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
