import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { p as Printer } from "../_libs/lucide-react.mjs";
import { T as taxFromGross, b as netFromGross, g as formatEUR, m as formatDateTime, n as Button, o as METHOD_LABEL } from "./shell-2UgE9VPX.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFsWLj7_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipt-modal-CrQLR7zs.js
var import_jsx_runtime = require_jsx_runtime();
function ReceiptModal({ receipt, onClose }) {
	const navigate = useNavigate();
	if (!receipt) return null;
	const s = receipt.snapshot;
	const lines = s.lines.filter((l) => !l.voided);
	const gross = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0) - s.discountCents;
	const byRate = /* @__PURE__ */ new Map();
	for (const l of lines) byRate.set(l.taxRate, (byRate.get(l.taxRate) ?? 0) + l.unitPrice * l.qty);
	const title = receipt.type === "storno" ? "Stornobeleg" : receipt.type === "zwischen" ? "Zwischenbon" : receipt.type === "z-abschluss" ? "Z-Abschluss" : "Rechnung";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => {
			if (!o) {
				onClose();
				if (receipt.type === "rechnung" || receipt.type === "storno") navigate({ to: "/" });
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[min(96vw,420px)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "print-receipt",
					className: "rounded-md border border-border bg-accent px-4 py-5 font-mono text-[12px] leading-relaxed text-accent-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-sm font-semibold tracking-wide",
							children: s.restaurantName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center",
							children: s.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center",
							children: ["USt-IdNr. ", s.taxId]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "my-2 text-center",
							children: "--------------------------------"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							s.tableLabel,
							" · ",
							s.guestCount,
							" Gäste"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Bedienung: ", s.staffName] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Bon ",
							receipt.number,
							" · ",
							formatDateTime(receipt.printedAt)
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "my-2",
							children: "--------------------------------"
						}),
						lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								l.qty,
								"× ",
								l.name
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatEUR(l.unitPrice * l.qty) })]
						}, i)),
						s.discountCents > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.discountLabel || "Rabatt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["− ", formatEUR(s.discountCents)] })]
						}) : null,
						s.tipCents > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trinkgeld" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatEUR(s.tipCents) })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "my-2",
							children: "--------------------------------"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Summe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatEUR(gross + s.tipCents) })]
						}),
						[...byRate.entries()].map(([rate, g]) => {
							const share = s.discountCents > 0 && gross + s.discountCents > 0 ? Math.round(g - s.discountCents * g / (gross + s.discountCents)) : g;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"MwSt ",
									rate,
									"% (netto ",
									formatEUR(netFromGross(share, rate)),
									")"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatEUR(taxFromGross(share, rate)) })]
							}, rate);
						}),
						s.payments.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [METHOD_LABEL[p.method], p.method === "karte" && p.cardBrand ? ` ${p.cardBrand}${p.cardLast4 ? ` •••• ${p.cardLast4}` : ""}` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatEUR(p.amountCents) })]
						}, i)),
						s.payments.some((p) => p.readerName) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-accent-fg/70",
							children: ["Terminal ", s.payments.find((p) => p.readerName)?.readerName]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "my-2",
							children: "--------------------------------"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] leading-snug",
							children: [
								"TSE-Seriennr. ",
								receipt.tse.serial,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Signaturzähler ",
								receipt.tse.txNumber,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Prüfwert ",
								receipt.tse.signature,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								receipt.tse.processType,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Demo-TSE — nicht zertifiziert nach KassenSichV."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-center text-[11px]",
							children: "Vielen Dank für Ihren Besuch."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Drucken"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						onClose();
						if (receipt.type === "rechnung" || receipt.type === "storno") navigate({ to: "/" });
					},
					children: "Fertig"
				})] })
			]
		})
	});
}
//#endregion
export { ReceiptModal as t };
