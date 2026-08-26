export type TaxClass = "food" | "drink";
export type Course = "sofort" | "vorspeise" | "hauptgang" | "dessert" | "getraenk";
export type Station = "kueche" | "bar" | "theke";
export type CheckType = "tisch" | "takeaway" | "lieferung";
export type CheckStatus = "open" | "sent" | "billed" | "paid" | "voided";
export type TableStatus = "free" | "occupied" | "billed" | "reserved";
export type PayMethod = "bar" | "karte";
export type StaffRole = "inhaber" | "service" | "bar" | "kueche";
export type TicketStatus = "neu" | "in_arbeit" | "bereit" | "serviert";
export type ReservationStatus = "erwartet" | "eingetroffen" | "storniert" | "noshow";

export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  multi: boolean;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  taxClass: TaxClass;
  station: Station;
  course: Course;
  modifiers: ModifierGroup[];
  stock: number | null;
  sku: string;
  happyHourPrice: number | null;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  sort: number;
}

export interface FloorTable {
  id: string;
  number: string;
  roomId: string;
  seats: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: "rect" | "round";
}

export interface Room {
  id: string;
  name: string;
}

export interface Staff {
  id: string;
  name: string;
  pin: string;
  role: StaffRole;
  active: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
  taxRate: 7 | 19;
  course: Course;
  station: Station;
  modifiers: string[];
  note: string;
  sent: boolean;
  seat: number | null;
  voided: boolean;
}

export interface Payment {
  id: string;
  method: PayMethod;
  amountCents: number;
  receivedCents: number;
  at: number;
  staffId: string;
}

export interface Check {
  id: string;
  tableId: string | null;
  type: CheckType;
  guestCount: number;
  staffId: string;
  items: OrderItem[];
  openedAt: number;
  paidAt: number | null;
  status: CheckStatus;
  notes: string;
  discountCents: number;
  discountLabel: string;
  tipCents: number;
  payments: Payment[];
  courseHold: Partial<Record<Course, boolean>>;
}

export interface TseRecord {
  txNumber: number;
  signature: string;
  serial: string;
  timeStart: number;
  timeEnd: number;
  processType: string;
}

export interface Receipt {
  id: string;
  checkId: string;
  number: number;
  tse: TseRecord;
  printedAt: number;
  type: "rechnung" | "zwischen" | "storno" | "z-abschluss";
  snapshot: ReceiptSnapshot;
}

export interface ReceiptLine {
  name: string;
  qty: number;
  unitPrice: number;
  taxRate: 7 | 19;
  voided?: boolean;
}

export interface ReceiptSnapshot {
  restaurantName: string;
  address: string;
  taxId: string;
  tableLabel: string;
  staffName: string;
  guestCount: number;
  lines: ReceiptLine[];
  discountCents: number;
  discountLabel: string;
  tipCents: number;
  payments: { method: PayMethod; amountCents: number }[];
  type: CheckType;
}

export interface KitchenTicket {
  id: string;
  checkId: string;
  tableLabel: string;
  course: Course;
  station: Station;
  items: { name: string; qty: number; modifiers: string[]; note: string }[];
  status: TicketStatus;
  createdAt: number;
  staffName: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  covers: number;
  at: number;
  tableId: string | null;
  notes: string;
  status: ReservationStatus;
}

export interface DayClose {
  id: string;
  at: number;
  staffId: string;
  staffName: string;
  expectedCash: number;
  countedCash: number;
  salesByMethod: Record<PayMethod, number>;
  vat: { rate: number; gross: number; net: number; tax: number }[];
  receiptCount: number;
  covers: number;
  tse: TseRecord;
}

export interface PosSettings {
  restaurantName: string;
  address: string;
  taxId: string;
  tseSerial: string;
  receiptFooter: string;
  happyHourStart: string;
  happyHourEnd: string;
  nextBonNumber: number;
  tseCounter: number;
}

export const COURSE_LABEL: Record<Course, string> = {
  sofort: "Sofort",
  vorspeise: "Vorspeise",
  hauptgang: "Hauptgang",
  dessert: "Dessert",
  getraenk: "Getränk",
};

export const STATION_LABEL: Record<Station, string> = {
  kueche: "Küche",
  bar: "Bar",
  theke: "Theke",
};

export const ROLE_LABEL: Record<StaffRole, string> = {
  inhaber: "Inhaber",
  service: "Service",
  bar: "Bar",
  kueche: "Küche",
};

export const METHOD_LABEL: Record<PayMethod, string> = {
  bar: "Bar",
  karte: "Karte",
};

export const COURSE_ORDER: Course[] = [
  "vorspeise",
  "hauptgang",
  "dessert",
  "getraenk",
  "sofort",
];
