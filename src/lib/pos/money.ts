export function formatEUR(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function netFromGross(gross: number, rate: number): number {
  return Math.round(gross / (1 + rate / 100));
}

export function taxFromGross(gross: number, rate: number): number {
  return gross - netFromGross(gross, rate);
}

export function parseEuroInput(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace("€", "").replace(",", ".");
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function isHappyHour(start: string, end: string, now = new Date()): boolean {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const from = (sh ?? 0) * 60 + (sm ?? 0);
  const to = (eh ?? 0) * 60 + (em ?? 0);
  if (from <= to) return minutes >= from && minutes < to;
  return minutes >= from || minutes < to;
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(openedAt: number, now = Date.now()): string {
  const mins = Math.max(0, Math.floor((now - openedAt) / 60000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  return `${h} h ${mins % 60} min`;
}

export function todayKey(ts = Date.now()): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
