import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as Eye, a as Unplug, g as Nfc, n as Wifi, w as EyeOff, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { D as usePosStore, a as DEFAULT_SUMUP, f as cn, k as withSumupSettings, n as Button, t as AppShell } from "./shell-2UgE9VPX.mjs";
import { n as Label, t as Input } from "./label-CHCDVkLx.mjs";
import { t as Switch } from "./switch-BlacCM_6.mjs";
import { c as sumupPairReader, i as maskApiKey, l as sumupReaderStatus, o as sumupDeleteReader, r as isSumupLiveReady, s as sumupListReaders } from "./sumup-C1AvonDU.mjs";
import { t as Badge } from "./badge-tPbUEGoO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/einstellungen-CbJtgRUE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
				children: "Betrieb, SumUp-Terminal, TSE-Demo und Happy Hour."
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumupSettingsCard, {}),
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
function SumupSettingsCard() {
	const raw = usePosStore((s) => s.settings);
	const updateSettings = usePosStore((s) => s.updateSettings);
	const sumup = withSumupSettings(raw).sumup;
	const liveOn = sumup.mode === "live";
	const ready = isSumupLiveReady(sumup);
	const [showKey, setShowKey] = (0, import_react.useState)(false);
	const [pairingCode, setPairingCode] = (0, import_react.useState)("");
	const [readerName, setReaderName] = (0, import_react.useState)(sumup.readerName || "Theke");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [readers, setReaders] = (0, import_react.useState)([]);
	const [status, setStatus] = (0, import_react.useState)(null);
	function patch(next) {
		updateSettings({ sumup: next });
	}
	const creds = {
		apiKey: sumup.apiKey,
		merchantCode: sumup.merchantCode
	};
	async function pair() {
		if (!sumup.apiKey.trim() || !sumup.merchantCode.trim()) {
			toast.error("Bitte zuerst Händlercode und API-Schlüssel eintragen");
			return;
		}
		setBusy("pair");
		try {
			const res = await sumupPairReader({ data: {
				...creds,
				pairingCode,
				name: readerName
			} });
			if (!res.ok || !res.data) {
				toast.error(res.error ?? "Koppeln fehlgeschlagen");
				return;
			}
			patch({
				readerId: res.data.id,
				readerName: res.data.name,
				readerModel: res.data.model,
				mode: "live"
			});
			setReaders((list) => {
				const rest = list.filter((r) => r.id !== res.data.id);
				return [res.data, ...rest];
			});
			toast.success(`${res.data.name} gekoppelt`);
			setPairingCode("");
		} finally {
			setBusy(null);
		}
	}
	async function refreshList() {
		if (!sumup.apiKey.trim() || !sumup.merchantCode.trim()) {
			toast.error("Bitte Händlercode und API-Schlüssel eintragen");
			return;
		}
		setBusy("list");
		try {
			const res = await sumupListReaders({ data: creds });
			if (!res.ok || !res.data) {
				toast.error(res.error ?? "Terminals konnten nicht geladen werden");
				return;
			}
			setReaders(res.data);
			if (res.data.length === 0) toast.message("Keine gekoppelten Terminals");
		} finally {
			setBusy(null);
		}
	}
	async function pingStatus() {
		if (!ready) {
			toast.error("Bitte zuerst ein Terminal koppeln");
			return;
		}
		setBusy("status");
		try {
			const res = await sumupReaderStatus({ data: {
				...creds,
				readerId: sumup.readerId
			} });
			if (!res.ok || !res.data) {
				toast.error(res.error ?? "Status nicht erreichbar");
				setStatus(null);
				return;
			}
			setStatus(res.data);
			toast.success(res.data.online ? "Terminal online" : "Terminal offline");
		} finally {
			setBusy(null);
		}
	}
	async function unpair() {
		if (!sumup.readerId || sumup.readerId.includes("demo")) return;
		setBusy("delete");
		try {
			const res = await sumupDeleteReader({ data: {
				...creds,
				readerId: sumup.readerId
			} });
			if (!res.ok) {
				toast.error(res.error ?? "Trennen fehlgeschlagen");
				return;
			}
			patch({
				readerId: DEFAULT_SUMUP.readerId,
				readerName: DEFAULT_SUMUP.readerName,
				readerModel: DEFAULT_SUMUP.readerModel
			});
			setStatus(null);
			setReaders((list) => list.filter((r) => r.id !== sumup.readerId));
			toast.success("Terminal getrennt");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 text-base font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nfc, { className: "size-4 text-sage" }), "SumUp Kartenterminal"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Solo oder Go per Cloud API ansteuern — Betrag geht direkt aufs Gerät, Gast zahlt kontaktlos oder mit Chip."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: liveOn ? "Live" : "Demo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: liveOn,
					onCheckedChange: (on) => patch({ mode: on ? "live" : "demo" }),
					"aria-label": "SumUp Live-Modus"
				})]
			})]
		}), !liveOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-lg border border-border bg-bg p-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Demo-Terminal ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: sumup.readerName
				}),
				" ist aktiv. Kartenzahlung simuliert Kontaktlos / Chip, ohne echtes Gerät."
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-subtle",
				children: "Für den Betrieb: SumUp-Konto → API-Schlüssel, Solo einschalten, Pairing-Code hier eingeben."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Händlercode",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						autoComplete: "off",
						spellCheck: false,
						placeholder: "z. B. MXXXXXXX",
						value: sumup.merchantCode,
						onChange: (e) => patch({ merchantCode: e.target.value.trim() })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "API-Schlüssel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: showKey ? "text" : "password",
							autoComplete: "off",
							spellCheck: false,
							placeholder: "sup_sk_…",
							value: sumup.apiKey,
							onChange: (e) => patch({ apiKey: e.target.value.trim() })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							"aria-label": showKey ? "Schlüssel verbergen" : "Schlüssel anzeigen",
							onClick: () => setShowKey((v) => !v),
							children: showKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
						})]
					}), sumup.apiKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-xs text-subtle",
						children: maskApiKey(sumup.apiKey)
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-bg p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Gerät koppeln"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-2 list-decimal space-y-1 pl-4 text-xs text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Solo/Go einschalten und mit WLAN oder Mobilfunk verbinden." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Am Gerät Pairing starten, bis der 8-stellige Code erscheint." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Code und Namen hier eintragen, dann koppeln." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "font-mono uppercase",
									placeholder: "Pairing-Code",
									value: pairingCode,
									onChange: (e) => setPairingCode(e.target.value.toUpperCase()),
									maxLength: 9
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Name, z. B. Theke",
									value: readerName,
									onChange: (e) => setReaderName(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => void pair(),
									disabled: busy !== null || pairingCode.length < 8,
									children: [busy === "pair" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Koppeln"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void refreshList(),
							disabled: busy !== null,
							children: [busy === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Terminals laden"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void pingStatus(),
							disabled: busy !== null || !ready,
							children: [busy === "status" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-4" }), "Status"]
						}),
						ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => void unpair(),
							disabled: busy !== null,
							children: [busy === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unplug, { className: "size-4" }), "Trennen"]
						}) : null
					]
				}),
				status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: status.online ? "sage" : "danger",
							children: status.online ? "Online" : "Offline"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: status.state.replaceAll("_", " ")
						}),
						typeof status.battery === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [status.battery, " % Akku"]
						}) : null,
						status.connection ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: status.connection
						}) : null
					]
				}) : null,
				readers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: readers.map((r) => {
						const active = r.id === sumup.readerId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm", active ? "border-sage bg-sage/10" : "border-border hover:bg-surface-2"),
							onClick: () => patch({
								readerId: r.id,
								readerName: r.name,
								readerModel: r.model
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" · ", r.model]
							})] }), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "sage",
								children: "aktiv"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: r.status
							})]
						}) }, r.id);
					})
				}) : ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Aktiv: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: sumup.readerName
						}),
						" (",
						sumup.readerModel,
						")"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-amber",
					children: "Noch kein Live-Terminal gekoppelt."
				})
			]
		})]
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
