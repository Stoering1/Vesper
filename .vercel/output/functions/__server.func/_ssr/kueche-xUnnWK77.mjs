import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as formatTime, l as formatDuration, n as Button, o as cn, t as AppShell, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { a as STATION_LABEL, t as COURSE_LABEL } from "./types-RsjRE-3x.mjs";
import { t as Badge } from "./badge-CMfR9Qps.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kueche-xUnnWK77.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLS = [
	{
		status: "neu",
		label: "Neu"
	},
	{
		status: "in_arbeit",
		label: "In Arbeit"
	},
	{
		status: "bereit",
		label: "Bereit"
	}
];
function KitchenBoard() {
	const tickets = usePosStore((s) => s.tickets);
	const bumpTicket = usePosStore((s) => s.bumpTicket);
	const [station, setStation] = (0, import_react.useState)("alle");
	const filtered = (0, import_react.useMemo)(() => tickets.filter((t) => t.status !== "serviert").filter((t) => station === "alle" ? true : t.station === station).sort((a, b) => a.createdAt - b.createdAt), [tickets, station]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mr-2 font-medium",
				children: "Bestellmanagement"
			}), [
				"alle",
				"kueche",
				"bar",
				"theke"
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: station === s ? "default" : "outline",
				onClick: () => setStation(s),
				children: s === "alle" ? "Alle Stationen" : STATION_LABEL[s]
			}, s))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid min-h-0 flex-1 gap-3 overflow-auto p-4 md:grid-cols-3",
			children: COLS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-col rounded-xl border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: col.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: filtered.filter((t) => t.status === col.status).length })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2 p-2",
					children: filtered.filter((t) => t.status === col.status).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: cn("rounded-lg border border-border bg-bg p-3", Date.now() - t.createdAt > 9e5 && t.status !== "bereit" && "border-danger/50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: t.tableLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										COURSE_LABEL[t.course],
										" · ",
										STATION_LABEL[t.station],
										" · ",
										t.staffName
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs tabular-nums text-muted",
									children: [
										formatTime(t.createdAt),
										" · ",
										formatDuration(t.createdAt)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1 text-sm",
								children: t.items.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: [
											i.qty,
											"× ",
											i.name
										]
									}),
									i.modifiers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted",
										children: i.modifiers.join(", ")
									}) : null,
									i.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-amber",
										children: i.note
									}) : null
								] }, idx))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [
									t.status === "neu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										className: "flex-1",
										onClick: () => bumpTicket(t.id, "in_arbeit"),
										children: "Start"
									}) : null,
									t.status === "in_arbeit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "sage",
										className: "flex-1",
										onClick: () => bumpTicket(t.id, "bereit"),
										children: "Fertig"
									}) : null,
									t.status === "bereit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "flex-1",
										onClick: () => bumpTicket(t.id, "serviert"),
										children: "Serviert"
									}) : null
								]
							})
						]
					}, t.id))
				})]
			}, col.status))
		})]
	});
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KitchenBoard, {}) });
}
//#endregion
export { Page as component };
