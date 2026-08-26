import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ChefHat, D as Ban, E as Banknote, a as Trash2, f as Plus, m as Minus, o as StickyNote, r as Users, s as Split, u as ReceiptText, v as LoaderCircle, x as CreditCard } from "../_libs/lucide-react.mjs";
import { S as vatBreakdown, _ as tableLabel, a as checkTotal, f as itemTotal, g as parseEuroInput, i as checkSubtotal, n as Button, o as cn, r as checkDue, s as effectivePrice, u as formatEUR, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { n as Label, t as Input } from "./label-Blqtvcso.mjs";
import { n as COURSE_ORDER, t as COURSE_LABEL } from "./types-RsjRE-3x.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DoZyjimh.mjs";
import { t as ReceiptModal } from "./receipt-modal-vkn8X_No.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-CMfR9Qps.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-workspace-C2CkWX-K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none transition-colors select-none", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-px", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function PaymentFlow({ open, onOpenChange, check, onPaid }) {
	const pay = usePosStore((s) => s.pay);
	usePosStore((s) => s.setTip);
	const [method, setMethod] = (0, import_react.useState)("bar");
	const [received, setReceived] = (0, import_react.useState)("");
	const [tipPct, setTipPct] = (0, import_react.useState)(0);
	const [cardWait, setCardWait] = (0, import_react.useState)(false);
	const [splitCard, setSplitCard] = (0, import_react.useState)("");
	const sub = checkTotal({
		...check,
		tipCents: 0
	});
	const tip = Math.round(sub * tipPct / 100);
	const total = sub + tip;
	const rec = parseEuroInput(received) || total;
	const change = method === "bar" ? rec - total : 0;
	(0, import_react.useEffect)(() => {
		if (open) {
			setReceived("");
			setTipPct(0);
			setMethod("bar");
			setCardWait(false);
			setSplitCard("");
		}
	}, [open, check.id]);
	const keypad = (0, import_react.useMemo)(() => [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		",",
		"0",
		"C"
	], []);
	function key(k) {
		if (k === "C") {
			setReceived("");
			return;
		}
		setReceived((v) => k === "," && v.includes(",") ? v : v + k);
	}
	function finish(payments) {
		const receipt = pay(check.id, payments, tip);
		if (receipt) {
			toast.success("Bezahlt");
			onPaid(receipt);
		} else toast.message("Teilzahlung erfasst");
	}
	function payCash() {
		if (rec < total) {
			finish([{
				method: "bar",
				amountCents: rec,
				receivedCents: rec
			}]);
			return;
		}
		finish([{
			method: "bar",
			amountCents: total,
			receivedCents: rec
		}]);
	}
	function payCard() {
		setCardWait(true);
		window.setTimeout(() => {
			setCardWait(false);
			finish([{
				method: "karte",
				amountCents: total,
				receivedCents: total
			}]);
		}, 1100);
	}
	function payMixed() {
		const card = parseEuroInput(splitCard);
		if (card <= 0 || card >= total) {
			toast.error("Kartenanteil muss zwischen 0 und Gesamt liegen");
			return;
		}
		const cash = total - card;
		finish([{
			method: "karte",
			amountCents: card,
			receivedCents: card
		}, {
			method: "bar",
			amountCents: cash,
			receivedCents: cash
		}]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[min(96vw,640px)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Zahlung" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Offen ", formatEUR(checkDue({
					...check,
					tipCents: tip
				}))] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Zu zahlen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-3xl font-semibold tabular-nums",
						children: formatEUR(total)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							0,
							5,
							10
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: tipPct === p ? "default" : "outline",
							onClick: () => setTipPct(p),
							children: p === 0 ? "ohne Trinkgeld" : `${p} %`
						}, p))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: method === "bar" ? "sage" : "outline",
						onClick: () => setMethod("bar"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-4" }), "Bar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: method === "karte" ? "sage" : "outline",
						onClick: () => setMethod("karte"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), "Karte"]
					})]
				}),
				method === "bar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Erhalten" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono text-lg tabular-nums",
							value: received,
							onChange: (e) => setReceived(e.target.value),
							placeholder: formatEUR(total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid grid-cols-3 gap-1",
							children: keypad.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "muted",
								className: "h-12 text-lg",
								onClick: () => key(k),
								children: k
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: [
								500,
								1e3,
								2e3,
								5e3,
								1e4
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setReceived((c / 100).toFixed(2).replace(".", ",")),
								children: formatEUR(c)
							}, c))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between rounded-lg border border-border bg-bg p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Rückgeld"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("font-mono text-3xl tabular-nums", change < 0 && "text-danger"),
							children: formatEUR(Math.max(0, change))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xl",
							className: "mt-4 w-full",
							onClick: payCash,
							children: "Bar kassieren"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-bg p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Kartenterminal (Demo)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm",
								children: ["Kontaktlos oder Chip — Betrag ", formatEUR(total)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Oder gemischt: Kartenanteil" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							placeholder: "z. B. 20,00",
							value: splitCard,
							onChange: (e) => setSplitCard(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "flex-1",
								size: "lg",
								onClick: payCard,
								disabled: cardWait,
								children: [cardWait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), cardWait ? "Bitte Karte auflegen…" : "Karte kassieren"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								onClick: payMixed,
								disabled: !splitCard,
								children: "Gemischt"
							})]
						})
					]
				})
			]
		})
	});
}
setTip;
function OrderWorkspace({ checkId }) {
	const navigate = useNavigate();
	const check = usePosStore((s) => s.checks.find((c) => c.id === checkId));
	const products = usePosStore((s) => s.products);
	const categories = usePosStore((s) => s.categories);
	const tables = usePosStore((s) => s.tables);
	const settings = usePosStore((s) => s.settings);
	const addItem = usePosStore((s) => s.addItem);
	const setItemQty = usePosStore((s) => s.setItemQty);
	const setItemNote = usePosStore((s) => s.setItemNote);
	const voidItem = usePosStore((s) => s.voidItem);
	const sendCourses = usePosStore((s) => s.sendCourses);
	const holdCourse = usePosStore((s) => s.holdCourse);
	const setDiscount = usePosStore((s) => s.setDiscount);
	const setGuests = usePosStore((s) => s.setGuests);
	const requestBill = usePosStore((s) => s.requestBill);
	const splitItems = usePosStore((s) => s.splitItems);
	const printZwischen = usePosStore((s) => s.printZwischen);
	const voidCheck = usePosStore((s) => s.voidCheck);
	const [catId, setCatId] = (0, import_react.useState)(categories[0]?.id ?? "");
	const [query, setQuery] = (0, import_react.useState)("");
	const [modProduct, setModProduct] = (0, import_react.useState)(null);
	const [modSel, setModSel] = (0, import_react.useState)({});
	const [noteItem, setNoteItem] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [splitMode, setSplitMode] = (0, import_react.useState)(false);
	const [splitSel, setSplitSel] = (0, import_react.useState)([]);
	const [discOpen, setDiscOpen] = (0, import_react.useState)(false);
	const [discPct, setDiscPct] = (0, import_react.useState)("10");
	const [receipt, setReceipt] = (0, import_react.useState)(null);
	const [voidOpen, setVoidOpen] = (0, import_react.useState)(false);
	const [voidReason, setVoidReason] = (0, import_react.useState)("Irrtum");
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return products.filter((p) => {
			if (!p.active) return false;
			if (q) return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
			return p.categoryId === catId;
		});
	}, [
		products,
		catId,
		query
	]);
	if (!check || check.status === "paid" || check.status === "voided") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center gap-3 p-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg font-medium",
			children: "Vorgang geschlossen"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => navigate({ to: "/" }),
			children: "Zum Tischplan"
		})]
	});
	function tapProduct(product) {
		if (product.modifiers.length > 0) {
			const initial = {};
			for (const g of product.modifiers) initial[g.id] = [];
			setModSel(initial);
			setModProduct(product);
			return;
		}
		addItem(check.id, product.id);
	}
	function confirmModifiers() {
		if (!modProduct || !check) return;
		for (const g of modProduct.modifiers) if (g.required && (modSel[g.id]?.length ?? 0) === 0) {
			toast.error(`${g.name} ist Pflicht`);
			return;
		}
		const names = modProduct.modifiers.flatMap((g) => g.options.filter((o) => (modSel[g.id] ?? []).includes(o.id)).map((o) => o.name));
		addItem(check.id, modProduct.id, { modifiers: names });
		setModProduct(null);
	}
	function sendOpen() {
		if (!check) return;
		const courses = COURSE_ORDER.filter((c) => !check.courseHold[c] && check.items.some((i) => i.course === c && !i.sent && !i.voided));
		if (courses.length === 0) {
			toast.message("Nichts zu senden");
			return;
		}
		sendCourses(check.id, courses);
		toast.success("An Küche / Bar gesendet");
	}
	function doSplit() {
		if (!check) return;
		if (!splitItems(check.id, splitSel)) {
			toast.error("Mindestens eine Position muss bleiben");
			return;
		}
		setSplitMode(false);
		setSplitSel([]);
		toast.success("Rechnung geteilt");
	}
	const vat = vatBreakdown(check);
	const unsent = check.items.filter((i) => !i.sent && !i.voided);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col lg:flex-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-h-0 min-w-0 flex-1 flex-col border-b border-border lg:border-r lg:border-b-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mr-2 font-medium",
								children: tableLabel(tables, check.tableId, check.type)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: check.status === "billed" ? "amber" : "sage",
								children: check.status === "billed" ? "Rechnung" : "Offen"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "h-9 w-16",
									type: "number",
									min: 1,
									value: check.guestCount,
									onChange: (e) => setGuests(check.id, Number(e.target.value) || 1)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto px-3 py-2",
						children: categories.slice().sort((a, b) => a.sort - b.sort).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: c.id === catId && !query ? "default" : "outline",
							onClick: () => {
								setCatId(c.id);
								setQuery("");
							},
							children: c.name
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Artikel suchen…",
							value: query,
							onChange: (e) => setQuery(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
						className: "min-h-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 xl:grid-cols-4",
							children: visible.map((p) => {
								const price = effectivePrice(p, settings);
								const hh = p.happyHourPrice != null && price === p.happyHourPrice;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => tapProduct(p),
									className: "flex min-h-24 flex-col justify-between rounded-lg border border-border bg-surface-2 p-3 text-left transition-colors hover:border-accent/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium leading-snug",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-sm tabular-nums",
											children: formatEUR(price)
										}), hh ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "amber",
											children: "HH"
										}) : null]
									})]
								}, p.id);
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex w-full shrink-0 flex-col bg-surface lg:w-[380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "min-h-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [COURSE_ORDER.map((course) => {
							const items = check.items.filter((i) => i.course === course);
							if (items.length === 0) return null;
							const held = !!check.courseHold[course];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium tracking-wide text-muted uppercase",
											children: COURSE_LABEL[course]
										}),
										held ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "amber",
											children: "gehalten"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "ml-auto text-xs text-muted hover:text-fg",
											onClick: () => holdCourse(check.id, course, !held),
											children: held ? "Freigeben" : "Halten"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-1",
									children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("rounded-md border border-border bg-bg px-2 py-2", item.voided && "opacity-40", splitMode && splitSel.includes(item.id) && "border-accent"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2",
											children: [
												splitMode && !item.voided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													className: "mt-1",
													checked: splitSel.includes(item.id),
													onChange: (e) => setSplitSel((s) => e.target.checked ? [...s, item.id] : s.filter((x) => x !== item.id))
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: cn("text-sm font-medium", item.voided && "line-through"),
															children: item.name
														}),
														item.modifiers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-muted",
															children: item.modifiers.join(", ")
														}) : null,
														item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-amber",
															children: item.note
														}) : null,
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-[11px] text-subtle",
															children: [item.sent ? "gesendet" : "neu", item.seat ? ` · Platz ${item.seat}` : ""]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-mono text-sm tabular-nums",
													children: formatEUR(itemTotal(item))
												})
											]
										}), !item.voided && !splitMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "size-8",
													disabled: item.sent,
													onClick: () => setItemQty(check.id, item.id, item.qty - 1),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-6 text-center font-mono text-sm tabular-nums",
													children: item.qty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "size-8",
													disabled: item.sent,
													onClick: () => setItemQty(check.id, item.id, item.qty + 1),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "size-8",
													onClick: () => {
														setNoteItem(item.id);
														setNote(item.note);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "size-8",
													onClick: () => voidItem(check.id, item.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
												})
											]
										}) : null]
									}, item.id))
								})]
							}, course);
						}), check.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-10 text-center text-sm text-muted",
							children: "Artikel antippen, um zu bestellen."
						}) : null]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Zwischensumme",
							value: formatEUR(checkSubtotal(check))
						}),
						check.discountCents > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: check.discountLabel || "Rabatt",
							value: `− ${formatEUR(check.discountCents)}`
						}) : null,
						vat.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: `MwSt ${v.rate} %`,
							value: formatEUR(v.tax),
							muted: true
						}, v.rate)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Gesamt",
							value: formatEUR(checkTotal(check)),
							strong: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: sendOpen,
									disabled: unsent.length === 0,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "size-4" }), "Senden"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setDiscOpen(true),
									children: "Rabatt"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: splitMode ? "sage" : "outline",
									onClick: () => {
										setSplitMode((v) => !v);
										setSplitSel([]);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Split, { className: "size-4" }), "Splitten"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => {
										const r = printZwischen(check.id);
										if (r) setReceipt(r);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "size-4" }), "Zwischenbon"]
								}),
								splitMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "col-span-2",
									onClick: doSplit,
									disabled: splitSel.length === 0,
									children: "Ausgewählte Positionen abtrennen"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "amber",
									onClick: () => requestBill(check.id),
									children: "Rechnung bitte"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => setPayOpen(true),
									disabled: checkSubtotal(check) <= 0,
									children: "Bezahlen"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									className: "col-span-2 text-danger",
									onClick: () => setVoidOpen(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" }), "Vorgang stornieren"]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!modProduct,
				onOpenChange: (o) => !o && setModProduct(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: modProduct?.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Optionen wählen" })] }),
					modProduct?.modifiers.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-2 text-sm font-medium",
							children: [g.name, g.required ? " *" : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: g.options.map((o) => {
								const on = (modSel[g.id] ?? []).includes(o.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: on ? "default" : "outline",
									onClick: () => setModSel((s) => {
										const cur = s[g.id] ?? [];
										if (g.multi) return {
											...s,
											[g.id]: on ? cur.filter((x) => x !== o.id) : [...cur, o.id]
										};
										return {
											...s,
											[g.id]: on ? [] : [o.id]
										};
									}),
									children: [o.name, o.priceDelta ? ` ${formatEUR(o.priceDelta)}` : ""]
								}, o.id);
							})
						})]
					}, g.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setModProduct(null),
						children: "Abbrechen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: confirmModifiers,
						children: "Hinzufügen"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!noteItem,
				onOpenChange: (o) => !o && setNoteItem(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Notiz / Platz" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "note",
						children: "Küchennotiz"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "note",
						value: note,
						onChange: (e) => setNote(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (noteItem) setItemNote(check.id, noteItem, note);
							setNoteItem(null);
						},
						children: "Speichern"
					}) })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: discOpen,
				onOpenChange: setDiscOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Rabatt" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: [
							"5",
							"10",
							"15",
							"20"
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: discPct === p ? "default" : "outline",
							onClick: () => setDiscPct(p),
							children: [p, " %"]
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							setDiscount(check.id, 0, "");
							setDiscOpen(false);
						},
						children: "Entfernen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							const pct = Number(discPct) || 0;
							const cents = Math.round(checkSubtotal(check) * pct / 100);
							setDiscount(check.id, cents, `Rabatt ${pct} %`);
							setDiscOpen(false);
						},
						children: "Anwenden"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: voidOpen,
				onOpenChange: setVoidOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Vorgang stornieren" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "TSE-Storno wird erzeugt. Grund angeben." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: voidReason,
						onChange: (e) => setVoidReason(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setVoidOpen(false),
						children: "Abbrechen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => {
							const r = voidCheck(check.id, voidReason);
							setVoidOpen(false);
							if (r) setReceipt(r);
							else navigate({ to: "/" });
						},
						children: "Stornieren"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentFlow, {
				open: payOpen,
				onOpenChange: setPayOpen,
				check,
				onPaid: (r) => {
					setPayOpen(false);
					setReceipt(r);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptModal, {
				receipt,
				onClose: () => setReceipt(null)
			})
		]
	});
}
function Row({ label, value, muted, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex justify-between text-sm", muted && "text-muted", strong && "mt-1 text-base font-semibold"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { OrderWorkspace as t };
