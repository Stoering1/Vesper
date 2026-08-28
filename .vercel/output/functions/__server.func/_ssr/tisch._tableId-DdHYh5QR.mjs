import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as usePosStore, n as Button, t as AppShell } from "./shell-2UgE9VPX.mjs";
import { n as Route } from "./router-i7XEMTMt.mjs";
import { t as OrderWorkspace } from "./order-workspace-DmfdY6ER.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tisch._tableId-DdHYh5QR.js
var import_jsx_runtime = require_jsx_runtime();
function TableOrder() {
	const { tableId } = Route.useParams();
	const check = usePosStore((s) => s.checks.find((c) => c.tableId === tableId && c.status !== "paid" && c.status !== "voided"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: check ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderWorkspace, { checkId: check.id }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center gap-3 p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Kein offener Vorgang an diesem Tisch."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Zum Tischplan"
			})
		})]
	}) });
}
//#endregion
export { TableOrder as component };
