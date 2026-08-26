import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as vatBreakdown, a as checkTotal, c as formatDateTime, g as parseEuroInput, n as Button, p as lastCloseAt, t as AppShell, u as formatEUR, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { n as Label, t as Input } from "./label-Blqtvcso.mjs";
import { t as ReceiptModal } from "./receipt-modal-vkn8X_No.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/abschluss-DPcHHLWM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CloseDayView() {
	const checks = usePosStore((s) => s.checks);
	const receipts = usePosStore((s) => s.receipts);
	const dayCloses = usePosStore((s) => s.dayCloses);
	const closeDay = usePosStore((s) => s.closeDay);
	const [counted, setCounted] = (0, import_react.useState)("");
	const [lastReceipt, setLastReceipt] = (0, import_react.useState)(null);
	const since = lastCloseAt(dayCloses);
	const paid = checks.filter((c) => c.status === "paid" && (c.paidAt ?? 0) >= since);
	const methods = {
		bar: 0,
		karte: 0
	};
	for (const c of paid) for (const p of c.payments) methods[p.method] += p.amountCents;
	const sales = paid.reduce((s, c) => s + checkTotal(c), 0);
	const countedCents = parseEuroInput(counted);
	const diff = counted ? countedCents - methods.bar : 0;
	const vat = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const c of paid) for (const v of vatBreakdown(c)) {
			const cur = map.get(v.rate) ?? {
				gross: 0,
				tax: 0
			};
			map.set(v.rate, {
				gross: cur.gross + v.gross,
				tax: cur.tax + v.tax
			});
		}
		return [...map.entries()];
	}, [paid]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Kassenabschluss"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					"Schicht seit ",
					formatDateTime(since),
					". Z-Bon mit Demo-TSE, analog zum Tagesabschluss."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-2 rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						k: "Bons",
						v: String(receipts.filter((r) => r.printedAt >= since && r.type === "rechnung").length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						k: "Umsatz",
						v: formatEUR(sales)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						k: "Bar (Soll)",
						v: formatEUR(methods.bar)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						k: "Karte",
						v: formatEUR(methods.karte)
					}),
					vat.map(([rate, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						k: `MwSt ${rate}%`,
						v: formatEUR(v.tax)
					}, rate))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gezählter Kassenbestand (Bar)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1 font-mono",
						placeholder: formatEUR(methods.bar),
						value: counted,
						onChange: (e) => setCounted(e.target.value)
					}),
					counted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `mt-2 text-sm ${diff === 0 ? "text-sage" : "text-amber"}`,
						children: ["Differenz: ", formatEUR(diff)]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				size: "lg",
				disabled: !counted,
				onClick: () => {
					if (closeDay(countedCents)) {
						const rec = usePosStore.getState().receipts.at(-1) ?? null;
						setLastReceipt(rec);
						setCounted("");
					}
				},
				children: "Z-Abschluss erstellen"
			}),
			dayCloses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-sm font-medium text-muted",
					children: "Letzte Abschlüsse"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: dayCloses.slice().reverse().slice(0, 8).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between rounded-lg border border-border px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							formatDateTime(d.at),
							" · ",
							d.staffName
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							children: formatEUR(d.salesByMethod.bar + d.salesByMethod.karte)
						})]
					}, d.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptModal, {
				receipt: lastReceipt,
				onClose: () => setLastReceipt(null)
			})
		]
	});
}
function Line({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "flex justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums",
			children: v
		})]
	});
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseDayView, {}) });
}
//#endregion
export { Page as component };
