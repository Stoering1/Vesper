import type {
  Category,
  Check,
  FloorTable,
  KitchenTicket,
  PosSettings,
  Product,
  Reservation,
  Room,
  Staff,
} from "./types";

export function nid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const ROOMS: Room[] = [
  { id: "room_stube", name: "Gaststube" },
  { id: "room_terrasse", name: "Terrasse" },
  { id: "room_theke", name: "Theke" },
];

export const TABLES: FloorTable[] = [
  { id: "t1", number: "1", roomId: "room_stube", seats: 2, x: 4, y: 8, w: 14, h: 22, shape: "rect" },
  { id: "t2", number: "2", roomId: "room_stube", seats: 2, x: 22, y: 8, w: 14, h: 22, shape: "rect" },
  { id: "t3", number: "3", roomId: "room_stube", seats: 4, x: 40, y: 8, w: 18, h: 22, shape: "rect" },
  { id: "t4", number: "4", roomId: "room_stube", seats: 4, x: 62, y: 8, w: 18, h: 22, shape: "rect" },
  { id: "t5", number: "5", roomId: "room_stube", seats: 2, x: 84, y: 8, w: 12, h: 22, shape: "round" },
  { id: "t6", number: "6", roomId: "room_stube", seats: 4, x: 4, y: 38, w: 18, h: 24, shape: "rect" },
  { id: "t7", number: "7", roomId: "room_stube", seats: 6, x: 28, y: 38, w: 24, h: 24, shape: "rect" },
  { id: "t8", number: "8", roomId: "room_stube", seats: 4, x: 58, y: 38, w: 18, h: 24, shape: "rect" },
  { id: "t9", number: "9", roomId: "room_stube", seats: 2, x: 82, y: 38, w: 14, h: 24, shape: "round" },
  { id: "t10", number: "10", roomId: "room_stube", seats: 8, x: 18, y: 70, w: 28, h: 24, shape: "rect" },
  { id: "t11", number: "11", roomId: "room_stube", seats: 4, x: 52, y: 70, w: 20, h: 24, shape: "rect" },
  { id: "t12", number: "12", roomId: "room_stube", seats: 2, x: 78, y: 70, w: 16, h: 24, shape: "round" },
  { id: "tr1", number: "T1", roomId: "room_terrasse", seats: 2, x: 8, y: 14, w: 24, h: 32, shape: "round" },
  { id: "tr2", number: "T2", roomId: "room_terrasse", seats: 4, x: 38, y: 14, w: 24, h: 32, shape: "rect" },
  { id: "tr3", number: "T3", roomId: "room_terrasse", seats: 2, x: 68, y: 14, w: 24, h: 32, shape: "round" },
  { id: "tr4", number: "T4", roomId: "room_terrasse", seats: 4, x: 8, y: 54, w: 24, h: 32, shape: "rect" },
  { id: "tr5", number: "T5", roomId: "room_terrasse", seats: 4, x: 38, y: 54, w: 24, h: 32, shape: "rect" },
  { id: "tr6", number: "T6", roomId: "room_terrasse", seats: 6, x: 68, y: 54, w: 24, h: 32, shape: "rect" },
  { id: "b1", number: "B1", roomId: "room_theke", seats: 1, x: 6, y: 30, w: 14, h: 40, shape: "round" },
  { id: "b2", number: "B2", roomId: "room_theke", seats: 1, x: 26, y: 30, w: 14, h: 40, shape: "round" },
  { id: "b3", number: "B3", roomId: "room_theke", seats: 1, x: 46, y: 30, w: 14, h: 40, shape: "round" },
  { id: "b4", number: "B4", roomId: "room_theke", seats: 1, x: 66, y: 30, w: 14, h: 40, shape: "round" },
  { id: "b5", number: "B5", roomId: "room_theke", seats: 1, x: 86, y: 30, w: 10, h: 40, shape: "round" },
];

export const STAFF: Staff[] = [
  { id: "s_anna", name: "Anna Berger", pin: "1111", role: "service", active: true },
  { id: "s_markus", name: "Markus Holt", pin: "2222", role: "service", active: true },
  { id: "s_lena", name: "Lena Krug", pin: "3333", role: "bar", active: true },
  { id: "s_chef", name: "Inhaber", pin: "0000", role: "inhaber", active: true },
];

export const CATEGORIES: Category[] = [
  { id: "c_vor", name: "Vorspeisen", sort: 1 },
  { id: "c_haupt", name: "Hauptgerichte", sort: 2 },
  { id: "c_bei", name: "Beilagen", sort: 3 },
  { id: "c_nacht", name: "Nachspeisen", sort: 4 },
  { id: "c_bier", name: "Bier", sort: 5 },
  { id: "c_wein", name: "Wein & Aperitif", sort: 6 },
  { id: "c_soft", name: "Alkoholfrei", sort: 7 },
  { id: "c_heiss", name: "Heißgetränke", sort: 8 },
];

const GARSTUFE = {
  id: "m_gar",
  name: "Garstufe",
  required: true,
  multi: false,
  options: [
    { id: "g_blau", name: "Blau", priceDelta: 0 },
    { id: "g_mr", name: "Medium Rare", priceDelta: 0 },
    { id: "g_med", name: "Medium", priceDelta: 0 },
    { id: "g_mw", name: "Medium Well", priceDelta: 0 },
    { id: "g_durch", name: "Durch", priceDelta: 0 },
  ],
};

const BURGER_EXTRAS = {
  id: "m_burger",
  name: "Extras",
  required: false,
  multi: true,
  options: [
    { id: "e_kaese", name: "Extra Käse", priceDelta: 150 },
    { id: "e_speck", name: "Speck", priceDelta: 200 },
    { id: "e_ei", name: "Spiegelei", priceDelta: 150 },
    { id: "e_nozw", name: "Ohne Zwiebel", priceDelta: 0 },
  ],
};

export const PRODUCTS: Product[] = [
  { id: "p_flamm", name: "Flammkuchen Elsässer", categoryId: "c_vor", price: 1290, taxClass: "food", station: "kueche", course: "vorspeise", modifiers: [], stock: 40, sku: "V-01", happyHourPrice: null, active: true },
  { id: "p_carp", name: "Carpaccio vom Rind", categoryId: "c_vor", price: 1650, taxClass: "food", station: "kueche", course: "vorspeise", modifiers: [], stock: 18, sku: "V-02", happyHourPrice: null, active: true },
  { id: "p_suppe", name: "Suppe des Tages", categoryId: "c_vor", price: 690, taxClass: "food", station: "kueche", course: "vorspeise", modifiers: [], stock: 30, sku: "V-03", happyHourPrice: null, active: true },
  { id: "p_brezel", name: "Brezel mit Obazda", categoryId: "c_vor", price: 550, taxClass: "food", station: "kueche", course: "vorspeise", modifiers: [], stock: 25, sku: "V-04", happyHourPrice: null, active: true },
  { id: "p_garnele", name: "Garnelen in Knoblauch", categoryId: "c_vor", price: 1490, taxClass: "food", station: "kueche", course: "vorspeise", modifiers: [], stock: 16, sku: "V-05", happyHourPrice: null, active: true },
  { id: "p_schnitzel", name: "Wiener Schnitzel", categoryId: "c_haupt", price: 2290, taxClass: "food", station: "kueche", course: "hauptgang", modifiers: [], stock: 28, sku: "H-01", happyHourPrice: null, active: true },
  { id: "p_braten", name: "Schweinebraten", categoryId: "c_haupt", price: 1890, taxClass: "food", station: "kueche", course: "hauptgang", modifiers: [], stock: 22, sku: "H-02", happyHourPrice: null, active: true },
  { id: "p_zander", name: "Zanderfilet", categoryId: "c_haupt", price: 2450, taxClass: "food", station: "kueche", course: "hauptgang", modifiers: [], stock: 14, sku: "H-03", happyHourPrice: null, active: true },
  { id: "p_spaetzle", name: "Käsespätzle", categoryId: "c_haupt", price: 1690, taxClass: "food", station: "kueche", course: "hauptgang", modifiers: [], stock: 20, sku: "H-04", happyHourPrice: null, active: true },
  { id: "p_steak", name: "Rindersteak 250g", categoryId: "c_haupt", price: 2990, taxClass: "food", station: "kueche", course: "hauptgang", modifiers: [GARSTUFE], stock: 12, sku: "H-05", happyHourPrice: null, active: true },
  { id: "p_curry", name: "Gemüsecurry", categoryId: "c_haupt", price: 1590, taxClass: "food", station: "kueche", course: "hauptgang", modifiers: [], stock: 18, sku: "H-06", happyHourPrice: null, active: true },
  { id: "p_burger", name: "Burger Lindenhof", categoryId: "c_haupt", price: 1850, taxClass: "food", station: "kueche", course: "hauptgang", modifiers: [BURGER_EXTRAS], stock: 24, sku: "H-07", happyHourPrice: null, active: true },
  { id: "p_pommes", name: "Pommes", categoryId: "c_bei", price: 450, taxClass: "food", station: "kueche", course: "sofort", modifiers: [], stock: 60, sku: "B-01", happyHourPrice: null, active: true },
  { id: "p_ksalat", name: "Kartoffelsalat", categoryId: "c_bei", price: 420, taxClass: "food", station: "kueche", course: "sofort", modifiers: [], stock: 30, sku: "B-02", happyHourPrice: null, active: true },
  { id: "p_salat", name: "Beilagensalat", categoryId: "c_bei", price: 490, taxClass: "food", station: "kueche", course: "sofort", modifiers: [], stock: 30, sku: "B-03", happyHourPrice: null, active: true },
  { id: "p_beisp", name: "Spätzle", categoryId: "c_bei", price: 450, taxClass: "food", station: "kueche", course: "sofort", modifiers: [], stock: 30, sku: "B-04", happyHourPrice: null, active: true },
  { id: "p_gemuese", name: "Saison-Gemüse", categoryId: "c_bei", price: 490, taxClass: "food", station: "kueche", course: "sofort", modifiers: [], stock: 24, sku: "B-05", happyHourPrice: null, active: true },
  { id: "p_strudel", name: "Apfelstrudel", categoryId: "c_nacht", price: 790, taxClass: "food", station: "kueche", course: "dessert", modifiers: [], stock: 16, sku: "N-01", happyHourPrice: null, active: true },
  { id: "p_mousse", name: "Schokoladenmousse", categoryId: "c_nacht", price: 850, taxClass: "food", station: "kueche", course: "dessert", modifiers: [], stock: 14, sku: "N-02", happyHourPrice: null, active: true },
  { id: "p_kaiser", name: "Kaiserschmarrn", categoryId: "c_nacht", price: 990, taxClass: "food", station: "kueche", course: "dessert", modifiers: [], stock: 12, sku: "N-03", happyHourPrice: null, active: true },
  { id: "p_aug05", name: "Augustiner Hell 0,5", categoryId: "c_bier", price: 480, taxClass: "drink", station: "bar", course: "getraenk", modifiers: [], stock: 80, sku: "G-01", happyHourPrice: 380, active: true },
  { id: "p_aug03", name: "Augustiner Hell 0,3", categoryId: "c_bier", price: 360, taxClass: "drink", station: "bar", course: "getraenk", modifiers: [], stock: 80, sku: "G-02", happyHourPrice: 280, active: true },
  { id: "p_weiss", name: "Weißbier 0,5", categoryId: "c_bier", price: 490, taxClass: "drink", station: "bar", course: "getraenk", modifiers: [], stock: 50, sku: "G-03", happyHourPrice: 390, active: true },
  { id: "p_radler", name: "Radler 0,5", categoryId: "c_bier", price: 450, taxClass: "drink", station: "bar", course: "getraenk", modifiers: [], stock: 40, sku: "G-04", happyHourPrice: 350, active: true },
  { id: "p_rot", name: "Rotwein Glas", categoryId: "c_wein", price: 590, taxClass: "drink", station: "bar", course: "getraenk", modifiers: [], stock: 40, sku: "W-01", happyHourPrice: null, active: true },
  { id: "p_ww", name: "Weißwein Glas", categoryId: "c_wein", price: 550, taxClass: "drink", station: "bar", course: "getraenk", modifiers: [], stock: 40, sku: "W-02", happyHourPrice: null, active: true },
  { id: "p_spritz", name: "Aperol Spritz", categoryId: "c_wein", price: 790, taxClass: "drink", station: "bar", course: "getraenk", modifiers: [], stock: 30, sku: "W-03", happyHourPrice: 650, active: true },
  { id: "p_cola", name: "Cola 0,4", categoryId: "c_soft", price: 390, taxClass: "drink", station: "theke", course: "getraenk", modifiers: [], stock: 60, sku: "S-01", happyHourPrice: null, active: true },
  { id: "p_spezi", name: "Spezi 0,4", categoryId: "c_soft", price: 390, taxClass: "drink", station: "theke", course: "getraenk", modifiers: [], stock: 50, sku: "S-02", happyHourPrice: null, active: true },
  { id: "p_wasser", name: "Mineralwasser 0,75", categoryId: "c_soft", price: 550, taxClass: "drink", station: "theke", course: "getraenk", modifiers: [], stock: 40, sku: "S-03", happyHourPrice: null, active: true },
  { id: "p_kaffee", name: "Kaffee", categoryId: "c_heiss", price: 320, taxClass: "drink", station: "theke", course: "getraenk", modifiers: [], stock: 99, sku: "C-01", happyHourPrice: null, active: true },
  { id: "p_capp", name: "Cappuccino", categoryId: "c_heiss", price: 380, taxClass: "drink", station: "theke", course: "getraenk", modifiers: [], stock: 99, sku: "C-02", happyHourPrice: null, active: true },
  { id: "p_esp", name: "Espresso", categoryId: "c_heiss", price: 280, taxClass: "drink", station: "theke", course: "getraenk", modifiers: [], stock: 99, sku: "C-03", happyHourPrice: null, active: true },
];

export const SETTINGS: PosSettings = {
  restaurantName: "Gasthaus Lindenhof",
  address: "Lindenstraße 12, 80331 München",
  taxId: "DE 183 229 441",
  tseSerial: "VESPER-TSE-DEMO-88421",
  receiptFooter: "Vielen Dank für Ihren Besuch. Tscheckö! — Speisen vor Ort 19 %, Mitnahme 7 %.",
  happyHourStart: "17:00",
  happyHourEnd: "19:00",
  nextBonNumber: 1847,
  tseCounter: 1846,
};

function item(
  product: Product,
  qty: number,
  extras: Partial<{ modifiers: string[]; sent: boolean; note: string; seat: number | null; unitPrice: number }>,
): Check["items"][number] {
  return {
    id: nid("it"),
    productId: product.id,
    name: product.name,
    unitPrice: extras.unitPrice ?? product.price,
    qty,
    taxRate: 19,
    course: product.course,
    station: product.station,
    modifiers: extras.modifiers ?? [],
    note: extras.note ?? "",
    sent: extras.sent ?? false,
    seat: extras.seat ?? null,
    voided: false,
  };
}

export function createLiveDemo(): { checks: Check[]; tickets: KitchenTicket[]; reservations: Reservation[] } {
  const now = Date.now();
  const p = (id: string) => PRODUCTS.find((x) => x.id === id)!;

  const c3: Check = {
    id: "chk_t3",
    tableId: "t3",
    type: "tisch",
    guestCount: 2,
    staffId: "s_anna",
    items: [
      item(p("p_flamm"), 1, { sent: true }),
      item(p("p_aug05"), 2, { sent: true }),
    ],
    openedAt: now - 28 * 60000,
    paidAt: null,
    status: "sent",
    notes: "",
    discountCents: 0,
    discountLabel: "",
    tipCents: 0,
    payments: [],
    courseHold: {},
  };

  const c7: Check = {
    id: "chk_t7",
    tableId: "t7",
    type: "tisch",
    guestCount: 4,
    staffId: "s_markus",
    items: [
      item(p("p_schnitzel"), 2, { sent: true, seat: 1 }),
      item(p("p_braten"), 1, { sent: true, seat: 3 }),
      item(p("p_spaetzle"), 1, { sent: false, seat: 4 }),
      item(p("p_beisp"), 2, { sent: true }),
      item(p("p_ww"), 2, { sent: true }),
      item(p("p_rot"), 1, { sent: true }),
      item(p("p_wasser"), 1, { sent: true }),
    ],
    openedAt: now - 52 * 60000,
    paidAt: null,
    status: "sent",
    notes: "Allergiker Platz 4 — keine Nüsse",
    discountCents: 0,
    discountLabel: "",
    tipCents: 0,
    payments: [],
    courseHold: { dessert: true },
  };

  const c10: Check = {
    id: "chk_t10",
    tableId: "t10",
    type: "tisch",
    guestCount: 6,
    staffId: "s_anna",
    items: [
      item(p("p_burger"), 2, { sent: true, modifiers: ["Speck", "Extra Käse"] }),
      item(p("p_steak"), 1, { sent: true, modifiers: ["Medium"] }),
      item(p("p_curry"), 1, { sent: true }),
      item(p("p_zander"), 2, { sent: true }),
      item(p("p_pommes"), 3, { sent: true }),
      item(p("p_spritz"), 2, { sent: true }),
      item(p("p_aug05"), 4, { sent: true }),
    ],
    openedAt: now - 74 * 60000,
    paidAt: null,
    status: "billed",
    notes: "",
    discountCents: 0,
    discountLabel: "",
    tipCents: 0,
    payments: [],
    courseHold: {},
  };

  const cb1: Check = {
    id: "chk_b1",
    tableId: "b1",
    type: "tisch",
    guestCount: 1,
    staffId: "s_lena",
    items: [item(p("p_aug05"), 1, { sent: true })],
    openedAt: now - 12 * 60000,
    paidAt: null,
    status: "sent",
    notes: "",
    discountCents: 0,
    discountLabel: "",
    tipCents: 0,
    payments: [],
    courseHold: {},
  };

  const tickets: KitchenTicket[] = [
    {
      id: "kt_7_h",
      checkId: c7.id,
      tableLabel: "Tisch 7",
      course: "hauptgang",
      station: "kueche",
      items: [
        { name: "Wiener Schnitzel", qty: 2, modifiers: [], note: "" },
        { name: "Schweinebraten", qty: 1, modifiers: [], note: "" },
        { name: "Spätzle", qty: 2, modifiers: [], note: "" },
      ],
      status: "in_arbeit",
      createdAt: now - 18 * 60000,
      staffName: "Markus Holt",
    },
    {
      id: "kt_3_v",
      checkId: c3.id,
      tableLabel: "Tisch 3",
      course: "vorspeise",
      station: "kueche",
      items: [{ name: "Flammkuchen Elsässer", qty: 1, modifiers: [], note: "" }],
      status: "bereit",
      createdAt: now - 16 * 60000,
      staffName: "Anna Berger",
    },
    {
      id: "kt_b_bar",
      checkId: cb1.id,
      tableLabel: "Tisch B1",
      course: "getraenk",
      station: "bar",
      items: [{ name: "Augustiner Hell 0,5", qty: 1, modifiers: [], note: "" }],
      status: "serviert",
      createdAt: now - 12 * 60000,
      staffName: "Lena Krug",
    },
  ];

  const evening = new Date();
  evening.setHours(19, 30, 0, 0);
  const later = new Date();
  later.setHours(20, 15, 0, 0);

  const reservations: Reservation[] = [
    {
      id: "res_1",
      name: "Familie Huber",
      phone: "089 1234567",
      covers: 4,
      at: evening.getTime(),
      tableId: "t8",
      notes: "Kinderstuhl",
      status: "erwartet",
    },
    {
      id: "res_2",
      name: "Dr. Steiner",
      phone: "0176 88990011",
      covers: 2,
      at: later.getTime(),
      tableId: "t5",
      notes: "Fensterplatz",
      status: "erwartet",
    },
    {
      id: "res_3",
      name: "Firma Leitner",
      phone: "089 998877",
      covers: 8,
      at: evening.getTime() + 45 * 60000,
      tableId: "t10",
      notes: "Rechnung auf Firma",
      status: "erwartet",
    },
  ];

  return { checks: [c3, c7, c10, cb1], tickets, reservations };
}

export function createSeedState() {
  const live = createLiveDemo();
  return {
    rooms: ROOMS,
    tables: TABLES,
    categories: CATEGORIES,
    products: PRODUCTS,
    staff: STAFF,
    currentStaffId: null as string | null,
    checks: live.checks,
    tickets: live.tickets,
    receipts: [] as import("./types").Receipt[],
    reservations: live.reservations,
    dayCloses: [] as import("./types").DayClose[],
    settings: SETTINGS,
  };
}
