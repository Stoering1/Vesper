import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { O as ArrowRightLeft, h as Merge, r as Users } from "../_libs/lucide-react.mjs";
import { _ as tableLabel, a as checkTotal, l as formatDuration, n as Button, o as cn, t as AppShell, u as formatEUR, v as tableStatus, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { n as Label, t as Input } from "./label-Blqtvcso.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DoZyjimh.mjs";
import { a as Root2, i as Portal2, n as Item2, o as Separator2, r as Label2, s as Trigger, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-W30xTkfs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 min-w-44 overflow-hidden rounded-lg border border-border bg-surface p-1 text-fg shadow-[var(--shadow-panel)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none select-none focus:bg-surface-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-border", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-xs font-medium text-muted", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
function TablePlan() {
	const rooms = usePosStore((s) => s.rooms);
	const tables = usePosStore((s) => s.tables);
	const checks = usePosStore((s) => s.checks);
	const reservations = usePosStore((s) => s.reservations);
	const openTable = usePosStore((s) => s.openTable);
	const moveCheck = usePosStore((s) => s.moveCheck);
	const mergeChecks = usePosStore((s) => s.mergeChecks);
	const getOpenCheckForTable = usePosStore((s) => s.getOpenCheckForTable);
	const navigate = useNavigate();
	const [roomId, setRoomId] = (0, import_react.useState)(rooms[0]?.id ?? "");
	const [guestFor, setGuestFor] = (0, import_react.useState)(null);
	const [guests, setGuests] = (0, import_react.useState)(2);
	const [moveFrom, setMoveFrom] = (0, import_react.useState)(null);
	const roomTables = (0, import_react.useMemo)(() => tables.filter((t) => t.roomId === roomId), [tables, roomId]);
	function enterTable(table) {
		if (getOpenCheckForTable(table.id)) {
			navigate({
				to: "/tisch/$tableId",
				params: { tableId: table.id }
			});
			return;
		}
		setGuests(table.seats);
		setGuestFor(table);
	}
	function confirmOpen() {
		if (!guestFor) return;
		openTable(guestFor.id, guests);
		const id = guestFor.id;
		setGuestFor(null);
		navigate({
			to: "/tisch/$tableId",
			params: { tableId: id }
		});
	}
	function onTableClick(table) {
		if (moveFrom) {
			const ok = moveCheck(moveFrom, table.id);
			setMoveFrom(null);
			if (ok) navigate({
				to: "/tisch/$tableId",
				params: { tableId: table.id }
			});
			return;
		}
		enterTable(table);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-4 py-3",
				children: [rooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: r.id === roomId ? "default" : "outline",
					onClick: () => setRoomId(r.id),
					children: r.name
				}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto hidden items-center gap-4 text-xs text-muted sm:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "border-border bg-surface-2",
							label: "Frei"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "border-sage/50 bg-sage/20",
							label: "Besetzt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "border-amber/50 bg-amber/20",
							label: "Rechnung"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							swatch: "border-info/50 bg-info/15",
							label: "Reserviert"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative hidden min-h-[520px] flex-1 p-4 md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-full min-h-[520px] overflow-hidden rounded-xl border border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-6 rounded-lg border border-dashed border-border/80" }), roomTables.map((table) => {
						const status = tableStatus(table.id, checks, reservations);
						const check = getOpenCheckForTable(table.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onTableClick(table),
							onContextMenu: (e) => e.preventDefault(),
							className: cn("absolute flex flex-col items-center justify-center gap-0.5 border px-2 text-center transition-[transform,background-color] duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40", table.shape === "round" ? "rounded-full" : "rounded-lg", status === "free" && "border-border bg-surface-2 text-muted", status === "occupied" && "border-sage/50 bg-sage/20 text-fg", status === "billed" && "border-amber/50 bg-amber/20 text-fg", status === "reserved" && "border-info/50 bg-info/15 text-fg", moveFrom && "ring-1 ring-accent/30"),
							style: {
								left: `${table.x}%`,
								top: `${table.y}%`,
								width: `${table.w}%`,
								height: `${table.h}%`
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-semibold leading-none",
								children: table.number
							}), check ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tabular-nums",
								children: formatEUR(checkTotal(check))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted",
								children: [
									check.guestCount,
									" · ",
									formatDuration(check.openedAt)
								]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-subtle",
								children: [table.seats, " Plätze"]
							})]
						}, table.id);
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:hidden",
				children: roomTables.map((table) => {
					const status = tableStatus(table.id, checks, reservations);
					const check = getOpenCheckForTable(table.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onTableClick(table),
						className: cn("flex min-h-24 flex-col items-start justify-between rounded-lg border p-3 text-left", status === "free" && "border-border bg-surface-2", status === "occupied" && "border-sage/50 bg-sage/20", status === "billed" && "border-amber/50 bg-amber/20", status === "reserved" && "border-info/50 bg-info/15"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-lg font-semibold",
							children: ["Tisch ", table.number]
						}), check ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: formatEUR(checkTotal(check))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted",
							children: [table.seats, " Plätze"]
						})]
					}, table.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden border-t border-border px-4 py-2 text-xs text-subtle md:block",
				children: ["Rechtsklick-Aktionen über das Tisch-Menü in der Liste. Zum Umbuchen: Tisch wählen, dann Ziel antippen.", moveFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-amber",
					children: "Umbuchen aktiv — Ziel-Tisch wählen oder abbrechen."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-x-auto border-t border-border md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-max gap-2 px-4 py-3",
					children: [roomTables.map((table) => {
						const check = getOpenCheckForTable(table.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "font-mono",
								children: table.number
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: ["Tisch ", table.number] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => enterTable(table),
								children: "Öffnen"
							}),
							check ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setMoveFrom(check.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "size-4" }), " Umbuchen"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								checks.filter((c) => c.id !== check.id && c.status !== "paid" && c.status !== "voided" && c.tableId).slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => mergeChecks(check.id, c.id),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Merge, { className: "size-4" }),
										"Zusammenlegen mit ",
										tableLabel(tables, c.tableId, c.type)
									]
								}, c.id))
							] }) : null
						] })] }, table.id);
					}), moveFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setMoveFrom(null),
						children: "Abbrechen"
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!guestFor,
				onOpenChange: (o) => !o && setGuestFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						"Tisch ",
						guestFor?.number,
						" öffnen"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Wie viele Gäste sitzen am Tisch?" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "guests",
								children: "Gäste"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "guests",
								type: "number",
								min: 1,
								max: 20,
								value: guests,
								onChange: (e) => setGuests(Number(e.target.value) || 1)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-2 size-5 text-muted" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setGuestFor(null),
						children: "Abbrechen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: confirmOpen,
						children: "Tisch öffnen"
					})] })
				] })
			})
		]
	});
}
function Legend({ swatch, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-3 rounded-sm border", swatch) }), label]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePlan, {}) });
}
//#endregion
export { Home as component };
