import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button, t as AppShell, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { n as Label, t as Input } from "./label-Blqtvcso.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/einstellungen-H_oB0qud.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsView() {
	const settings = usePosStore((s) => s.settings);
	const updateSettings = usePosStore((s) => s.updateSettings);
	const resetDemo = usePosStore((s) => s.resetDemo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Einstellungen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 mb-6 text-sm text-muted",
				children: "Betrieb, TSE-Demo und Happy Hour."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Betriebsname",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.restaurantName,
							onChange: (e) => updateSettings({ restaurantName: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Adresse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.address,
							onChange: (e) => updateSettings({ address: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "USt-IdNr. / Steuernummer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.taxId,
							onChange: (e) => updateSettings({ taxId: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "TSE-Seriennummer (Demo)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.tseSerial,
							onChange: (e) => updateSettings({ tseSerial: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bon-Fußtext",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.receiptFooter,
							onChange: (e) => updateSettings({ receiptFooter: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Happy Hour von",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: settings.happyHourStart,
								onChange: (e) => updateSettings({ happyHourStart: e.target.value })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Happy Hour bis",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: settings.happyHourEnd,
								onChange: (e) => updateSettings({ happyHourEnd: e.target.value })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [
							"Nächster Bon ",
							settings.nextBonNumber,
							" · TSE-Zähler ",
							settings.tseCounter
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							resetDemo();
							toast.success("Demo-Daten zurückgesetzt");
						},
						children: "Demo zurücksetzen"
					})
				]
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "mb-1 block",
		children: label
	}), children] });
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {}) });
}
//#endregion
export { Page as component };
