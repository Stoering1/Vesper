import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { o as cn } from "./shell-wQX5E6Oo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CMfR9Qps.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "border-transparent bg-surface-2 text-muted",
		sage: "border-transparent bg-sage/20 text-sage",
		amber: "border-transparent bg-amber/20 text-amber",
		danger: "border-transparent bg-danger/20 text-danger",
		info: "border-transparent bg-info/20 text-info",
		outline: "border-border text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
