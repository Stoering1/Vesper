import type { TseRecord } from "./types";

function hash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function signTse(
  serial: string,
  txNumber: number,
  payload: string,
  processType = "Kassenbeleg-V1",
): TseRecord {
  const timeStart = Date.now();
  const timeEnd = timeStart;
  const raw = `${serial}|${txNumber}|${processType}|${payload}|${timeStart}`;
  const signature = `${hash(raw)}${hash(raw + serial)}${hash(String(txNumber))}${hash(payload).slice(0, 8)}`;
  return {
    txNumber,
    signature: signature.toUpperCase(),
    serial,
    timeStart,
    timeEnd,
    processType,
  };
}
