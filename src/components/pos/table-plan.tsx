import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightLeft, Merge, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatEUR } from "@/lib/pos/money";
import {
  checkTotal,
  tableLabel,
  tableStatus,
  usePosStore,
} from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FloorTable } from "@/lib/pos/types";

export function TablePlan() {
  const rooms = usePosStore((s) => s.rooms);
  const tables = usePosStore((s) => s.tables);
  const checks = usePosStore((s) => s.checks);
  const reservations = usePosStore((s) => s.reservations);
  const openTable = usePosStore((s) => s.openTable);
  const moveCheck = usePosStore((s) => s.moveCheck);
  const mergeChecks = usePosStore((s) => s.mergeChecks);
  const getOpenCheckForTable = usePosStore((s) => s.getOpenCheckForTable);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [guestFor, setGuestFor] = useState<FloorTable | null>(null);
  const [guests, setGuests] = useState(2);
  const [moveFrom, setMoveFrom] = useState<string | null>(null);

  const roomTables = useMemo(
    () => tables.filter((t) => t.roomId === roomId),
    [tables, roomId],
  );

  function enterTable(table: FloorTable) {
    const existing = getOpenCheckForTable(table.id);
    if (existing) {
      void navigate({ to: "/tisch/$tableId", params: { tableId: table.id } });
      return;
    }
    setGuests(table.seats);
    setGuestFor(table);
  }

  function confirmOpen() {
    if (!guestFor) return;
    openTable(guestFor.id, guests);
    const id = guestFor.id;
    setGuestFor(null);
    void navigate({ to: "/tisch/$tableId", params: { tableId: id } });
  }

  function onTableClick(table: FloorTable) {
    if (moveFrom) {
      const ok = moveCheck(moveFrom, table.id);
      setMoveFrom(null);
      if (ok) void navigate({ to: "/tisch/$tableId", params: { tableId: table.id } });
      return;
    }
    enterTable(table);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        {rooms.map((r) => (
          <Button
            key={r.id}
            size="sm"
            variant={r.id === roomId ? "default" : "outline"}
            onClick={() => setRoomId(r.id)}
          >
            {r.name}
          </Button>
        ))}
        <div className="ml-auto hidden items-center gap-4 text-xs text-muted sm:flex">
          <Legend swatch="border-border bg-surface-2" label="Frei" />
          <Legend swatch="border-sage/50 bg-sage/20" label="Besetzt" />
          <Legend swatch="border-amber/50 bg-amber/20" label="Rechnung" />
          <Legend swatch="border-info/50 bg-info/15" label="Reserviert" />
        </div>
      </div>

      <div className="relative hidden min-h-[520px] flex-1 p-4 md:block">
        <div className="relative h-full min-h-[520px] overflow-hidden rounded-xl border border-border bg-surface">
          <div className="pointer-events-none absolute inset-6 rounded-lg border border-dashed border-border/80" />
          {roomTables.map((table) => {
            const status = tableStatus(table.id, checks, reservations);
            const check = getOpenCheckForTable(table.id);
            return (
              <button
                key={table.id}
                type="button"
                onClick={() => onTableClick(table)}
                onContextMenu={(e) => e.preventDefault()}
                className={cn(
                  "absolute flex flex-col items-center justify-center gap-0.5 border px-2 text-center transition-[transform,background-color] duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                  table.shape === "round" ? "rounded-full" : "rounded-lg",
                  status === "free" && "border-border bg-surface-2 text-muted",
                  status === "occupied" && "border-sage/50 bg-sage/20 text-fg",
                  status === "billed" && "border-amber/50 bg-amber/20 text-fg",
                  status === "reserved" && "border-info/50 bg-info/15 text-fg",
                  moveFrom && "ring-1 ring-accent/30",
                )}
                style={{
                  left: `${table.x}%`,
                  top: `${table.y}%`,
                  width: `${table.w}%`,
                  height: `${table.h}%`,
                }}
              >
                <span className="text-lg font-semibold leading-none">{table.number}</span>
                {check ? (
                  <>
                    <span className="font-mono text-xs tabular-nums">{formatEUR(checkTotal(check))}</span>
                    <span className="text-[11px] text-muted">
                      {check.guestCount} · {formatDuration(check.openedAt)}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-subtle">{table.seats} Plätze</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:hidden">
        {roomTables.map((table) => {
          const status = tableStatus(table.id, checks, reservations);
          const check = getOpenCheckForTable(table.id);
          return (
            <button
              key={table.id}
              type="button"
              onClick={() => onTableClick(table)}
              className={cn(
                "flex min-h-24 flex-col items-start justify-between rounded-lg border p-3 text-left",
                status === "free" && "border-border bg-surface-2",
                status === "occupied" && "border-sage/50 bg-sage/20",
                status === "billed" && "border-amber/50 bg-amber/20",
                status === "reserved" && "border-info/50 bg-info/15",
              )}
            >
              <span className="text-lg font-semibold">Tisch {table.number}</span>
              {check ? (
                <span className="font-mono text-sm tabular-nums">{formatEUR(checkTotal(check))}</span>
              ) : (
                <span className="text-xs text-muted">{table.seats} Plätze</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden border-t border-border px-4 py-2 text-xs text-subtle md:block">
        Rechtsklick-Aktionen über das Tisch-Menü in der Liste. Zum Umbuchen: Tisch wählen, dann Ziel antippen.
        {moveFrom ? (
          <span className="ml-2 text-amber">Umbuchen aktiv — Ziel-Tisch wählen oder abbrechen.</span>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto border-t border-border md:block">
        <div className="flex min-w-max gap-2 px-4 py-3">
          {roomTables.map((table) => {
            const check = getOpenCheckForTable(table.id);
            return (
              <DropdownMenu key={table.id}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="font-mono">
                    {table.number}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Tisch {table.number}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => enterTable(table)}>Öffnen</DropdownMenuItem>
                  {check ? (
                    <>
                      <DropdownMenuItem onClick={() => setMoveFrom(check.id)}>
                        <ArrowRightLeft className="size-4" /> Umbuchen
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {checks
                        .filter(
                          (c) =>
                            c.id !== check.id &&
                            c.status !== "paid" &&
                            c.status !== "voided" &&
                            c.tableId,
                        )
                        .slice(0, 8)
                        .map((c) => (
                          <DropdownMenuItem
                            key={c.id}
                            onClick={() => mergeChecks(check.id, c.id)}
                          >
                            <Merge className="size-4" />
                            Zusammenlegen mit {tableLabel(tables, c.tableId, c.type)}
                          </DropdownMenuItem>
                        ))}
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
          {moveFrom ? (
            <Button size="sm" variant="outline" onClick={() => setMoveFrom(null)}>
              Abbrechen
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={!!guestFor} onOpenChange={(o) => !o && setGuestFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tisch {guestFor?.number} öffnen</DialogTitle>
            <DialogDescription>Wie viele Gäste sitzen am Tisch?</DialogDescription>
          </DialogHeader>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor="guests">Gäste</Label>
              <Input
                id="guests"
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value) || 1)}
              />
            </div>
            <Users className="mb-2 size-5 text-muted" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGuestFor(null)}>
              Abbrechen
            </Button>
            <Button onClick={confirmOpen}>Tisch öffnen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-3 rounded-sm border", swatch)} />
      {label}
    </span>
  );
}
