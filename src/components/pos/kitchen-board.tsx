import { useMemo, useState } from "react";
import { COURSE_LABEL, STATION_LABEL, type Station, type TicketStatus } from "@/lib/pos/types";
import { formatDuration, formatTime } from "@/lib/pos/money";
import { usePosStore } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COLS: { status: TicketStatus; label: string }[] = [
  { status: "neu", label: "Neu" },
  { status: "in_arbeit", label: "In Arbeit" },
  { status: "bereit", label: "Bereit" },
];

export function KitchenBoard() {
  const tickets = usePosStore((s) => s.tickets);
  const bumpTicket = usePosStore((s) => s.bumpTicket);
  const [station, setStation] = useState<Station | "alle">("alle");

  const filtered = useMemo(
    () =>
      tickets
        .filter((t) => t.status !== "serviert")
        .filter((t) => (station === "alle" ? true : t.station === station))
        .sort((a, b) => a.createdAt - b.createdAt),
    [tickets, station],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <p className="mr-2 font-medium">Bestellmanagement</p>
        {(["alle", "kueche", "bar", "theke"] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={station === s ? "default" : "outline"}
            onClick={() => setStation(s)}
          >
            {s === "alle" ? "Alle Stationen" : STATION_LABEL[s]}
          </Button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 gap-3 overflow-auto p-4 md:grid-cols-3">
        {COLS.map((col) => (
          <div key={col.status} className="flex min-h-0 flex-col rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-sm font-medium">{col.label}</p>
              <Badge>{filtered.filter((t) => t.status === col.status).length}</Badge>
            </div>
            <div className="flex flex-col gap-2 p-2">
              {filtered
                .filter((t) => t.status === col.status)
                .map((t) => (
                  <article
                    key={t.id}
                    className={cn(
                      "rounded-lg border border-border bg-bg p-3",
                      Date.now() - t.createdAt > 15 * 60000 && t.status !== "bereit" && "border-danger/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{t.tableLabel}</p>
                        <p className="text-xs text-muted">
                          {COURSE_LABEL[t.course]} · {STATION_LABEL[t.station]} · {t.staffName}
                        </p>
                      </div>
                      <p className="font-mono text-xs tabular-nums text-muted">
                        {formatTime(t.createdAt)} · {formatDuration(t.createdAt)}
                      </p>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm">
                      {t.items.map((i, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{i.qty}× {i.name}</span>
                          {i.modifiers.length ? (
                            <span className="block text-xs text-muted">{i.modifiers.join(", ")}</span>
                          ) : null}
                          {i.note ? <span className="block text-xs text-amber">{i.note}</span> : null}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex gap-2">
                      {t.status === "neu" ? (
                        <Button size="sm" className="flex-1" onClick={() => bumpTicket(t.id, "in_arbeit")}>
                          Start
                        </Button>
                      ) : null}
                      {t.status === "in_arbeit" ? (
                        <Button size="sm" variant="sage" className="flex-1" onClick={() => bumpTicket(t.id, "bereit")}>
                          Fertig
                        </Button>
                      ) : null}
                      {t.status === "bereit" ? (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => bumpTicket(t.id, "serviert")}>
                          Serviert
                        </Button>
                      ) : null}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
