import { useState } from "react";
import { ROLE_LABEL, type Staff, type StaffRole } from "@/lib/pos/types";
import { checkTotal, lastCloseAt, usePosStore } from "@/lib/pos/store";
import { formatEUR } from "@/lib/pos/money";
import { nid } from "@/lib/pos/seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function StaffView() {
  const staff = usePosStore((s) => s.staff);
  const checks = usePosStore((s) => s.checks);
  const dayCloses = usePosStore((s) => s.dayCloses);
  const upsertStaff = usePosStore((s) => s.upsertStaff);
  const [edit, setEdit] = useState<Staff | null>(null);
  const since = lastCloseAt(dayCloses);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-4 flex items-center">
        <h1 className="mr-auto text-xl font-semibold">Personal</h1>
        <Button
          onClick={() =>
            setEdit({ id: nid("s"), name: "", pin: "1234", role: "service", active: true })
          }
        >
          Neu
        </Button>
      </div>
      <ul className="space-y-2">
        {staff.map((s) => {
          const sales = checks
            .filter((c) => c.staffId === s.id && c.status === "paid" && (c.paidAt ?? 0) >= since)
            .reduce((n, c) => n + checkTotal(c), 0);
          return (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted">
                  {ROLE_LABEL[s.role]} · PIN {s.pin} · {s.active ? "aktiv" : "inaktiv"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-mono text-sm tabular-nums">{formatEUR(sales)}</p>
                <Button size="sm" variant="outline" onClick={() => setEdit({ ...s })}>
                  Bearbeiten
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mitarbeiter</DialogTitle>
          </DialogHeader>
          {edit ? (
            <div className="grid gap-3">
              <div>
                <Label>Name</Label>
                <Input className="mt-1" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </div>
              <div>
                <Label>PIN (4–6 Ziffern)</Label>
                <Input className="mt-1" value={edit.pin} onChange={(e) => setEdit({ ...edit, pin: e.target.value })} />
              </div>
              <div>
                <Label>Rolle</Label>
                <select
                  className="mt-1 h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
                  value={edit.role}
                  onChange={(e) => setEdit({ ...edit, role: e.target.value as StaffRole })}
                >
                  {Object.entries(ROLE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Aktiv</Label>
                <Switch checked={edit.active} onCheckedChange={(v) => setEdit({ ...edit, active: v })} />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              onClick={() => {
                if (edit?.name && edit.pin) {
                  upsertStaff(edit);
                  setEdit(null);
                }
              }}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
