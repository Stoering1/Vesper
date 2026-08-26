import { useState, type ReactNode } from "react";
import { formatEUR } from "@/lib/pos/money";
import { usePosStore } from "@/lib/pos/store";
import { nid } from "@/lib/pos/seed";
import type { Course, Product, Station, TaxClass } from "@/lib/pos/types";
import { COURSE_LABEL, STATION_LABEL } from "@/lib/pos/types";
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

const empty = (): Product => ({
  id: nid("p"),
  name: "",
  categoryId: "",
  price: 0,
  taxClass: "food",
  station: "kueche",
  course: "hauptgang",
  modifiers: [],
  stock: 20,
  sku: "",
  happyHourPrice: null,
  active: true,
});

export function ArticlesView() {
  const products = usePosStore((s) => s.products);
  const categories = usePosStore((s) => s.categories);
  const upsertProduct = usePosStore((s) => s.upsertProduct);
  const removeProduct = usePosStore((s) => s.removeProduct);
  const upsertCategory = usePosStore((s) => s.upsertCategory);
  const [edit, setEdit] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const [newCat, setNewCat] = useState("");

  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-xl font-semibold">Artikel</h1>
        <Input className="max-w-xs" placeholder="Suchen…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button
          onClick={() =>
            setEdit({ ...empty(), categoryId: categories[0]?.id ?? "" })
          }
        >
          Neuer Artikel
        </Button>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          className="max-w-xs"
          placeholder="Neue Warengruppe"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => {
            if (!newCat.trim()) return;
            upsertCategory({
              id: nid("c"),
              name: newCat.trim(),
              sort: categories.length + 1,
            });
            setNewCat("");
          }}
        >
          Gruppe anlegen
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface-2 text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Artikel</th>
              <th className="px-3 py-2 font-medium">Gruppe</th>
              <th className="px-3 py-2 font-medium">Preis</th>
              <th className="px-3 py-2 font-medium">Steuer</th>
              <th className="px-3 py-2 font-medium">Station</th>
              <th className="px-3 py-2 font-medium">Aktiv</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-3 py-2">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-subtle">{p.sku}</p>
                </td>
                <td className="px-3 py-2 text-muted">
                  {categories.find((c) => c.id === p.categoryId)?.name}
                </td>
                <td className="px-3 py-2 font-mono tabular-nums">{formatEUR(p.price)}</td>
                <td className="px-3 py-2">{p.taxClass === "food" ? "Speise" : "Getränk"}</td>
                <td className="px-3 py-2">{STATION_LABEL[p.station]}</td>
                <td className="px-3 py-2">{p.active ? "Ja" : "Nein"}</td>
                <td className="px-3 py-2 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setEdit({ ...p })}>
                    Bearbeiten
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="w-[min(96vw,520px)]">
          <DialogHeader>
            <DialogTitle>Artikel</DialogTitle>
          </DialogHeader>
          {edit ? (
            <div className="grid gap-3">
              <Field label="Name">
                <Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </Field>
              <Field label="SKU">
                <Input value={edit.sku} onChange={(e) => setEdit({ ...edit, sku: e.target.value })} />
              </Field>
              <Field label="Warengruppe">
                <select
                  className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
                  value={edit.categoryId}
                  onChange={(e) => setEdit({ ...edit, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preis (€)">
                  <Input
                    value={(edit.price / 100).toFixed(2).replace(".", ",")}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        price: Math.round(Number(e.target.value.replace(",", ".")) * 100) || 0,
                      })
                    }
                  />
                </Field>
                <Field label="Happy Hour (€, leer = aus)">
                  <Input
                    value={edit.happyHourPrice == null ? "" : (edit.happyHourPrice / 100).toFixed(2).replace(".", ",")}
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setEdit({
                        ...edit,
                        happyHourPrice: raw ? Math.round(Number(raw.replace(",", ".")) * 100) : null,
                      });
                    }}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Steuerklasse">
                  <select
                    className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
                    value={edit.taxClass}
                    onChange={(e) => setEdit({ ...edit, taxClass: e.target.value as TaxClass })}
                  >
                    <option value="food">Speise (19 % / 7 % Mitnahme)</option>
                    <option value="drink">Getränk (19 %)</option>
                  </select>
                </Field>
                <Field label="Gang">
                  <select
                    className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
                    value={edit.course}
                    onChange={(e) => setEdit({ ...edit, course: e.target.value as Course })}
                  >
                    {Object.entries(COURSE_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Station">
                <select
                  className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
                  value={edit.station}
                  onChange={(e) => setEdit({ ...edit, station: e.target.value as Station })}
                >
                  {Object.entries(STATION_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-center justify-between">
                <Label>Aktiv</Label>
                <Switch checked={edit.active} onCheckedChange={(v) => setEdit({ ...edit, active: v })} />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            {edit && products.some((p) => p.id === edit.id) ? (
              <Button
                variant="danger"
                onClick={() => {
                  removeProduct(edit.id);
                  setEdit(null);
                }}
              >
                Löschen
              </Button>
            ) : null}
            <Button
              onClick={() => {
                if (edit && edit.name.trim()) {
                  upsertProduct(edit);
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
