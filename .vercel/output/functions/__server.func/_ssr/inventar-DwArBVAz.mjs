import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as usePosStore, n as Button, t as AppShell } from "./shell-2UgE9VPX.mjs";
import { t as Badge } from "./badge-tPbUEGoO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventar-DwArBVAz.js
var import_jsx_runtime = require_jsx_runtime();
function InventoryView() {
	const products = usePosStore((s) => s.products);
	const adjustStock = usePosStore((s) => s.adjustStock);
	const tracked = products.filter((p) => p.stock != null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-4 text-xl font-semibold",
				children: "Inventar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-muted",
				children: "Bestand wird beim Bezahlen automatisch abgezogen. Unter 8 Stück gilt als kritisch."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: tracked.map((p) => {
					const low = (p.stock ?? 0) < 8;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: p.sku
								})]
							}),
							low ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "danger",
								children: "Niedrig"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "sage",
								children: "OK"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "w-12 text-right font-mono tabular-nums",
								children: p.stock
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => adjustStock(p.id, -1),
										children: "−1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => adjustStock(p.id, 1),
										children: "+1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "muted",
										onClick: () => adjustStock(p.id, 10),
										children: "+10"
									})
								]
							})
						]
					}, p.id);
				})
			})
		]
	});
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryView, {}) });
}
//#endregion
export { Page as component };
