import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as nid, n as Button, t as AppShell, u as formatEUR, x as usePosStore } from "./shell-wQX5E6Oo.mjs";
import { n as Label, t as Input } from "./label-Blqtvcso.mjs";
import { a as STATION_LABEL, t as COURSE_LABEL } from "./types-RsjRE-3x.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DoZyjimh.mjs";
import { t as Switch } from "./switch-B2F3YA9h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/artikel-CqnwBsaW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = () => ({
	id: nid("p"),
	name: "",
	categoryId: "",
	price: 0,
	taxClass: "food",
	station: "kueche",
	course: "hauptgang",
	modifiers: [],
	stock: 20,
	sku: "",
	happyHourPrice: null,
	active: true
});
function ArticlesView() {
	const products = usePosStore((s) => s.products);
	const categories = usePosStore((s) => s.categories);
	const upsertProduct = usePosStore((s) => s.upsertProduct);
	const removeProduct = usePosStore((s) => s.removeProduct);
	const upsertCategory = usePosStore((s) => s.upsertCategory);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [newCat, setNewCat] = (0, import_react.useState)("");
	const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mr-auto text-xl font-semibold",
						children: "Artikel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "max-w-xs",
						placeholder: "Suchen…",
						value: q,
						onChange: (e) => setQ(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setEdit({
							...empty(),
							categoryId: categories[0]?.id ?? ""
						}),
						children: "Neuer Artikel"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "max-w-xs",
					placeholder: "Neue Warengruppe",
					value: newCat,
					onChange: (e) => setNewCat(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						if (!newCat.trim()) return;
						upsertCategory({
							id: nid("c"),
							name: newCat.trim(),
							sort: categories.length + 1
						});
						setNewCat("");
					},
					children: "Gruppe anlegen"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-xs text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Artikel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Gruppe"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Preis"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Steuer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Station"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Aktiv"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: p.sku
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-muted",
								children: categories.find((c) => c.id === p.categoryId)?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono tabular-nums",
								children: formatEUR(p.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: p.taxClass === "food" ? "Speise" : "Getränk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: STATION_LABEL[p.station]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: p.active ? "Ja" : "Nein"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setEdit({ ...p }),
									children: "Bearbeiten"
								})
							})
						]
					}, p.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!edit,
				onOpenChange: (o) => !o && setEdit(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "w-[min(96vw,520px)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Artikel" }) }),
						edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: edit.name,
										onChange: (e) => setEdit({
											...edit,
											name: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "SKU",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: edit.sku,
										onChange: (e) => setEdit({
											...edit,
											sku: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Warengruppe",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm",
										value: edit.categoryId,
										onChange: (e) => setEdit({
											...edit,
											categoryId: e.target.value
										}),
										children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c.name
										}, c.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Preis (€)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: (edit.price / 100).toFixed(2).replace(".", ","),
											onChange: (e) => setEdit({
												...edit,
												price: Math.round(Number(e.target.value.replace(",", ".")) * 100) || 0
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Happy Hour (€, leer = aus)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: edit.happyHourPrice == null ? "" : (edit.happyHourPrice / 100).toFixed(2).replace(".", ","),
											onChange: (e) => {
												const raw = e.target.value.trim();
												setEdit({
													...edit,
													happyHourPrice: raw ? Math.round(Number(raw.replace(",", ".")) * 100) : null
												});
											}
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Steuerklasse",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm",
											value: edit.taxClass,
											onChange: (e) => setEdit({
												...edit,
												taxClass: e.target.value
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "food",
												children: "Speise (19 % / 7 % Mitnahme)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "drink",
												children: "Getränk (19 %)"
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Gang",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm",
											value: edit.course,
											onChange: (e) => setEdit({
												...edit,
												course: e.target.value
											}),
											children: Object.entries(COURSE_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: k,
												children: v
											}, k))
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Station",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm",
										value: edit.station,
										onChange: (e) => setEdit({
											...edit,
											station: e.target.value
										}),
										children: Object.entries(STATION_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: k,
											children: v
										}, k))
									})
								}),
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [edit && products.some((p) => p.id === edit.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								removeProduct(edit.id);
								setEdit(null);
							},
							children: "Löschen"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (edit && edit.name.trim()) {
									upsertProduct(edit);
									setEdit(null);
								}
							},
							children: "Speichern"
						})] })
					]
				})
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticlesView, {}) });
}
//#endregion
export { Page as component };
