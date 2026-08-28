import { createServerFn } from "@tanstack/react-start";
import { DEFAULT_SUMUP, type SumUpSettings } from "./types";

export type TerminalPhase =
  | "idle"
  | "sending"
  | "waiting_card"
  | "selecting_tip"
  | "waiting_pin"
  | "waiting_signature"
  | "processing"
  | "successful"
  | "failed"
  | "cancelled"
  | "offline";

export interface SumUpReader {
  id: string;
  name: string;
  status: string;
  model: string;
  identifier: string;
}

export interface SumUpReaderLiveStatus {
  online: boolean;
  state: string;
  battery: number | null;
  connection: string | null;
  firmware: string | null;
}

export interface TerminalResult {
  status: "successful" | "failed" | "cancelled";
  cardBrand?: string;
  cardLast4?: string;
  sumupTxId?: string;
  readerName?: string;
  error?: string;
}

export interface SumUpActionResult<T extends object | null = null> {
  ok: boolean;
  error?: string;
  data?: T;
}

type Creds = { apiKey: string; merchantCode: string };

const SUMUP = "https://api.sumup.com";

export const PHASE_COPY: Record<TerminalPhase, string> = {
  idle: "Bereit",
  sending: "Betrag wird an das Terminal gesendet…",
  waiting_card: "Bitte Karte auflegen oder Chip einstecken",
  selecting_tip: "Gast wählt Trinkgeld am Terminal",
  waiting_pin: "PIN am Terminal eingeben",
  waiting_signature: "Unterschrift am Terminal",
  processing: "Zahlung wird autorisiert…",
  successful: "Zahlung genehmigt",
  failed: "Zahlung abgelehnt",
  cancelled: "Zahlung abgebrochen",
  offline: "Terminal offline",
};

export function isSumupLiveReady(s: SumUpSettings): boolean {
  return (
    s.mode === "live" &&
    s.apiKey.trim().length > 8 &&
    s.merchantCode.trim().length > 2 &&
    s.readerId.trim().startsWith("rdr_") &&
    !s.readerId.includes("demo")
  );
}

export function maskApiKey(key: string): string {
  const t = key.trim();
  if (t.length < 8) return t ? "••••" : "";
  return `${t.slice(0, 4)} · •••• ${t.slice(-4)}`;
}

function problemMessage(json: unknown, status: number): string {
  if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    const detail = typeof o.detail === "string" ? o.detail : "";
    const title = typeof o.title === "string" ? o.title : "";
    const message = typeof o.message === "string" ? o.message : "";
    const raw = detail || message || title;
    if (raw) {
      if (/unauthorized|invalid.*(token|key|api)/i.test(raw) || status === 401) {
        return "API-Schlüssel ungültig. Bitte in den Einstellungen prüfen.";
      }
      if (/not found/i.test(raw) || status === 404) {
        return "Terminal oder Händlerkonto nicht gefunden.";
      }
      if (/busy|in progress|already/i.test(raw) || status === 409) {
        return "Das Terminal ist beschäftigt. Bitte Vorgang am Gerät beenden.";
      }
      return raw;
    }
  }
  if (status === 401) return "API-Schlüssel ungültig.";
  if (status === 404) return "Terminal nicht gefunden.";
  if (status === 409) return "Terminal ist beschäftigt.";
  return `SumUp-Fehler (${status})`;
}

async function sumupFetch(
  apiKey: string,
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; json: unknown; status: number } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${SUMUP}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
    const text = await res.text();
    let json: unknown = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }
    }
    if (!res.ok) {
      return { ok: false, status: res.status, error: problemMessage(json, res.status) };
    }
    return { ok: true, status: res.status, json };
  } catch {
    return { ok: false, status: 0, error: "Keine Verbindung zu SumUp. Internet am PC prüfen." };
  }
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function parseReader(raw: unknown): SumUpReader | null {
  const o = asRecord(raw);
  if (!o || typeof o.id !== "string") return null;
  const device = asRecord(o.device);
  return {
    id: o.id,
    name: typeof o.name === "string" ? o.name : "SumUp",
    status: typeof o.status === "string" ? o.status : "unknown",
    model: typeof device?.model === "string" ? device.model : "solo",
    identifier: typeof device?.identifier === "string" ? device.identifier : "",
  };
}

function parseReaderList(json: unknown): SumUpReader[] {
  if (Array.isArray(json)) return json.map(parseReader).filter((x): x is SumUpReader => Boolean(x));
  const o = asRecord(json);
  const items = o?.items ?? o?.readers ?? o?.data;
  if (Array.isArray(items)) return items.map(parseReader).filter((x): x is SumUpReader => Boolean(x));
  const one = parseReader(json);
  return one ? [one] : [];
}

function parseLiveStatus(json: unknown): SumUpReaderLiveStatus {
  const root = asRecord(json);
  const d = asRecord(root?.data) ?? root ?? {};
  const status = String(d.status ?? "").toUpperCase();
  const batteryRaw = d.battery_level;
  const battery = typeof batteryRaw === "number" ? Math.round(batteryRaw) : null;
  return {
    online: status === "ONLINE" || String(d.state ?? "").length > 0,
    state: typeof d.state === "string" ? d.state : "IDLE",
    battery,
    connection: typeof d.connection_type === "string" ? d.connection_type : null,
    firmware: typeof d.firmware_version === "string" ? d.firmware_version : null,
  };
}

function parseCheckout(json: unknown): { clientTransactionId: string; checkoutId?: string } | null {
  const root = asRecord(json);
  const d = asRecord(root?.data) ?? root;
  if (!d) return null;
  const id =
    (typeof d.client_transaction_id === "string" && d.client_transaction_id) ||
    (typeof d.clientTransactionId === "string" && d.clientTransactionId) ||
    "";
  if (!id) return null;
  return {
    clientTransactionId: id,
    checkoutId: typeof d.checkout_id === "string" ? d.checkout_id : undefined,
  };
}

function parseTransaction(json: unknown): {
  status: string;
  cardBrand?: string;
  cardLast4?: string;
  txId?: string;
} | null {
  const root = asRecord(json);
  let row: Record<string, unknown> | null = root;
  if (Array.isArray(root?.items) && root.items[0]) row = asRecord(root.items[0]);
  else if (Array.isArray(json) && json[0]) row = asRecord(json[0]);
  else if (asRecord(root?.data)) row = asRecord(root?.data);
  if (!row) return null;
  const card = asRecord(row.card);
  const status = String(row.status ?? row.transaction_status ?? "").toUpperCase();
  if (!status) return null;
  const brand =
    (typeof row.card_type === "string" && row.card_type) ||
    (typeof card?.type === "string" && card.type) ||
    (typeof row.payment_type === "string" && row.payment_type) ||
    undefined;
  const last4 =
    (typeof row.last_4_digits === "string" && row.last_4_digits) ||
    (typeof card?.last_4_digits === "string" && card.last_4_digits) ||
    undefined;
  const txId =
    (typeof row.id === "string" && row.id) ||
    (typeof row.transaction_code === "string" && row.transaction_code) ||
    (typeof row.client_transaction_id === "string" && row.client_transaction_id) ||
    undefined;
  return { status, cardBrand: brand?.toUpperCase(), cardLast4: last4, txId };
}

export const sumupListReaders = createServerFn({ method: "POST" })
  .validator((d: Creds) => d)
  .handler(async ({ data }): Promise<SumUpActionResult<SumUpReader[]>> => {
    const code = data.merchantCode.trim();
    const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers`);
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true, data: parseReaderList(res.json) };
  });

export const sumupPairReader = createServerFn({ method: "POST" })
  .validator((d: Creds & { pairingCode: string; name: string }) => d)
  .handler(async ({ data }): Promise<SumUpActionResult<SumUpReader>> => {
    const code = data.merchantCode.trim();
    const pairing = data.pairingCode.replace(/\s+/g, "").toUpperCase();
    if (pairing.length < 8 || pairing.length > 9) {
      return { ok: false, error: "Pairing-Code muss 8 oder 9 Zeichen haben." };
    }
    const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers`, {
      method: "POST",
      body: JSON.stringify({
        pairing_code: pairing,
        name: data.name.trim() || "Theke",
      }),
    });
    if (!res.ok) return { ok: false, error: res.error };
    const reader = parseReader(res.json) ?? parseReader(asRecord(res.json)?.data);
    if (!reader) return { ok: false, error: "SumUp hat kein Terminal zurückgegeben." };
    return { ok: true, data: reader };
  });

export const sumupReaderStatus = createServerFn({ method: "POST" })
  .validator((d: Creds & { readerId: string }) => d)
  .handler(async ({ data }): Promise<SumUpActionResult<SumUpReaderLiveStatus>> => {
    const code = data.merchantCode.trim();
    const id = data.readerId.trim();
    const res = await sumupFetch(
      data.apiKey.trim(),
      `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}/status`,
    );
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true, data: parseLiveStatus(res.json) };
  });

export const sumupStartCheckout = createServerFn({ method: "POST" })
  .validator((d: Creds & { readerId: string; amountCents: number; description: string }) => d)
  .handler(async ({ data }): Promise<SumUpActionResult<{ clientTransactionId: string }>> => {
    const code = data.merchantCode.trim();
    const id = data.readerId.trim();
    const value = Math.round(data.amountCents);
    if (value < 1) return { ok: false, error: "Betrag muss größer als 0 sein." };
    const res = await sumupFetch(
      data.apiKey.trim(),
      `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}/checkout`,
      {
        method: "POST",
        body: JSON.stringify({
          total_amount: { currency: "EUR", minor_unit: 2, value },
          description: data.description.slice(0, 120),
        }),
      },
    );
    if (!res.ok) return { ok: false, error: res.error };
    const parsed = parseCheckout(res.json);
    if (!parsed) return { ok: false, error: "SumUp hat keine Transaktions-ID geliefert." };
    return { ok: true, data: { clientTransactionId: parsed.clientTransactionId } };
  });

export const sumupTerminateCheckout = createServerFn({ method: "POST" })
  .validator((d: Creds & { readerId: string }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const code = data.merchantCode.trim();
    const id = data.readerId.trim();
    const res = await sumupFetch(
      data.apiKey.trim(),
      `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}/terminate`,
      { method: "POST" },
    );
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true };
  });

export const sumupGetTransaction = createServerFn({ method: "POST" })
  .validator((d: Creds & { clientTransactionId: string }) => d)
  .handler(
    async ({
      data,
    }): Promise<SumUpActionResult<{ status: string; cardBrand?: string; cardLast4?: string; txId?: string }>> => {
      const key = data.apiKey.trim();
      const code = data.merchantCode.trim();
      const tx = encodeURIComponent(data.clientTransactionId);
      const first = await sumupFetch(
        key,
        `/v2.1/merchants/${encodeURIComponent(code)}/transactions?client_transaction_id=${tx}`,
      );
      let parsed = first.ok ? parseTransaction(first.json) : null;
      if (!parsed) {
        const fallback = await sumupFetch(key, `/v0.1/me/transactions?id=${tx}`);
        if (fallback.ok) parsed = parseTransaction(fallback.json);
        else if (!first.ok) return { ok: false, error: first.error };
      }
      if (!parsed) return { ok: true, data: { status: "PENDING" } };
      return { ok: true, data: parsed };
    },
  );

export const sumupDeleteReader = createServerFn({ method: "POST" })
  .validator((d: Creds & { readerId: string }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const code = data.merchantCode.trim();
    const id = data.readerId.trim();
    const res = await sumupFetch(
      data.apiKey.trim(),
      `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true };
  });

function mapReaderState(state: string, online: boolean): TerminalPhase {
  if (!online) return "offline";
  switch (state.toUpperCase()) {
    case "WAITING_FOR_CARD":
      return "waiting_card";
    case "SELECTING_TIP":
      return "selecting_tip";
    case "WAITING_FOR_PIN":
      return "waiting_pin";
    case "WAITING_FOR_SIGNATURE":
      return "waiting_signature";
    case "UPDATING_FIRMWARE":
      return "processing";
    default:
      return "waiting_card";
  }
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = globalThis.setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        globalThis.clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export type DemoChoice = "contactless" | "chip" | "decline";

export function createDemoGate() {
  let settle: ((choice: DemoChoice) => void) | null = null;
  const promised = new Promise<DemoChoice>((resolve) => {
    settle = resolve;
  });
  return {
    choose(choice: DemoChoice) {
      settle?.(choice);
    },
    wait(timeoutMs: number, signal: AbortSignal) {
      return Promise.race([
        promised,
        sleep(timeoutMs, signal).then((): DemoChoice => "contactless"),
      ]);
    },
  };
}

export async function runDemoCheckout(opts: {
  amountCents: number;
  readerName: string;
  signal: AbortSignal;
  onPhase: (phase: TerminalPhase) => void;
  gate?: ReturnType<typeof createDemoGate>;
}): Promise<TerminalResult> {
  const name = opts.readerName || DEFAULT_SUMUP.readerName;
  opts.onPhase("sending");
  await sleep(700, opts.signal);
  opts.onPhase("waiting_card");

  const choice = opts.gate
    ? await opts.gate.wait(4000, opts.signal)
    : ((await sleep(4000, opts.signal), "contactless") as DemoChoice);

  if (choice === "decline") {
    opts.onPhase("processing");
    await sleep(600, opts.signal);
    opts.onPhase("failed");
    return { status: "failed", readerName: name, error: "Karte abgelehnt (Demo)" };
  }

  if (choice === "chip") {
    opts.onPhase("waiting_pin");
    await sleep(1100, opts.signal);
  }

  opts.onPhase("processing");
  await sleep(900, opts.signal);
  opts.onPhase("successful");
  return {
    status: "successful",
    cardBrand: choice === "chip" ? "MASTERCARD" : "VISA",
    cardLast4: choice === "chip" ? "4444" : "4242",
    sumupTxId: `demo_${Date.now().toString(36)}`,
    readerName: name,
  };
}

export async function runLiveCheckout(opts: {
  settings: SumUpSettings;
  amountCents: number;
  description: string;
  signal: AbortSignal;
  onPhase: (phase: TerminalPhase, extra?: SumUpReaderLiveStatus) => void;
}): Promise<TerminalResult> {
  const s = opts.settings;
  const creds = { apiKey: s.apiKey, merchantCode: s.merchantCode };
  opts.onPhase("sending");

  const started = await sumupStartCheckout({
    data: {
      ...creds,
      readerId: s.readerId,
      amountCents: opts.amountCents,
      description: opts.description,
    },
  });
  if (!started.ok || !started.data) {
    opts.onPhase("failed");
    return { status: "failed", readerName: s.readerName, error: started.error ?? "Checkout fehlgeschlagen" };
  }

  const txId = started.data.clientTransactionId;
  const deadline = Date.now() + 90_000;
  let sawCardPrompt = false;

  while (Date.now() < deadline) {
    if (opts.signal.aborted) {
      await sumupTerminateCheckout({ data: { ...creds, readerId: s.readerId } }).catch(() => undefined);
      throw new DOMException("Aborted", "AbortError");
    }

    const [st, tx] = await Promise.all([
      sumupReaderStatus({ data: { ...creds, readerId: s.readerId } }),
      sumupGetTransaction({ data: { ...creds, clientTransactionId: txId } }),
    ]);

    if (st.ok && st.data) {
      const phase = mapReaderState(st.data.state, st.data.online);
      if (phase === "offline" && !sawCardPrompt) {
        opts.onPhase("offline", st.data);
      } else {
        if (phase === "waiting_card" || phase === "waiting_pin") sawCardPrompt = true;
        if (phase !== "offline") opts.onPhase(phase, st.data);
      }
    }

    const tStatus = tx.ok ? tx.data?.status : undefined;
    if (tStatus === "SUCCESSFUL") {
      opts.onPhase("successful", st.data);
      return {
        status: "successful",
        cardBrand: tx.data?.cardBrand,
        cardLast4: tx.data?.cardLast4,
        sumupTxId: tx.data?.txId ?? txId,
        readerName: s.readerName,
      };
    }
    if (tStatus === "FAILED") {
      opts.onPhase("failed", st.data);
      return {
        status: "failed",
        readerName: s.readerName,
        sumupTxId: tx.data?.txId ?? txId,
        error: "Zahlung vom Karteninstitut abgelehnt",
      };
    }
    if (tStatus === "CANCELLED") {
      opts.onPhase("cancelled", st.data);
      return { status: "cancelled", readerName: s.readerName, sumupTxId: tx.data?.txId ?? txId };
    }

    if (sawCardPrompt && st.ok && st.data?.online && st.data.state === "IDLE" && tStatus === "PENDING") {
      await sleep(800, opts.signal);
      continue;
    }

    await sleep(1100, opts.signal);
  }

  await sumupTerminateCheckout({ data: { ...creds, readerId: s.readerId } }).catch(() => undefined);
  opts.onPhase("failed");
  return { status: "failed", readerName: s.readerName, error: "Zeitüberschreitung am Terminal" };
}

export async function runSumupCheckout(opts: {
  settings: SumUpSettings;
  amountCents: number;
  description: string;
  signal: AbortSignal;
  onPhase: (phase: TerminalPhase, extra?: SumUpReaderLiveStatus) => void;
  demoGate?: ReturnType<typeof createDemoGate>;
}): Promise<TerminalResult> {
  if (isSumupLiveReady(opts.settings)) {
    return runLiveCheckout(opts);
  }
  return runDemoCheckout({
    amountCents: opts.amountCents,
    readerName: opts.settings.readerName || DEFAULT_SUMUP.readerName,
    signal: opts.signal,
    onPhase: opts.onPhase,
    gate: opts.demoGate,
  });
}
