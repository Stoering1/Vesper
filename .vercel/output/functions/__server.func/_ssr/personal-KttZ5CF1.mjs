import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as usePosStore, d as checkTotal, g as formatEUR, n as Button, s as ROLE_LABEL, t as AppShell, x as nid, y as lastCloseAt } from "./shell-2UgE9VPX.mjs";
import { n as Label, t as Input } from "./label-CHCDVkLx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFsWLj7_.mjs";
import { t as Switch } from "./switch-BlacCM_6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/personal-KttZ5CF1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffView() {
	const staff = usePosStore((s) => s.staff);
	const checks = usePosStore((s) => s.checks);
	const dayCloses = usePosStore((s) => s.dayCloses);
	const upsertStaff = usePosStore((s) => s.upsertStaff);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const since = lastCloseAt(dayCloses);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mr-auto text-xl font-semibold",
					children: "Personal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setEdit({
						id: nid("s"),
						name: "",
						pin: "1234",
						role: "service",
						active: true
					}),
					children: "Neu"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: staff.map((s) => {
					const sales = checks.filter((c) => c.staffId === s.id && c.status === "paid" && (c.paidAt ?? 0) >= since).reduce((n, c) => n + checkTotal(c), 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								ROLE_LABEL[s.role],
								" · PIN ",
								s.pin,
								" · ",
								s.active ? "aktiv" : "inaktiv"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm tabular-nums",
								children: formatEUR(sales)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setEdit({ ...s }),
								children: "Bearbeiten"
							})]
						})]
					}, s.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!edit,
				onOpenChange: (o) => !o && setEdit(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Mitarbeiter" }) }),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PIN (4–6 Ziffern)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: edit.pin,
								onChange: (e) => setEdit({
									...edit,
									pin: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rolle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm",
								value: edit.role,
								onChange: (e) => setEdit({
									...edit,
									role: e.target.value
								}),
								children: Object.entries(ROLE_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: k,
									children: v
								}, k))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Aktiv" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: edit.active,
									onCheckedChange: (v) => setEdit({
										...edit,
										active: v
									})
								})]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (edit?.name && edit.pin) {
								upsertStaff(edit);
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
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffView, {}) });
}
//#endregion
export { Page as component };
