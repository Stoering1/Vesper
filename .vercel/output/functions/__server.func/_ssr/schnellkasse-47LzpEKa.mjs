import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button, t as AppShell, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { t as OrderWorkspace } from "./order-workspace-C2CkWX-K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schnellkasse-47LzpEKa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Schnellkasse() {
	const openWalkIn = usePosStore((s) => s.openWalkIn);
	const [checkId, setCheckId] = (0, import_react.useState)(null);
	const [type, setType] = (0, import_react.useState)("takeaway");
	(0, import_react.useEffect)(() => {
		setCheckId(openWalkIn(type, 1));
	}, []);
	if (!checkId) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 border-b border-border px-4 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: type === "takeaway" ? "default" : "outline",
					onClick: () => {
						const id = openWalkIn("takeaway", 1);
						setType("takeaway");
						setCheckId(id);
					},
					children: "Mitnahme (7 % Speisen)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: type === "lieferung" ? "default" : "outline",
					onClick: () => {
						const id = openWalkIn("lieferung", 1);
						setType("lieferung");
						setCheckId(id);
					},
					children: "Lieferung"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: type === "tisch" ? "default" : "outline",
					onClick: () => {
						const id = openWalkIn("tisch", 1);
						setType("tisch");
						setCheckId(id);
					},
					children: "Theke / vor Ort"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderWorkspace, { checkId })
		})]
	});
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Schnellkasse, {}) });
}
//#endregion
export { Page as component };
