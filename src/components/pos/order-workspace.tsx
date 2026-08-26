import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Ban,
  ChefHat,
  Minus,
  Plus,
  ReceiptText,
  Split,
  StickyNote,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatEUR } from "@/lib/pos/money";
import {
  checkSubtotal,
  checkTotal,
  effectivePrice,
  itemTotal,
  tableLabel,
  usePosStore,
  vatBreakdown,
} from "@/lib/pos/store";
import { COURSE_LABEL, COURSE_ORDER, type Product } from "@/lib/pos/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentFlow } from "@/components/pos/payment-flow";
import { ReceiptModal } from "@/components/pos/receipt-modal";
import type { Receipt } from "@/lib/pos/types";

export function OrderWorkspace({ checkId }: { checkId: string }) {
  const navigate = useNavigate();
  const check = usePosStore((s) => s.checks.find((c) => c.id === checkId));
  const products = usePosStore((s) => s.products);
  const categories = usePosStore((s) => s.categories);
  const tables = usePosStore((s) => s.tables);
  const settings = usePosStore((s) => s.settings);
  const addItem = usePosStore((s) => s.addItem);
  const setItemQty = usePosStore((s) => s.setItemQty);
  const setItemNote = usePosStore((s) => s.setItemNote);
  const voidItem = usePosStore((s) => s.voidItem);
  const sendCourses = usePosStore((s) => s.sendCourses);
  const holdCourse = usePosStore((s) => s.holdCourse);
  const setDiscount = usePosStore((s) => s.setDiscount);
  const setGuests = usePosStore((s) => s.setGuests);
  const requestBill = usePosStore((s) => s.requestBill);
  const splitItems = usePosStore((s) => s.splitItems);
  const printZwischen = usePosStore((s) => s.printZwischen);
  const voidCheck = usePosStore((s) => s.voidCheck);

  const [catId, setCatId] = useState(categories[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [modProduct, setModProduct] = useState<Product | null>(null);
  const [modSel, setModSel] = useState<Record<string, string[]>>({});
  const [noteItem, setNoteItem] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [splitMode, setSplitMode] = useState(false);
  const [splitSel, setSplitSel] = useState<string[]>([]);
  const [discOpen, setDiscOpen] = useState(false);
  const [discPct, setDiscPct] = useState("10");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [voidOpen, setVoidOpen] = useState(false);
  const [voidReason, setVoidReason] = useState("Irrtum");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (!p.active) return false;
      if (q) return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return p.categoryId === catId;
    });
  }, [products, catId, query]);

  if (!check || check.status === "paid" || check.status === "voided") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-lg font-medium">Vorgang geschlossen</p>
        <Button variant="outline" onClick={() => navigate({ to: "/" })}>
          Zum Tischplan
        </Button>
      </div>
    );
  }

  function tapProduct(product: Product) {
    if (product.modifiers.length > 0) {
      const initial: Record<string, string[]> = {};
      for (const g of product.modifiers) initial[g.id] = [];
      setModSel(initial);
      setModProduct(product);
      return;
    }
    addItem(check!.id, product.id);
  }

  function confirmModifiers() {
    if (!modProduct || !check) return;
    for (const g of modProduct.modifiers) {
      if (g.required && (modSel[g.id]?.length ?? 0) === 0) {
        toast.error(`${g.name} ist Pflicht`);
        return;
      }
    }
    const names = modProduct.modifiers.flatMap((g) =>
      g.options.filter((o) => (modSel[g.id] ?? []).includes(o.id)).map((o) => o.name),
    );
    addItem(check.id, modProduct.id, { modifiers: names });
    setModProduct(null);
  }

  function sendOpen() {
    if (!check) return;
    const courses = COURSE_ORDER.filter(
      (c) =>
        !check.courseHold[c] &&
        check.items.some((i) => i.course === c && !i.sent && !i.voided),
    );
    if (courses.length === 0) {
      toast.message("Nichts zu senden");
      return;
    }
    sendCourses(check.id, courses);
    toast.success("An Küche / Bar gesendet");
  }

  function doSplit() {
    if (!check) return;
    const id = splitItems(check.id, splitSel);
    if (!id) {
      toast.error("Mindestens eine Position muss bleiben");
      return;
    }
    setSplitMode(false);
    setSplitSel([]);
    toast.success("Rechnung geteilt");
  }

  const vat = vatBreakdown(check);
  const unsent = check.items.filter((i) => !i.sent && !i.voided);

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-border lg:border-r lg:border-b-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <p className="mr-2 font-medium">{tableLabel(tables, check.tableId, check.type)}</p>
          <Badge variant={check.status === "billed" ? "amber" : "sage"}>
            {check.status === "billed" ? "Rechnung" : "Offen"}
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <Users className="size-4 text-muted" />
            <Input
              className="h-9 w-16"
              type="number"
              min={1}
              value={check.guestCount}
              onChange={(e) => setGuests(check.id, Number(e.target.value) || 1)}
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-3 py-2">
          {categories
            .slice()
            .sort((a, b) => a.sort - b.sort)
            .map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={c.id === catId && !query ? "default" : "outline"}
                onClick={() => {
                  setCatId(c.id);
                  setQuery("");
                }}
              >
                {c.name}
              </Button>
            ))}
        </div>
        <div className="px-3 pb-2">
          <Input
            placeholder="Artikel suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => {
              const price = effectivePrice(p, settings);
              const hh = p.happyHourPrice != null && price === p.happyHourPrice;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => tapProduct(p)}
                  className="flex min-h-24 flex-col justify-between rounded-lg border border-border bg-surface-2 p-3 text-left transition-colors hover:border-accent/40"
                >
                  <span className="text-sm font-medium leading-snug">{p.name}</span>
                  <span className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-sm tabular-nums">{formatEUR(price)}</span>
                    {hh ? <Badge variant="amber">HH</Badge> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </section>

      <aside className="flex w-full shrink-0 flex-col bg-surface lg:w-[380px]">
        <ScrollArea className="min-h-0 flex-1">
          <div className="p-3">
            {COURSE_ORDER.map((course) => {
              const items = check.items.filter((i) => i.course === course);
              if (items.length === 0) return null;
              const held = !!check.courseHold[course];
              return (
                <div key={course} className="mb-4">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-xs font-medium tracking-wide text-muted uppercase">
                      {COURSE_LABEL[course]}
                    </p>
                    {held ? <Badge variant="amber">gehalten</Badge> : null}
                    <button
                      type="button"
                      className="ml-auto text-xs text-muted hover:text-fg"
                      onClick={() => holdCourse(check.id, course, !held)}
                    >
                      {held ? "Freigeben" : "Halten"}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "rounded-md border border-border bg-bg px-2 py-2",
                          item.voided && "opacity-40",
                          splitMode && splitSel.includes(item.id) && "border-accent",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {splitMode && !item.voided ? (
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={splitSel.includes(item.id)}
                              onChange={(e) =>
                                setSplitSel((s) =>
                                  e.target.checked ? [...s, item.id] : s.filter((x) => x !== item.id),
                                )
                              }
                            />
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <p className={cn("text-sm font-medium", item.voided && "line-through")}>
                              {item.name}
                            </p>
                            {item.modifiers.length ? (
                              <p className="text-xs text-muted">{item.modifiers.join(", ")}</p>
                            ) : null}
                            {item.note ? <p className="text-xs text-amber">{item.note}</p> : null}
                            <p className="text-[11px] text-subtle">
                              {item.sent ? "gesendet" : "neu"}
                              {item.seat ? ` · Platz ${item.seat}` : ""}
                            </p>
                          </div>
                          <p className="font-mono text-sm tabular-nums">{formatEUR(itemTotal(item))}</p>
                        </div>
                        {!item.voided && !splitMode ? (
                          <div className="mt-2 flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8"
                              disabled={item.sent}
                              onClick={() => setItemQty(check.id, item.id, item.qty - 1)}
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-6 text-center font-mono text-sm tabular-nums">{item.qty}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8"
                              disabled={item.sent}
                              onClick={() => setItemQty(check.id, item.id, item.qty + 1)}
                            >
                              <Plus className="size-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8"
                              onClick={() => {
                                setNoteItem(item.id);
                                setNote(item.note);
                              }}
                            >
                              <StickyNote className="size-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8"
                              onClick={() => voidItem(check.id, item.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {check.items.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted">Artikel antippen, um zu bestellen.</p>
            ) : null}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-3">
          <Row label="Zwischensumme" value={formatEUR(checkSubtotal(check))} />
          {check.discountCents > 0 ? (
            <Row
              label={check.discountLabel || "Rabatt"}
              value={`− ${formatEUR(check.discountCents)}`}
            />
          ) : null}
          {vat.map((v) => (
            <Row
              key={v.rate}
              label={`MwSt ${v.rate} %`}
              value={formatEUR(v.tax)}
              muted
            />
          ))}
          <Row label="Gesamt" value={formatEUR(checkTotal(check))} strong />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={sendOpen} disabled={unsent.length === 0}>
              <ChefHat className="size-4" />
              Senden
            </Button>
            <Button variant="outline" onClick={() => setDiscOpen(true)}>
              Rabatt
            </Button>
            <Button
              variant={splitMode ? "sage" : "outline"}
              onClick={() => {
                setSplitMode((v) => !v);
                setSplitSel([]);
              }}
            >
              <Split className="size-4" />
              Splitten
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const r = printZwischen(check.id);
                if (r) setReceipt(r);
              }}
            >
              <ReceiptText className="size-4" />
              Zwischenbon
            </Button>
            {splitMode ? (
              <Button className="col-span-2" onClick={doSplit} disabled={splitSel.length === 0}>
                Ausgewählte Positionen abtrennen
              </Button>
            ) : (
              <>
                <Button variant="amber" onClick={() => requestBill(check.id)}>
                  Rechnung bitte
                </Button>
                <Button onClick={() => setPayOpen(true)} disabled={checkSubtotal(check) <= 0}>
                  Bezahlen
                </Button>
              </>
            )}
            <Button variant="ghost" className="col-span-2 text-danger" onClick={() => setVoidOpen(true)}>
              <Ban className="size-4" />
              Vorgang stornieren
            </Button>
          </div>
        </div>
      </aside>

      <Dialog open={!!modProduct} onOpenChange={(o) => !o && setModProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modProduct?.name}</DialogTitle>
            <DialogDescription>Optionen wählen</DialogDescription>
          </DialogHeader>
          {modProduct?.modifiers.map((g) => (
            <div key={g.id} className="mb-3">
              <p className="mb-2 text-sm font-medium">
                {g.name}
                {g.required ? " *" : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const on = (modSel[g.id] ?? []).includes(o.id);
                  return (
                    <Button
                      key={o.id}
                      size="sm"
                      variant={on ? "default" : "outline"}
                      onClick={() =>
                        setModSel((s) => {
                          const cur = s[g.id] ?? [];
                          if (g.multi) {
                            return {
                              ...s,
                              [g.id]: on ? cur.filter((x) => x !== o.id) : [...cur, o.id],
                            };
                          }
                          return { ...s, [g.id]: on ? [] : [o.id] };
                        })
                      }
                    >
                      {o.name}
                      {o.priceDelta ? ` ${formatEUR(o.priceDelta)}` : ""}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModProduct(null)}>
              Abbrechen
            </Button>
            <Button onClick={confirmModifiers}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!noteItem} onOpenChange={(o) => !o && setNoteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz / Platz</DialogTitle>
          </DialogHeader>
          <Label htmlFor="note">Küchennotiz</Label>
          <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          <DialogFooter>
            <Button
              onClick={() => {
                if (noteItem) setItemNote(check.id, noteItem, note);
                setNoteItem(null);
              }}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={discOpen} onOpenChange={setDiscOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rabatt</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            {["5", "10", "15", "20"].map((p) => (
              <Button key={p} variant={discPct === p ? "default" : "outline"} onClick={() => setDiscPct(p)}>
                {p} %
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDiscount(check.id, 0, "");
                setDiscOpen(false);
              }}
            >
              Entfernen
            </Button>
            <Button
              onClick={() => {
                const pct = Number(discPct) || 0;
                const cents = Math.round((checkSubtotal(check) * pct) / 100);
                setDiscount(check.id, cents, `Rabatt ${pct} %`);
                setDiscOpen(false);
              }}
            >
              Anwenden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={voidOpen} onOpenChange={setVoidOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vorgang stornieren</DialogTitle>
            <DialogDescription>TSE-Storno wird erzeugt. Grund angeben.</DialogDescription>
          </DialogHeader>
          <Input value={voidReason} onChange={(e) => setVoidReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoidOpen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                const r = voidCheck(check.id, voidReason);
                setVoidOpen(false);
                if (r) setReceipt(r);
                else void navigate({ to: "/" });
              }}
            >
              Stornieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaymentFlow
        open={payOpen}
        onOpenChange={setPayOpen}
        check={check}
        onPaid={(r) => {
          setPayOpen(false);
          setReceipt(r);
        }}
      />
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={cn("flex justify-between text-sm", muted && "text-muted", strong && "mt-1 text-base font-semibold")}>
      <span>{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}
