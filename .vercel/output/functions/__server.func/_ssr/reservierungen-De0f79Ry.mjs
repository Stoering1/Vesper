import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as formatDateTime, h as nid, n as Button, t as AppShell, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { n as Label, t as Input } from "./label-Blqtvcso.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DoZyjimh.mjs";
import { t as Badge } from "./badge-CMfR9Qps.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reservierungen-De0f79Ry.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReservationsView() {
	const reservations = usePosStore((s) => s.reservations);
	const tables = usePosStore((s) => s.tables);
	const upsertReservation = usePosStore((s) => s.upsertReservation);
	const setReservationStatus = usePosStore((s) => s.setReservationStatus);
	const openTable = usePosStore((s) => s.openTable);
	const getOpenCheckForTable = usePosStore((s) => s.getOpenCheckForTable);
	const navigate = useNavigate();
	const [edit, setEdit] = (0, import_react.useState)(null);
	const upcoming = reservations.slice().sort((a, b) => a.at - b.at).filter((r) => r.status !== "storniert");
	function seat(r) {
		if (!r.tableId) return;
		setReservationStatus(r.id, "eingetroffen");
		if (!getOpenCheckForTable(r.tableId)) openTable(r.tableId, r.covers);
		navigate({
			to: "/tisch/$tableId",
			params: { tableId: r.tableId }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mr-auto text-xl font-semibold",
					children: "Reservierungen"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const at = /* @__PURE__ */ new Date();
						at.setHours(19, 0, 0, 0);
						setEdit({
							id: nid("res"),
							name: "",
							phone: "",
							covers: 2,
							at: at.getTime(),
							tableId: tables[0]?.id ?? null,
							notes: "",
							status: "erwartet"
						});
					},
					children: "Neue Reservierung"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: upcoming.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-xl border border-border bg-surface px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									formatDateTime(r.at),
									" · ",
									r.covers,
									" Personen",
									r.tableId ? ` · Tisch ${tables.find((t) => t.id === r.tableId)?.number}` : ""
								]
							}),
							r.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: r.notes
							}) : null
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: r.status === "eingetroffen" ? "sage" : r.status === "noshow" ? "danger" : "info",
									children: r.status === "erwartet" ? "Erwartet" : r.status === "eingetroffen" ? "Eingetroffen" : r.status === "noshow" ? "No-Show" : r.status
								}),
								r.status === "erwartet" && r.tableId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => seat(r),
									children: "Einchecken"
								}) : null,
								r.status === "erwartet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setReservationStatus(r.id, "noshow"),
									children: "No-Show"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setReservationStatus(r.id, "storniert"),
									children: "Storno"
								})] }) : null
							]
						})]
					})
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!edit,
				onOpenChange: (o) => !o && setEdit(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reservierung" }) }),
					edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: edit.name,
								onChange: (e) => setEdit({
									...edit,
									name: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Telefon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: edit.phone,
								onChange: (e) => setEdit({
									...edit,
									phone: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Personen" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									type: "number",
									value: edit.covers,
									onChange: (e) => setEdit({
										...edit,
										covers: Number(e.target.value) || 1
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tisch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm",
									value: edit.tableId ?? "",
									onChange: (e) => setEdit({
										...edit,
										tableId: e.target.value || null
									}),
									children: tables.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t.id,
										children: t.number
									}, t.id))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Datum / Uhrzeit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "datetime-local",
								value: toLocal(edit.at),
								onChange: (e) => setEdit({
									...edit,
									at: new Date(e.target.value).getTime()
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notiz" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: edit.notes,
								onChange: (e) => setEdit({
									...edit,
									notes: e.target.value
								})
							})] })
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (edit?.name) {
								upsertReservation(edit);
								setEdit(null);
							}
						},
						children: "Speichern"
					}) })
				] })
			})
		]
	});
}
function toLocal(ts) {
	const d = new Date(ts);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReservationsView, {}) });
}
//#endregion
export { Page as component };
