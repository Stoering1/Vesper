import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Category,
  Check,
  CheckType,
  Course,
  DayClose,
  FloorTable,
  KitchenTicket,
  OrderItem,
  PayMethod,
  PosSettings,
  Product,
  Receipt,
  Reservation,
  ReservationStatus,
  Room,
  Staff,
  TicketStatus,
} from "./types";
import { COURSE_ORDER, DEFAULT_SUMUP, withSumupSettings } from "./types";
import { createSeedState, nid } from "./seed";
import { isHappyHour, netFromGross, taxFromGross, todayKey } from "./money";
import { signTse } from "./tse";

export interface PosData {
  rooms: Room[];
  tables: FloorTable[];
  categories: Category[];
  products: Product[];
  staff: Staff[];
  currentStaffId: string | null;
  checks: Check[];
  tickets: KitchenTicket[];
  receipts: Receipt[];
  reservations: Reservation[];
  dayCloses: DayClose[];
  settings: PosSettings;
}

interface PosState extends PosData {
  hydrated: boolean;
  setHydrated: () => void;
  unlock: (pin: string) => Staff | null;
  lock: () => void;
  openTable: (tableId: string, guestCount: number) => string;
  openWalkIn: (type: CheckType, guestCount: number) => string;
  getOpenCheckForTable: (tableId: string) => Check | undefined;
  addItem: (
    checkId: string,
    productId: string,
    opts?: { modifiers?: string[]; note?: string; seat?: number | null; qty?: number },
  ) => string | null;
  setItemQty: (checkId: string, itemId: string, qty: number) => void;
  setItemNote: (checkId: string, itemId: string, note: string) => void;
  setItemSeat: (checkId: string, itemId: string, seat: number | null) => void;
  voidItem: (checkId: string, itemId: string) => void;
  sendCourses: (checkId: string, courses: Course[]) => void;
  holdCourse: (checkId: string, course: Course, hold: boolean) => void;
  setDiscount: (checkId: string, cents: number, label: string) => void;
  setTip: (checkId: string, cents: number) => void;
  setGuests: (checkId: string, n: number) => void;
  setCheckNotes: (checkId: string, notes: string) => void;
  requestBill: (checkId: string) => void;
  moveCheck: (checkId: string, toTableId: string) => boolean;
  mergeChecks: (fromId: string, toId: string) => boolean;
  splitItems: (checkId: string, itemIds: string[]) => string | null;
  pay: (
    checkId: string,
    payments: {
      method: PayMethod;
      amountCents: number;
      receivedCents: number;
      cardBrand?: string;
      cardLast4?: string;
      sumupTxId?: string;
      readerName?: string;
    }[],
    tipCents: number,
  ) => Receipt | null;
  voidCheck: (checkId: string, reason: string) => Receipt | null;
  printZwischen: (checkId: string) => Receipt | null;
  bumpTicket: (ticketId: string, status: TicketStatus) => void;
  upsertProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  upsertCategory: (cat: Category) => void;
  upsertStaff: (s: Staff) => void;
  adjustStock: (productId: string, delta: number) => void;
  upsertReservation: (r: Reservation) => void;
  setReservationStatus: (id: string, status: ReservationStatus, tableId?: string | null) => void;
  closeDay: (countedCash: number) => DayClose | null;
  updateSettings: (patch: Partial<Omit<PosSettings, "sumup">> & { sumup?: Partial<PosSettings["sumup"]> }) => void;
  upsertTable: (t: FloorTable) => void;
  resetDemo: () => void;
}

export function effectivePrice(product: Product, settings: PosSettings): number {
  if (
    product.happyHourPrice != null &&
    isHappyHour(settings.happyHourStart, settings.happyHourEnd)
  ) {
    return product.happyHourPrice;
  }
  return product.price;
}

export function effectiveTax(product: Product, type: CheckType): 7 | 19 {
  if (product.taxClass === "food" && (type === "takeaway" || type === "lieferung")) return 7;
  return 19;
}

export function itemTotal(item: OrderItem): number {
  if (item.voided) return 0;
  return item.unitPrice * item.qty;
}

export function checkSubtotal(check: Check): number {
  return check.items.reduce((s, i) => s + itemTotal(i), 0);
}

export function checkTotal(check: Check): number {
  return Math.max(0, checkSubtotal(check) - check.discountCents) + check.tipCents;
}

export function checkDue(check: Check): number {
  const paid = check.payments.reduce((s, p) => s + p.amountCents, 0);
  return Math.max(0, checkTotal(check) - paid);
}

export function vatBreakdown(check: Check): { rate: 7 | 19; gross: number; net: number; tax: number }[] {
  const map = new Map<7 | 19, number>();
  const sub = checkSubtotal(check);
  const disc = check.discountCents;
  for (const item of check.items) {
    if (item.voided) continue;
    const gross = itemTotal(item);
    map.set(item.taxRate, (map.get(item.taxRate) ?? 0) + gross);
  }
  const rates: (7 | 19)[] = [7, 19];
  return rates
    .filter((r) => (map.get(r) ?? 0) > 0)
    .map((rate) => {
      let gross = map.get(rate) ?? 0;
      if (disc > 0 && sub > 0) {
        gross = Math.round(gross - (disc * gross) / sub);
      }
      const net = netFromGross(gross, rate);
      return { rate, gross, net, tax: taxFromGross(gross, rate) };
    });
}

export function tableLabel(tables: FloorTable[], tableId: string | null, type: CheckType): string {
  if (!tableId) {
    if (type === "lieferung") return "Lieferung";
    if (type === "takeaway") return "Mitnahme";
    return "Theke";
  }
  const t = tables.find((x) => x.id === tableId);
  return t ? `Tisch ${t.number}` : "Tisch";
}

export function tableStatus(
  tableId: string,
  checks: Check[],
  reservations: Reservation[],
): "free" | "occupied" | "billed" | "reserved" {
  const open = checks.find(
    (c) => c.tableId === tableId && c.status !== "paid" && c.status !== "voided",
  );
  if (open?.status === "billed") return "billed";
  if (open) return "occupied";
  const soon = Date.now() + 2 * 60 * 60 * 1000;
  const res = reservations.find(
    (r) =>
      r.tableId === tableId &&
      r.status === "erwartet" &&
      r.at <= soon &&
      r.at >= Date.now() - 15 * 60000,
  );
  if (res) return "reserved";
  return "free";
}

function snapshotCheck(
  check: Check,
  data: PosData,
): Receipt["snapshot"] {
  const staff = data.staff.find((s) => s.id === check.staffId);
  return {
    restaurantName: data.settings.restaurantName,
    address: data.settings.address,
    taxId: data.settings.taxId,
    tableLabel: tableLabel(data.tables, check.tableId, check.type),
    staffName: staff?.name ?? "Service",
    guestCount: check.guestCount,
    lines: check.items.map((i) => ({
      name: i.modifiers.length ? `${i.name} (${i.modifiers.join(", ")})` : i.name,
      qty: i.qty,
      unitPrice: i.unitPrice,
      taxRate: i.taxRate,
      voided: i.voided,
    })),
    discountCents: check.discountCents,
    discountLabel: check.discountLabel,
    tipCents: check.tipCents,
    payments: check.payments.map((p) => ({
      method: p.method,
      amountCents: p.amountCents,
      cardBrand: p.cardBrand,
      cardLast4: p.cardLast4,
      readerName: p.readerName,
    })),
    type: check.type,
  };
}

function lastCloseAt(dayCloses: DayClose[]): number {
  if (dayCloses.length === 0) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  return Math.max(...dayCloses.map((c) => c.at));
}

const seed = createSeedState();

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      ...seed,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      unlock: (pin) => {
        const staff = get().staff.find((s) => s.active && s.pin === pin);
        if (!staff) return null;
        set({ currentStaffId: staff.id });
        return staff;
      },
      lock: () => set({ currentStaffId: null }),

      openTable: (tableId, guestCount) => {
        const existing = get().getOpenCheckForTable(tableId);
        if (existing) return existing.id;
        const staffId = get().currentStaffId ?? get().staff[0]!.id;
        const check: Check = {
          id: nid("chk"),
          tableId,
          type: "tisch",
          guestCount,
          staffId,
          items: [],
          openedAt: Date.now(),
          paidAt: null,
          status: "open",
          notes: "",
          discountCents: 0,
          discountLabel: "",
          tipCents: 0,
          payments: [],
          courseHold: {},
        };
        set({ checks: [...get().checks, check] });
        return check.id;
      },

      openWalkIn: (type, guestCount) => {
        const staffId = get().currentStaffId ?? get().staff[0]!.id;
        const check: Check = {
          id: nid("chk"),
          tableId: null,
          type,
          guestCount,
          staffId,
          items: [],
          openedAt: Date.now(),
          paidAt: null,
          status: "open",
          notes: "",
          discountCents: 0,
          discountLabel: "",
          tipCents: 0,
          payments: [],
          courseHold: {},
        };
        set({ checks: [...get().checks, check] });
        return check.id;
      },

      getOpenCheckForTable: (tableId) =>
        get().checks.find(
          (c) => c.tableId === tableId && c.status !== "paid" && c.status !== "voided",
        ),

      addItem: (checkId, productId, opts) => {
        const product = get().products.find((p) => p.id === productId);
        const check = get().checks.find((c) => c.id === checkId);
        if (!product || !check || check.status === "paid" || check.status === "voided") return null;
        const price = effectivePrice(product, get().settings);
        const extra =
          product.modifiers
            .flatMap((g) => g.options)
            .filter((o) => (opts?.modifiers ?? []).includes(o.name))
            .reduce((s, o) => s + o.priceDelta, 0);
        const item: OrderItem = {
          id: nid("it"),
          productId: product.id,
          name: product.name,
          unitPrice: price + extra,
          qty: opts?.qty ?? 1,
          taxRate: effectiveTax(product, check.type),
          course: product.course,
          station: product.station,
          modifiers: opts?.modifiers ?? [],
          note: opts?.note ?? "",
          sent: false,
          seat: opts?.seat ?? null,
          voided: false,
        };
        set({
          checks: get().checks.map((c) =>
            c.id === checkId
              ? { ...c, items: [...c.items, item], status: c.status === "billed" ? "sent" : c.status }
              : c,
          ),
        });
        return item.id;
      },

      setItemQty: (checkId, itemId, qty) => {
        set({
          checks: get().checks.map((c) => {
            if (c.id !== checkId) return c;
            return {
              ...c,
              items: c.items.map((i) => {
                if (i.id !== itemId || i.sent) return i;
                return { ...i, qty: Math.max(1, qty) };
              }),
            };
          }),
        });
      },

      setItemNote: (checkId, itemId, note) => {
        set({
          checks: get().checks.map((c) =>
            c.id === checkId
              ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, note } : i)) }
              : c,
          ),
        });
      },

      setItemSeat: (checkId, itemId, seat) => {
        set({
          checks: get().checks.map((c) =>
            c.id === checkId
              ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, seat } : i)) }
              : c,
          ),
        });
      },

      voidItem: (checkId, itemId) => {
        set({
          checks: get().checks.map((c) =>
            c.id === checkId
              ? {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === itemId ? { ...i, voided: true, qty: i.qty } : i,
                  ),
                }
              : c,
          ),
        });
      },

      sendCourses: (checkId, courses) => {
        const state = get();
        const check = state.checks.find((c) => c.id === checkId);
        if (!check) return;
        const staff = state.staff.find((s) => s.id === check.staffId);
        const toSend = check.items.filter(
          (i) => !i.voided && !i.sent && courses.includes(i.course),
        );
        if (toSend.length === 0) return;
        const groups = new Map<string, OrderItem[]>();
        for (const item of toSend) {
          const key = `${item.station}:${item.course}`;
          const list = groups.get(key) ?? [];
          list.push(item);
          groups.set(key, list);
        }
        const tickets: KitchenTicket[] = [];
        for (const [key, items] of groups) {
          const [station, course] = key.split(":") as [KitchenTicket["station"], Course];
          tickets.push({
            id: nid("kt"),
            checkId,
            tableLabel: tableLabel(state.tables, check.tableId, check.type),
            course,
            station,
            items: items.map((i) => ({
              name: i.name,
              qty: i.qty,
              modifiers: i.modifiers,
              note: i.note,
            })),
            status: "neu",
            createdAt: Date.now(),
            staffName: staff?.name ?? "Service",
          });
        }
        const sentIds = new Set(toSend.map((i) => i.id));
        set({
          tickets: [...state.tickets, ...tickets],
          checks: state.checks.map((c) =>
            c.id === checkId
              ? {
                  ...c,
                  status: c.status === "open" ? "sent" : c.status,
                  items: c.items.map((i) => (sentIds.has(i.id) ? { ...i, sent: true } : i)),
                }
              : c,
          ),
        });
      },

      holdCourse: (checkId, course, hold) => {
        set({
          checks: get().checks.map((c) =>
            c.id === checkId ? { ...c, courseHold: { ...c.courseHold, [course]: hold } } : c,
          ),
        });
      },

      setDiscount: (checkId, cents, label) => {
        set({
          checks: get().checks.map((c) =>
            c.id === checkId ? { ...c, discountCents: Math.max(0, cents), discountLabel: label } : c,
          ),
        });
      },

      setTip: (checkId, cents) => {
        set({
          checks: get().checks.map((c) =>
            c.id === checkId ? { ...c, tipCents: Math.max(0, cents) } : c,
          ),
        });
      },

      setGuests: (checkId, n) => {
        set({
          checks: get().checks.map((c) =>
            c.id === checkId ? { ...c, guestCount: Math.max(1, n) } : c,
          ),
        });
      },

      setCheckNotes: (checkId, notes) => {
        set({
          checks: get().checks.map((c) => (c.id === checkId ? { ...c, notes } : c)),
        });
      },

      requestBill: (checkId) => {
        set({
          checks: get().checks.map((c) => (c.id === checkId ? { ...c, status: "billed" } : c)),
        });
      },

      moveCheck: (checkId, toTableId) => {
        const state = get();
        const targetBusy = state.checks.some(
          (c) => c.tableId === toTableId && c.id !== checkId && c.status !== "paid" && c.status !== "voided",
        );
        if (targetBusy) return false;
        set({
          checks: state.checks.map((c) =>
            c.id === checkId ? { ...c, tableId: toTableId, type: "tisch" } : c,
          ),
        });
        return true;
      },

      mergeChecks: (fromId, toId) => {
        const state = get();
        const from = state.checks.find((c) => c.id === fromId);
        const to = state.checks.find((c) => c.id === toId);
        if (!from || !to || fromId === toId) return false;
        if (from.status === "paid" || to.status === "paid") return false;
        set({
          checks: state.checks
            .filter((c) => c.id !== fromId)
            .map((c) =>
              c.id === toId
                ? {
                    ...c,
                    items: [...c.items, ...from.items],
                    guestCount: c.guestCount + from.guestCount,
                    discountCents: c.discountCents + from.discountCents,
                    notes: [c.notes, from.notes].filter(Boolean).join(" · "),
                  }
                : c,
            ),
        });
        return true;
      },

      splitItems: (checkId, itemIds) => {
        const state = get();
        const check = state.checks.find((c) => c.id === checkId);
        if (!check) return null;
        const move = check.items.filter((i) => itemIds.includes(i.id) && !i.voided);
        const keep = check.items.filter((i) => !itemIds.includes(i.id));
        if (move.length === 0 || keep.length === 0) return null;
        const neu: Check = {
          ...check,
          id: nid("chk"),
          items: move,
          openedAt: Date.now(),
          status: "open",
          discountCents: 0,
          discountLabel: "",
          tipCents: 0,
          payments: [],
          guestCount: Math.max(1, Math.floor(check.guestCount / 2)),
        };
        set({
          checks: state.checks
            .map((c) => (c.id === checkId ? { ...c, items: keep } : c))
            .concat(neu),
        });
        return neu.id;
      },

      pay: (checkId, payments, tipCents) => {
        const state = get();
        const check = state.checks.find((c) => c.id === checkId);
        if (!check || check.status === "paid" || check.status === "voided") return null;
        const staffId = state.currentStaffId ?? check.staffId;
        const withTip: Check = {
          ...check,
          tipCents,
          payments: [
            ...check.payments,
            ...payments.map((p) => ({
              id: nid("pay"),
              method: p.method,
              amountCents: p.amountCents,
              receivedCents: p.receivedCents,
              at: Date.now(),
              staffId,
              cardBrand: p.cardBrand,
              cardLast4: p.cardLast4,
              sumupTxId: p.sumupTxId,
              readerName: p.readerName,
            })),
          ],
        };
        const due = checkDue(withTip);
        if (due > 2) {
          set({
            checks: state.checks.map((c) => (c.id === checkId ? withTip : c)),
          });
          return null;
        }
        const paid: Check = { ...withTip, status: "paid", paidAt: Date.now() };
        const tseCounter = state.settings.tseCounter + 1;
        const bon = state.settings.nextBonNumber;
        const tse = signTse(
          state.settings.tseSerial,
          tseCounter,
          `${bon}|${checkTotal(paid)}|${paid.id}`,
        );
        const receipt: Receipt = {
          id: nid("bon"),
          checkId,
          number: bon,
          tse,
          printedAt: Date.now(),
          type: "rechnung",
          snapshot: snapshotCheck(paid, { ...state, checks: [paid] }),
        };
        const stockMap = new Map<string, number>();
        for (const item of paid.items) {
          if (item.voided) continue;
          stockMap.set(item.productId, (stockMap.get(item.productId) ?? 0) + item.qty);
        }
        set({
          checks: state.checks.map((c) => (c.id === checkId ? paid : c)),
          receipts: [...state.receipts, receipt],
          settings: { ...state.settings, tseCounter, nextBonNumber: bon + 1 },
          products: state.products.map((p) => {
            const used = stockMap.get(p.id);
            if (!used || p.stock == null) return p;
            return { ...p, stock: Math.max(0, p.stock - used) };
          }),
        });
        return receipt;
      },

      voidCheck: (checkId, reason) => {
        const state = get();
        const check = state.checks.find((c) => c.id === checkId);
        if (!check || check.status === "voided") return null;
        const tseCounter = state.settings.tseCounter + 1;
        const bon = state.settings.nextBonNumber;
        const tse = signTse(
          state.settings.tseSerial,
          tseCounter,
          `STORNO|${bon}|${check.id}|${reason}`,
          "AVBelegAbbruch-V1",
        );
        const voided: Check = { ...check, status: "voided", notes: reason };
        const receipt: Receipt = {
          id: nid("bon"),
          checkId,
          number: bon,
          tse,
          printedAt: Date.now(),
          type: "storno",
          snapshot: snapshotCheck(voided, { ...state, checks: [voided] }),
        };
        set({
          checks: state.checks.map((c) => (c.id === checkId ? voided : c)),
          receipts: [...state.receipts, receipt],
          settings: { ...state.settings, tseCounter, nextBonNumber: bon + 1 },
        });
        return receipt;
      },

      printZwischen: (checkId) => {
        const state = get();
        const check = state.checks.find((c) => c.id === checkId);
        if (!check) return null;
        const tseCounter = state.settings.tseCounter + 1;
        const bon = state.settings.nextBonNumber;
        const tse = signTse(
          state.settings.tseSerial,
          tseCounter,
          `ZWISCHEN|${bon}|${check.id}`,
          "Bestellung-V1",
        );
        const receipt: Receipt = {
          id: nid("bon"),
          checkId,
          number: bon,
          tse,
          printedAt: Date.now(),
          type: "zwischen",
          snapshot: snapshotCheck(check, state),
        };
        set({
          receipts: [...state.receipts, receipt],
          settings: { ...state.settings, tseCounter, nextBonNumber: bon + 1 },
        });
        return receipt;
      },

      bumpTicket: (ticketId, status) => {
        set({
          tickets: get().tickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
        });
      },

      upsertProduct: (product) => {
        const exists = get().products.some((p) => p.id === product.id);
        set({
          products: exists
            ? get().products.map((p) => (p.id === product.id ? product : p))
            : [...get().products, product],
        });
      },
      removeProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
      upsertCategory: (cat) => {
        const exists = get().categories.some((c) => c.id === cat.id);
        set({
          categories: exists
            ? get().categories.map((c) => (c.id === cat.id ? cat : c))
            : [...get().categories, cat],
        });
      },
      upsertStaff: (s) => {
        const exists = get().staff.some((x) => x.id === s.id);
        set({
          staff: exists ? get().staff.map((x) => (x.id === s.id ? s : x)) : [...get().staff, s],
        });
      },
      adjustStock: (productId, delta) => {
        set({
          products: get().products.map((p) =>
            p.id === productId && p.stock != null
              ? { ...p, stock: Math.max(0, p.stock + delta) }
              : p,
          ),
        });
      },
      upsertReservation: (r) => {
        const exists = get().reservations.some((x) => x.id === r.id);
        set({
          reservations: exists
            ? get().reservations.map((x) => (x.id === r.id ? r : x))
            : [...get().reservations, r],
        });
      },
      setReservationStatus: (id, status, tableId) => {
        set({
          reservations: get().reservations.map((r) =>
            r.id === id ? { ...r, status, tableId: tableId === undefined ? r.tableId : tableId } : r,
          ),
        });
      },
      closeDay: (countedCash) => {
        const state = get();
        const since = lastCloseAt(state.dayCloses);
        const paid = state.checks.filter(
          (c) => c.status === "paid" && (c.paidAt ?? 0) >= since,
        );
        const salesByMethod: Record<PayMethod, number> = { bar: 0, karte: 0 };
        for (const c of paid) {
          for (const p of c.payments) salesByMethod[p.method] += p.amountCents;
        }
        const vatMap = new Map<number, { gross: number; net: number; tax: number }>();
        for (const c of paid) {
          for (const v of vatBreakdown(c)) {
            const cur = vatMap.get(v.rate) ?? { gross: 0, net: 0, tax: 0 };
            vatMap.set(v.rate, {
              gross: cur.gross + v.gross,
              net: cur.net + v.net,
              tax: cur.tax + v.tax,
            });
          }
        }
        const tseCounter = state.settings.tseCounter + 1;
        const tse = signTse(
          state.settings.tseSerial,
          tseCounter,
          `Z|${since}|${Date.now()}|${salesByMethod.bar}|${salesByMethod.karte}`,
          "AVBelegAbbruch-V1",
        );
        const staff = state.staff.find((s) => s.id === state.currentStaffId);
        const close: DayClose = {
          id: nid("z"),
          at: Date.now(),
          staffId: state.currentStaffId ?? "s_chef",
          staffName: staff?.name ?? "Inhaber",
          expectedCash: salesByMethod.bar,
          countedCash,
          salesByMethod,
          vat: [...vatMap.entries()].map(([rate, v]) => ({ rate, ...v })),
          receiptCount: state.receipts.filter((r) => r.printedAt >= since && r.type === "rechnung")
            .length,
          covers: paid.reduce((s, c) => s + c.guestCount, 0),
          tse,
        };
        const receipt: Receipt = {
          id: nid("bon"),
          checkId: close.id,
          number: state.settings.nextBonNumber,
          tse,
          printedAt: Date.now(),
          type: "z-abschluss",
          snapshot: {
            restaurantName: state.settings.restaurantName,
            address: state.settings.address,
            taxId: state.settings.taxId,
            tableLabel: "Z-Abschluss",
            staffName: close.staffName,
            guestCount: close.covers,
            lines: [
              { name: "Bar", qty: 1, unitPrice: salesByMethod.bar, taxRate: 19 },
              { name: "Karte", qty: 1, unitPrice: salesByMethod.karte, taxRate: 19 },
            ],
            discountCents: 0,
            discountLabel: "",
            tipCents: 0,
            payments: [],
            type: "tisch",
          },
        };
        set({
          dayCloses: [...state.dayCloses, close],
          receipts: [...state.receipts, receipt],
          settings: {
            ...state.settings,
            tseCounter,
            nextBonNumber: state.settings.nextBonNumber + 1,
          },
        });
        return close;
      },
      updateSettings: (patch) =>
        set({
          settings: withSumupSettings({
            ...get().settings,
            ...patch,
            sumup: { ...DEFAULT_SUMUP, ...get().settings.sumup, ...patch.sumup },
          }),
        }),
      upsertTable: (t) => {
        const exists = get().tables.some((x) => x.id === t.id);
        set({
          tables: exists ? get().tables.map((x) => (x.id === t.id ? t : x)) : [...get().tables, t],
        });
      },
      resetDemo: () => {
        const fresh = createSeedState();
        set({ ...fresh, currentStaffId: get().currentStaffId, hydrated: true });
      },
    }),
    {
      name: "vesper-pos-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PosData>;
        const settings = withSumupSettings({
          ...current.settings,
          ...p.settings,
          sumup: {
            ...DEFAULT_SUMUP,
            ...current.settings.sumup,
            ...p.settings?.sumup,
          },
        });
        return {
          ...current,
          ...p,
          settings,
        };
      },
      partialize: (s) => ({
        rooms: s.rooms,
        tables: s.tables,
        categories: s.categories,
        products: s.products,
        staff: s.staff,
        currentStaffId: s.currentStaffId,
        checks: s.checks,
        tickets: s.tickets,
        receipts: s.receipts,
        reservations: s.reservations,
        dayCloses: s.dayCloses,
        settings: s.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export { lastCloseAt, COURSE_ORDER, todayKey };
