import { usePosStore } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function InventoryView() {
  const products = usePosStore((s) => s.products);
  const adjustStock = usePosStore((s) => s.adjustStock);
  const tracked = products.filter((p) => p.stock != null);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="mb-4 text-xl font-semibold">Inventar</h1>
      <p className="mb-4 text-sm text-muted">
        Bestand wird beim Bezahlen automatisch abgezogen. Unter 8 Stück gilt als kritisch.
      </p>
      <ul className="space-y-2">
        {tracked.map((p) => {
          const low = (p.stock ?? 0) < 8;
          return (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-subtle">{p.sku}</p>
              </div>
              {low ? <Badge variant="danger">Niedrig</Badge> : <Badge variant="sage">OK</Badge>}
              <p className="w-12 text-right font-mono tabular-nums">{p.stock}</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => adjustStock(p.id, -1)}>
                  −1
                </Button>
                <Button size="sm" variant="outline" onClick={() => adjustStock(p.id, 1)}>
                  +1
                </Button>
                <Button size="sm" variant="muted" onClick={() => adjustStock(p.id, 10)}>
                  +10
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
