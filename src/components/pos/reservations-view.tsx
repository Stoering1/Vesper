import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { formatDateTime } from "@/lib/pos/money";
import { usePosStore } from "@/lib/pos/store";
import { nid } from "@/lib/pos/seed";
import type { Reservation } from "@/lib/pos/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ReservationsView() {
  const reservations = usePosStore((s) => s.reservations);
  const tables = usePosStore((s) => s.tables);
  const upsertReservation = usePosStore((s) => s.upsertReservation);
  const setReservationStatus = usePosStore((s) => s.setReservationStatus);
  const openTable = usePosStore((s) => s.openTable);
  const getOpenCheckForTable = usePosStore((s) => s.getOpenCheckForTable);
  const navigate = useNavigate();
  const [edit, setEdit] = useState<Reservation | null>(null);

  const upcoming = reservations
    .slice()
    .sort((a, b) => a.at - b.at)
    .filter((r) => r.status !== "storniert");

  function seat(r: Reservation) {
    if (!r.tableId) return;
    setReservationStatus(r.id, "eingetroffen");
    if (!getOpenCheckForTable(r.tableId)) openTable(r.tableId, r.covers);
    void navigate({ to: "/tisch/$tableId", params: { tableId: r.tableId } });
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-4 flex items-center">
        <h1 className="mr-auto text-xl font-semibold">Reservierungen</h1>
        <Button
          onClick={() => {
            const at = new Date();
            at.setHours(19, 0, 0, 0);
            setEdit({
              id: nid("res"),
              name: "",
              phone: "",
              covers: 2,
              at: at.getTime(),
              tableId: tables[0]?.id ?? null,
              notes: "",
              status: "erwartet",
            });
          }}
        >
          Neue Reservierung
        </Button>
      </div>
      <ul className="space-y-2">
        {upcoming.map((r) => (
          <li key={r.id} className="rounded-xl border border-border bg-surface px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-muted">
                  {formatDateTime(r.at)} · {r.covers} Personen
                  {r.tableId ? ` · Tisch ${tables.find((t) => t.id === r.tableId)?.number}` : ""}
                </p>
                {r.notes ? <p className="text-xs text-subtle">{r.notes}</p> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={r.status === "eingetroffen" ? "sage" : r.status === "noshow" ? "danger" : "info"}>
                  {r.status === "erwartet"
                    ? "Erwartet"
                    : r.status === "eingetroffen"
                      ? "Eingetroffen"
                      : r.status === "noshow"
                        ? "No-Show"
                        : r.status}
                </Badge>
                {r.status === "erwartet" && r.tableId ? (
                  <Button size="sm" onClick={() => seat(r)}>
                    Einchecken
                  </Button>
                ) : null}
                {r.status === "erwartet" ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setReservationStatus(r.id, "noshow")}>
                      No-Show
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setReservationStatus(r.id, "storniert")}>
                      Storno
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservierung</DialogTitle>
          </DialogHeader>
          {edit ? (
            <div className="grid gap-3">
              <div>
                <Label>Name</Label>
                <Input className="mt-1" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input className="mt-1" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Personen</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={edit.covers}
                    onChange={(e) => setEdit({ ...edit, covers: Number(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label>Tisch</Label>
                  <select
                    className="mt-1 h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
                    value={edit.tableId ?? ""}
                    onChange={(e) => setEdit({ ...edit, tableId: e.target.value || null })}
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Datum / Uhrzeit</Label>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  value={toLocal(edit.at)}
                  onChange={(e) => setEdit({ ...edit, at: new Date(e.target.value).getTime() })}
                />
              </div>
              <div>
                <Label>Notiz</Label>
                <Input className="mt-1" value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              onClick={() => {
                if (edit?.name) {
                  upsertReservation(edit);
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

function toLocal(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
