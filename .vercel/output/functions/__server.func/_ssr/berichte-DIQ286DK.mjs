import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as usePosStore, E as todayKey, O as vatBreakdown, d as checkTotal, g as formatEUR, n as Button, o as METHOD_LABEL, t as AppShell, y as lastCloseAt } from "./shell-2UgE9VPX.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/berichte-DIQ286DK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsView() {
	const checks = usePosStore((s) => s.checks);
	const receipts = usePosStore((s) => s.receipts);
	const staff = usePosStore((s) => s.staff);
	const products = usePosStore((s) => s.products);
	const dayCloses = usePosStore((s) => s.dayCloses);
	const [scope, setScope] = (0, import_react.useState)("schicht");
	const since = (0, import_react.useMemo)(() => {
		if (scope === "schicht") return lastCloseAt(dayCloses);
		const d = /* @__PURE__ */ new Date();
		d.setHours(0, 0, 0, 0);
		return d.getTime();
	}, [scope, dayCloses]);
	const paid = checks.filter((c) => c.status === "paid" && (c.paidAt ?? 0) >= since);
	const sales = paid.reduce((s, c) => s + checkTotal(c), 0);
	const covers = paid.reduce((s, c) => s + c.guestCount, 0);
	const avg = covers ? Math.round(sales / covers) : 0;
	const open = checks.filter((c) => c.status !== "paid" && c.status !== "voided");
	const hourly = Array.from({ length: 14 }, (_, i) => {
		const hour = i + 8;
		const sum = paid.filter((c) => new Date(c.paidAt ?? 0).getHours() === hour).reduce((s, c) => s + checkTotal(c), 0);
		return {
			hour: `${String(hour).padStart(2, "0")}:00`,
			umsatz: Math.round(sum / 100)
		};
	});
	const byStaff = staff.map((s) => ({
		name: s.name,
		umsatz: paid.filter((c) => c.staffId === s.id).reduce((n, c) => n + checkTotal(c), 0),
		bons: paid.filter((c) => c.staffId === s.id).length
	}));
	const productMap = /* @__PURE__ */ new Map();
	for (const c of paid) for (const item of c.items) {
		if (item.voided) continue;
		const cur = productMap.get(item.productId) ?? {
			name: item.name,
			qty: 0,
			umsatz: 0
		};
		cur.qty += item.qty;
		cur.umsatz += item.unitPrice * item.qty;
		productMap.set(item.productId, cur);
	}
	const top = [...productMap.values()].sort((a, b) => b.umsatz - a.umsatz).slice(0, 8);
	const methods = {
		bar: 0,
		karte: 0
	};
	for (const c of paid) for (const p of c.payments) methods[p.method] += p.amountCents;
	const vatMap = /* @__PURE__ */ new Map();
	for (const c of paid) for (const v of vatBreakdown(c)) {
		const cur = vatMap.get(v.rate) ?? {
			gross: 0,
			net: 0,
			tax: 0
		};
		vatMap.set(v.rate, {
			gross: cur.gross + v.gross,
			net: cur.net + v.net,
			tax: cur.tax + v.tax
		});
	}
	function exportGobd() {
		const payload = {
			exportDate: (/* @__PURE__ */ new Date()).toISOString(),
			periodFrom: new Date(since).toISOString(),
			receipts: receipts.filter((r) => r.printedAt >= since),
			checks: paid
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `vesper-gobd-${todayKey()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mr-auto text-xl font-semibold tracking-tight",
						children: "Berichte"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: scope === "schicht" ? "default" : "outline",
						onClick: () => setScope("schicht"),
						children: "Seit Abschluss"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: scope === "heute" ? "default" : "outline",
						onClick: () => setScope("heute"),
						children: "Heute"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: exportGobd,
						children: "GoBD-Export"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Umsatz",
						value: formatEUR(sales)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Gäste",
						value: String(covers)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Ø Bon / Gast",
						value: formatEUR(avg)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Offene Tische",
						value: String(open.length)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-medium text-muted",
					children: "Stundenumsatz"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: hourly,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--color-border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "hour",
									stroke: "var(--color-muted)",
									fontSize: 11,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--color-muted)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--color-surface)",
										border: "1px solid var(--color-border)"
									},
									formatter: (v) => [`${v} €`, "Umsatz"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "umsatz",
									fill: "var(--color-sage)",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-sm font-medium text-muted",
						children: "Top-Artikel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2",
						children: [top.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								p.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: ["×", p.qty]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums",
								children: formatEUR(p.umsatz)
							})]
						}, p.name)), top.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Noch keine Verkäufe in diesem Zeitraum."
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 text-sm font-medium text-muted",
							children: "Personal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: byStaff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									s.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [s.bons, " Bons"]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono tabular-nums",
									children: formatEUR(s.umsatz)
								})]
							}, s.name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 mb-3 text-sm font-medium text-muted",
							children: "Zahlarten & MwSt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: METHOD_LABEL.bar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums",
								children: formatEUR(methods.bar)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: METHOD_LABEL.karte }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums",
								children: formatEUR(methods.karte)
							})]
						}),
						[...vatMap.entries()].map(([rate, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex justify-between text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"MwSt ",
								rate,
								"%"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums",
								children: formatEUR(v.tax)
							})]
						}, rate))
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [products.length, " Artikel im Stamm · Live-Kennzahlen wie MY orderbird Insights."]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-mono text-2xl tabular-nums",
			children: value
		})]
	});
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsView, {}) });
}
//#endregion
export { Page as component };
