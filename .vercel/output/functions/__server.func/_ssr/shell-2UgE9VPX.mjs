import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as CalendarClock, O as ClipboardCheck, S as LayoutGrid, T as Delete, b as Lock, d as Settings, h as Package, i as Users, j as ChartColumn, k as ChefHat, r as UtensilsCrossed, u as ShoppingBag, y as Menu } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-2UgE9VPX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var COURSE_LABEL = {
	sofort: "Sofort",
	vorspeise: "Vorspeise",
	hauptgang: "Hauptgang",
	dessert: "Dessert",
	getraenk: "Getränk"
};
var STATION_LABEL = {
	kueche: "Küche",
	bar: "Bar",
	theke: "Theke"
};
var ROLE_LABEL = {
	inhaber: "Inhaber",
	service: "Service",
	bar: "Bar",
	kueche: "Küche"
};
var METHOD_LABEL = {
	bar: "Bar",
	karte: "Karte"
};
var COURSE_ORDER = [
	"vorspeise",
	"hauptgang",
	"dessert",
	"getraenk",
	"sofort"
];
var DEFAULT_SUMUP = {
	mode: "demo",
	merchantCode: "",
	apiKey: "",
	readerId: "rdr_demo_vesper_theke",
	readerName: "Theke Solo",
	readerModel: "solo"
};
function withSumupSettings(settings) {
	return {
		...settings,
		sumup: {
			...DEFAULT_SUMUP,
			...settings.sumup
		}
	};
}
function nid(prefix = "id") {
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
var ROOMS = [
	{
		id: "room_stube",
		name: "Gaststube"
	},
	{
		id: "room_terrasse",
		name: "Terrasse"
	},
	{
		id: "room_theke",
		name: "Theke"
	}
];
var TABLES = [
	{
		id: "t1",
		number: "1",
		roomId: "room_stube",
		seats: 2,
		x: 4,
		y: 8,
		w: 14,
		h: 22,
		shape: "rect"
	},
	{
		id: "t2",
		number: "2",
		roomId: "room_stube",
		seats: 2,
		x: 22,
		y: 8,
		w: 14,
		h: 22,
		shape: "rect"
	},
	{
		id: "t3",
		number: "3",
		roomId: "room_stube",
		seats: 4,
		x: 40,
		y: 8,
		w: 18,
		h: 22,
		shape: "rect"
	},
	{
		id: "t4",
		number: "4",
		roomId: "room_stube",
		seats: 4,
		x: 62,
		y: 8,
		w: 18,
		h: 22,
		shape: "rect"
	},
	{
		id: "t5",
		number: "5",
		roomId: "room_stube",
		seats: 2,
		x: 84,
		y: 8,
		w: 12,
		h: 22,
		shape: "round"
	},
	{
		id: "t6",
		number: "6",
		roomId: "room_stube",
		seats: 4,
		x: 4,
		y: 38,
		w: 18,
		h: 24,
		shape: "rect"
	},
	{
		id: "t7",
		number: "7",
		roomId: "room_stube",
		seats: 6,
		x: 28,
		y: 38,
		w: 24,
		h: 24,
		shape: "rect"
	},
	{
		id: "t8",
		number: "8",
		roomId: "room_stube",
		seats: 4,
		x: 58,
		y: 38,
		w: 18,
		h: 24,
		shape: "rect"
	},
	{
		id: "t9",
		number: "9",
		roomId: "room_stube",
		seats: 2,
		x: 82,
		y: 38,
		w: 14,
		h: 24,
		shape: "round"
	},
	{
		id: "t10",
		number: "10",
		roomId: "room_stube",
		seats: 8,
		x: 18,
		y: 70,
		w: 28,
		h: 24,
		shape: "rect"
	},
	{
		id: "t11",
		number: "11",
		roomId: "room_stube",
		seats: 4,
		x: 52,
		y: 70,
		w: 20,
		h: 24,
		shape: "rect"
	},
	{
		id: "t12",
		number: "12",
		roomId: "room_stube",
		seats: 2,
		x: 78,
		y: 70,
		w: 16,
		h: 24,
		shape: "round"
	},
	{
		id: "tr1",
		number: "T1",
		roomId: "room_terrasse",
		seats: 2,
		x: 8,
		y: 14,
		w: 24,
		h: 32,
		shape: "round"
	},
	{
		id: "tr2",
		number: "T2",
		roomId: "room_terrasse",
		seats: 4,
		x: 38,
		y: 14,
		w: 24,
		h: 32,
		shape: "rect"
	},
	{
		id: "tr3",
		number: "T3",
		roomId: "room_terrasse",
		seats: 2,
		x: 68,
		y: 14,
		w: 24,
		h: 32,
		shape: "round"
	},
	{
		id: "tr4",
		number: "T4",
		roomId: "room_terrasse",
		seats: 4,
		x: 8,
		y: 54,
		w: 24,
		h: 32,
		shape: "rect"
	},
	{
		id: "tr5",
		number: "T5",
		roomId: "room_terrasse",
		seats: 4,
		x: 38,
		y: 54,
		w: 24,
		h: 32,
		shape: "rect"
	},
	{
		id: "tr6",
		number: "T6",
		roomId: "room_terrasse",
		seats: 6,
		x: 68,
		y: 54,
		w: 24,
		h: 32,
		shape: "rect"
	},
	{
		id: "b1",
		number: "B1",
		roomId: "room_theke",
		seats: 1,
		x: 6,
		y: 30,
		w: 14,
		h: 40,
		shape: "round"
	},
	{
		id: "b2",
		number: "B2",
		roomId: "room_theke",
		seats: 1,
		x: 26,
		y: 30,
		w: 14,
		h: 40,
		shape: "round"
	},
	{
		id: "b3",
		number: "B3",
		roomId: "room_theke",
		seats: 1,
		x: 46,
		y: 30,
		w: 14,
		h: 40,
		shape: "round"
	},
	{
		id: "b4",
		number: "B4",
		roomId: "room_theke",
		seats: 1,
		x: 66,
		y: 30,
		w: 14,
		h: 40,
		shape: "round"
	},
	{
		id: "b5",
		number: "B5",
		roomId: "room_theke",
		seats: 1,
		x: 86,
		y: 30,
		w: 10,
		h: 40,
		shape: "round"
	}
];
var STAFF = [
	{
		id: "s_anna",
		name: "Anna Berger",
		pin: "1111",
		role: "service",
		active: true
	},
	{
		id: "s_markus",
		name: "Markus Holt",
		pin: "2222",
		role: "service",
		active: true
	},
	{
		id: "s_lena",
		name: "Lena Krug",
		pin: "3333",
		role: "bar",
		active: true
	},
	{
		id: "s_chef",
		name: "Inhaber",
		pin: "0000",
		role: "inhaber",
		active: true
	}
];
var CATEGORIES = [
	{
		id: "c_vor",
		name: "Vorspeisen",
		sort: 1
	},
	{
		id: "c_haupt",
		name: "Hauptgerichte",
		sort: 2
	},
	{
		id: "c_bei",
		name: "Beilagen",
		sort: 3
	},
	{
		id: "c_nacht",
		name: "Nachspeisen",
		sort: 4
	},
	{
		id: "c_bier",
		name: "Bier",
		sort: 5
	},
	{
		id: "c_wein",
		name: "Wein & Aperitif",
		sort: 6
	},
	{
		id: "c_soft",
		name: "Alkoholfrei",
		sort: 7
	},
	{
		id: "c_heiss",
		name: "Heißgetränke",
		sort: 8
	}
];
var PRODUCTS = [
	{
		id: "p_flamm",
		name: "Flammkuchen Elsässer",
		categoryId: "c_vor",
		price: 1290,
		taxClass: "food",
		station: "kueche",
		course: "vorspeise",
		modifiers: [],
		stock: 40,
		sku: "V-01",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_carp",
		name: "Carpaccio vom Rind",
		categoryId: "c_vor",
		price: 1650,
		taxClass: "food",
		station: "kueche",
		course: "vorspeise",
		modifiers: [],
		stock: 18,
		sku: "V-02",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_suppe",
		name: "Suppe des Tages",
		categoryId: "c_vor",
		price: 690,
		taxClass: "food",
		station: "kueche",
		course: "vorspeise",
		modifiers: [],
		stock: 30,
		sku: "V-03",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_brezel",
		name: "Brezel mit Obazda",
		categoryId: "c_vor",
		price: 550,
		taxClass: "food",
		station: "kueche",
		course: "vorspeise",
		modifiers: [],
		stock: 25,
		sku: "V-04",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_garnele",
		name: "Garnelen in Knoblauch",
		categoryId: "c_vor",
		price: 1490,
		taxClass: "food",
		station: "kueche",
		course: "vorspeise",
		modifiers: [],
		stock: 16,
		sku: "V-05",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_schnitzel",
		name: "Wiener Schnitzel",
		categoryId: "c_haupt",
		price: 2290,
		taxClass: "food",
		station: "kueche",
		course: "hauptgang",
		modifiers: [],
		stock: 28,
		sku: "H-01",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_braten",
		name: "Schweinebraten",
		categoryId: "c_haupt",
		price: 1890,
		taxClass: "food",
		station: "kueche",
		course: "hauptgang",
		modifiers: [],
		stock: 22,
		sku: "H-02",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_zander",
		name: "Zanderfilet",
		categoryId: "c_haupt",
		price: 2450,
		taxClass: "food",
		station: "kueche",
		course: "hauptgang",
		modifiers: [],
		stock: 14,
		sku: "H-03",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_spaetzle",
		name: "Käsespätzle",
		categoryId: "c_haupt",
		price: 1690,
		taxClass: "food",
		station: "kueche",
		course: "hauptgang",
		modifiers: [],
		stock: 20,
		sku: "H-04",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_steak",
		name: "Rindersteak 250g",
		categoryId: "c_haupt",
		price: 2990,
		taxClass: "food",
		station: "kueche",
		course: "hauptgang",
		modifiers: [{
			id: "m_gar",
			name: "Garstufe",
			required: true,
			multi: false,
			options: [
				{
					id: "g_blau",
					name: "Blau",
					priceDelta: 0
				},
				{
					id: "g_mr",
					name: "Medium Rare",
					priceDelta: 0
				},
				{
					id: "g_med",
					name: "Medium",
					priceDelta: 0
				},
				{
					id: "g_mw",
					name: "Medium Well",
					priceDelta: 0
				},
				{
					id: "g_durch",
					name: "Durch",
					priceDelta: 0
				}
			]
		}],
		stock: 12,
		sku: "H-05",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_curry",
		name: "Gemüsecurry",
		categoryId: "c_haupt",
		price: 1590,
		taxClass: "food",
		station: "kueche",
		course: "hauptgang",
		modifiers: [],
		stock: 18,
		sku: "H-06",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_burger",
		name: "Burger Lindenhof",
		categoryId: "c_haupt",
		price: 1850,
		taxClass: "food",
		station: "kueche",
		course: "hauptgang",
		modifiers: [{
			id: "m_burger",
			name: "Extras",
			required: false,
			multi: true,
			options: [
				{
					id: "e_kaese",
					name: "Extra Käse",
					priceDelta: 150
				},
				{
					id: "e_speck",
					name: "Speck",
					priceDelta: 200
				},
				{
					id: "e_ei",
					name: "Spiegelei",
					priceDelta: 150
				},
				{
					id: "e_nozw",
					name: "Ohne Zwiebel",
					priceDelta: 0
				}
			]
		}],
		stock: 24,
		sku: "H-07",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_pommes",
		name: "Pommes",
		categoryId: "c_bei",
		price: 450,
		taxClass: "food",
		station: "kueche",
		course: "sofort",
		modifiers: [],
		stock: 60,
		sku: "B-01",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_ksalat",
		name: "Kartoffelsalat",
		categoryId: "c_bei",
		price: 420,
		taxClass: "food",
		station: "kueche",
		course: "sofort",
		modifiers: [],
		stock: 30,
		sku: "B-02",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_salat",
		name: "Beilagensalat",
		categoryId: "c_bei",
		price: 490,
		taxClass: "food",
		station: "kueche",
		course: "sofort",
		modifiers: [],
		stock: 30,
		sku: "B-03",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_beisp",
		name: "Spätzle",
		categoryId: "c_bei",
		price: 450,
		taxClass: "food",
		station: "kueche",
		course: "sofort",
		modifiers: [],
		stock: 30,
		sku: "B-04",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_gemuese",
		name: "Saison-Gemüse",
		categoryId: "c_bei",
		price: 490,
		taxClass: "food",
		station: "kueche",
		course: "sofort",
		modifiers: [],
		stock: 24,
		sku: "B-05",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_strudel",
		name: "Apfelstrudel",
		categoryId: "c_nacht",
		price: 790,
		taxClass: "food",
		station: "kueche",
		course: "dessert",
		modifiers: [],
		stock: 16,
		sku: "N-01",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_mousse",
		name: "Schokoladenmousse",
		categoryId: "c_nacht",
		price: 850,
		taxClass: "food",
		station: "kueche",
		course: "dessert",
		modifiers: [],
		stock: 14,
		sku: "N-02",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_kaiser",
		name: "Kaiserschmarrn",
		categoryId: "c_nacht",
		price: 990,
		taxClass: "food",
		station: "kueche",
		course: "dessert",
		modifiers: [],
		stock: 12,
		sku: "N-03",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_aug05",
		name: "Augustiner Hell 0,5",
		categoryId: "c_bier",
		price: 480,
		taxClass: "drink",
		station: "bar",
		course: "getraenk",
		modifiers: [],
		stock: 80,
		sku: "G-01",
		happyHourPrice: 380,
		active: true
	},
	{
		id: "p_aug03",
		name: "Augustiner Hell 0,3",
		categoryId: "c_bier",
		price: 360,
		taxClass: "drink",
		station: "bar",
		course: "getraenk",
		modifiers: [],
		stock: 80,
		sku: "G-02",
		happyHourPrice: 280,
		active: true
	},
	{
		id: "p_weiss",
		name: "Weißbier 0,5",
		categoryId: "c_bier",
		price: 490,
		taxClass: "drink",
		station: "bar",
		course: "getraenk",
		modifiers: [],
		stock: 50,
		sku: "G-03",
		happyHourPrice: 390,
		active: true
	},
	{
		id: "p_radler",
		name: "Radler 0,5",
		categoryId: "c_bier",
		price: 450,
		taxClass: "drink",
		station: "bar",
		course: "getraenk",
		modifiers: [],
		stock: 40,
		sku: "G-04",
		happyHourPrice: 350,
		active: true
	},
	{
		id: "p_rot",
		name: "Rotwein Glas",
		categoryId: "c_wein",
		price: 590,
		taxClass: "drink",
		station: "bar",
		course: "getraenk",
		modifiers: [],
		stock: 40,
		sku: "W-01",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_ww",
		name: "Weißwein Glas",
		categoryId: "c_wein",
		price: 550,
		taxClass: "drink",
		station: "bar",
		course: "getraenk",
		modifiers: [],
		stock: 40,
		sku: "W-02",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_spritz",
		name: "Aperol Spritz",
		categoryId: "c_wein",
		price: 790,
		taxClass: "drink",
		station: "bar",
		course: "getraenk",
		modifiers: [],
		stock: 30,
		sku: "W-03",
		happyHourPrice: 650,
		active: true
	},
	{
		id: "p_cola",
		name: "Cola 0,4",
		categoryId: "c_soft",
		price: 390,
		taxClass: "drink",
		station: "theke",
		course: "getraenk",
		modifiers: [],
		stock: 60,
		sku: "S-01",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_spezi",
		name: "Spezi 0,4",
		categoryId: "c_soft",
		price: 390,
		taxClass: "drink",
		station: "theke",
		course: "getraenk",
		modifiers: [],
		stock: 50,
		sku: "S-02",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_wasser",
		name: "Mineralwasser 0,75",
		categoryId: "c_soft",
		price: 550,
		taxClass: "drink",
		station: "theke",
		course: "getraenk",
		modifiers: [],
		stock: 40,
		sku: "S-03",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_kaffee",
		name: "Kaffee",
		categoryId: "c_heiss",
		price: 320,
		taxClass: "drink",
		station: "theke",
		course: "getraenk",
		modifiers: [],
		stock: 99,
		sku: "C-01",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_capp",
		name: "Cappuccino",
		categoryId: "c_heiss",
		price: 380,
		taxClass: "drink",
		station: "theke",
		course: "getraenk",
		modifiers: [],
		stock: 99,
		sku: "C-02",
		happyHourPrice: null,
		active: true
	},
	{
		id: "p_esp",
		name: "Espresso",
		categoryId: "c_heiss",
		price: 280,
		taxClass: "drink",
		station: "theke",
		course: "getraenk",
		modifiers: [],
		stock: 99,
		sku: "C-03",
		happyHourPrice: null,
		active: true
	}
];
var SETTINGS = {
	restaurantName: "Gasthaus Lindenhof",
	address: "Lindenstraße 12, 80331 München",
	taxId: "DE 183 229 441",
	tseSerial: "VESPER-TSE-DEMO-88421",
	receiptFooter: "Vielen Dank für Ihren Besuch. Tscheckö! — Speisen vor Ort 19 %, Mitnahme 7 %.",
	happyHourStart: "17:00",
	happyHourEnd: "19:00",
	nextBonNumber: 1847,
	tseCounter: 1846,
	sumup: {
		mode: "demo",
		merchantCode: "",
		apiKey: "",
		readerId: "rdr_demo_vesper_theke",
		readerName: "Theke Solo",
		readerModel: "solo"
	}
};
function item(product, qty, extras) {
	return {
		id: nid("it"),
		productId: product.id,
		name: product.name,
		unitPrice: extras.unitPrice ?? product.price,
		qty,
		taxRate: 19,
		course: product.course,
		station: product.station,
		modifiers: extras.modifiers ?? [],
		note: extras.note ?? "",
		sent: extras.sent ?? false,
		seat: extras.seat ?? null,
		voided: false
	};
}
function createLiveDemo() {
	const now = Date.now();
	const p = (id) => PRODUCTS.find((x) => x.id === id);
	const c3 = {
		id: "chk_t3",
		tableId: "t3",
		type: "tisch",
		guestCount: 2,
		staffId: "s_anna",
		items: [item(p("p_flamm"), 1, { sent: true }), item(p("p_aug05"), 2, { sent: true })],
		openedAt: now - 168e4,
		paidAt: null,
		status: "sent",
		notes: "",
		discountCents: 0,
		discountLabel: "",
		tipCents: 0,
		payments: [],
		courseHold: {}
	};
	const c7 = {
		id: "chk_t7",
		tableId: "t7",
		type: "tisch",
		guestCount: 4,
		staffId: "s_markus",
		items: [
			item(p("p_schnitzel"), 2, {
				sent: true,
				seat: 1
			}),
			item(p("p_braten"), 1, {
				sent: true,
				seat: 3
			}),
			item(p("p_spaetzle"), 1, {
				sent: false,
				seat: 4
			}),
			item(p("p_beisp"), 2, { sent: true }),
			item(p("p_ww"), 2, { sent: true }),
			item(p("p_rot"), 1, { sent: true }),
			item(p("p_wasser"), 1, { sent: true })
		],
		openedAt: now - 312e4,
		paidAt: null,
		status: "sent",
		notes: "Allergiker Platz 4 — keine Nüsse",
		discountCents: 0,
		discountLabel: "",
		tipCents: 0,
		payments: [],
		courseHold: { dessert: true }
	};
	const c10 = {
		id: "chk_t10",
		tableId: "t10",
		type: "tisch",
		guestCount: 6,
		staffId: "s_anna",
		items: [
			item(p("p_burger"), 2, {
				sent: true,
				modifiers: ["Speck", "Extra Käse"]
			}),
			item(p("p_steak"), 1, {
				sent: true,
				modifiers: ["Medium"]
			}),
			item(p("p_curry"), 1, { sent: true }),
			item(p("p_zander"), 2, { sent: true }),
			item(p("p_pommes"), 3, { sent: true }),
			item(p("p_spritz"), 2, { sent: true }),
			item(p("p_aug05"), 4, { sent: true })
		],
		openedAt: now - 444e4,
		paidAt: null,
		status: "billed",
		notes: "",
		discountCents: 0,
		discountLabel: "",
		tipCents: 0,
		payments: [],
		courseHold: {}
	};
	const cb1 = {
		id: "chk_b1",
		tableId: "b1",
		type: "tisch",
		guestCount: 1,
		staffId: "s_lena",
		items: [item(p("p_aug05"), 1, { sent: true })],
		openedAt: now - 72e4,
		paidAt: null,
		status: "sent",
		notes: "",
		discountCents: 0,
		discountLabel: "",
		tipCents: 0,
		payments: [],
		courseHold: {}
	};
	const tickets = [
		{
			id: "kt_7_h",
			checkId: c7.id,
			tableLabel: "Tisch 7",
			course: "hauptgang",
			station: "kueche",
			items: [
				{
					name: "Wiener Schnitzel",
					qty: 2,
					modifiers: [],
					note: ""
				},
				{
					name: "Schweinebraten",
					qty: 1,
					modifiers: [],
					note: ""
				},
				{
					name: "Spätzle",
					qty: 2,
					modifiers: [],
					note: ""
				}
			],
			status: "in_arbeit",
			createdAt: now - 108e4,
			staffName: "Markus Holt"
		},
		{
			id: "kt_3_v",
			checkId: c3.id,
			tableLabel: "Tisch 3",
			course: "vorspeise",
			station: "kueche",
			items: [{
				name: "Flammkuchen Elsässer",
				qty: 1,
				modifiers: [],
				note: ""
			}],
			status: "bereit",
			createdAt: now - 96e4,
			staffName: "Anna Berger"
		},
		{
			id: "kt_b_bar",
			checkId: cb1.id,
			tableLabel: "Tisch B1",
			course: "getraenk",
			station: "bar",
			items: [{
				name: "Augustiner Hell 0,5",
				qty: 1,
				modifiers: [],
				note: ""
			}],
			status: "serviert",
			createdAt: now - 72e4,
			staffName: "Lena Krug"
		}
	];
	const evening = /* @__PURE__ */ new Date();
	evening.setHours(19, 30, 0, 0);
	const later = /* @__PURE__ */ new Date();
	later.setHours(20, 15, 0, 0);
	const reservations = [
		{
			id: "res_1",
			name: "Familie Huber",
			phone: "089 1234567",
			covers: 4,
			at: evening.getTime(),
			tableId: "t8",
			notes: "Kinderstuhl",
			status: "erwartet"
		},
		{
			id: "res_2",
			name: "Dr. Steiner",
			phone: "0176 88990011",
			covers: 2,
			at: later.getTime(),
			tableId: "t5",
			notes: "Fensterplatz",
			status: "erwartet"
		},
		{
			id: "res_3",
			name: "Firma Leitner",
			phone: "089 998877",
			covers: 8,
			at: evening.getTime() + 27e5,
			tableId: "t10",
			notes: "Rechnung auf Firma",
			status: "erwartet"
		}
	];
	return {
		checks: [
			c3,
			c7,
			c10,
			cb1
		],
		tickets,
		reservations
	};
}
function createSeedState() {
	const live = createLiveDemo();
	return {
		rooms: ROOMS,
		tables: TABLES,
		categories: CATEGORIES,
		products: PRODUCTS,
		staff: STAFF,
		currentStaffId: null,
		checks: live.checks,
		tickets: live.tickets,
		receipts: [],
		reservations: live.reservations,
		dayCloses: [],
		settings: SETTINGS
	};
}
function formatEUR(cents) {
	return new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR"
	}).format(cents / 100);
}
function netFromGross(gross, rate) {
	return Math.round(gross / (1 + rate / 100));
}
function taxFromGross(gross, rate) {
	return gross - netFromGross(gross, rate);
}
function parseEuroInput(raw) {
	const cleaned = raw.replace(/\s/g, "").replace("€", "").replace(",", ".");
	const n = Number.parseFloat(cleaned);
	if (!Number.isFinite(n)) return 0;
	return Math.round(n * 100);
}
function isHappyHour(start, end, now = /* @__PURE__ */ new Date()) {
	const [sh, sm] = start.split(":").map(Number);
	const [eh, em] = end.split(":").map(Number);
	const minutes = now.getHours() * 60 + now.getMinutes();
	const from = (sh ?? 0) * 60 + (sm ?? 0);
	const to = (eh ?? 0) * 60 + (em ?? 0);
	if (from <= to) return minutes >= from && minutes < to;
	return minutes >= from || minutes < to;
}
function formatTime(ts) {
	return new Date(ts).toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatDateTime(ts) {
	return new Date(ts).toLocaleString("de-DE", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatDuration(openedAt, now = Date.now()) {
	const mins = Math.max(0, Math.floor((now - openedAt) / 6e4));
	if (mins < 60) return `${mins} min`;
	return `${Math.floor(mins / 60)} h ${mins % 60} min`;
}
function todayKey(ts = Date.now()) {
	const d = new Date(ts);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function hash(input) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16).padStart(8, "0");
}
function signTse(serial, txNumber, payload, processType = "Kassenbeleg-V1") {
	const timeStart = Date.now();
	const timeEnd = timeStart;
	const raw = `${serial}|${txNumber}|${processType}|${payload}|${timeStart}`;
	return {
		txNumber,
		signature: `${hash(raw)}${hash(raw + serial)}${hash(String(txNumber))}${hash(payload).slice(0, 8)}`.toUpperCase(),
		serial,
		timeStart,
		timeEnd,
		processType
	};
}
function effectivePrice(product, settings) {
	if (product.happyHourPrice != null && isHappyHour(settings.happyHourStart, settings.happyHourEnd)) return product.happyHourPrice;
	return product.price;
}
function effectiveTax(product, type) {
	if (product.taxClass === "food" && (type === "takeaway" || type === "lieferung")) return 7;
	return 19;
}
function itemTotal(item) {
	if (item.voided) return 0;
	return item.unitPrice * item.qty;
}
function checkSubtotal(check) {
	return check.items.reduce((s, i) => s + itemTotal(i), 0);
}
function checkTotal(check) {
	return Math.max(0, checkSubtotal(check) - check.discountCents) + check.tipCents;
}
function checkDue(check) {
	const paid = check.payments.reduce((s, p) => s + p.amountCents, 0);
	return Math.max(0, checkTotal(check) - paid);
}
function vatBreakdown(check) {
	const map = /* @__PURE__ */ new Map();
	const sub = checkSubtotal(check);
	const disc = check.discountCents;
	for (const item of check.items) {
		if (item.voided) continue;
		const gross = itemTotal(item);
		map.set(item.taxRate, (map.get(item.taxRate) ?? 0) + gross);
	}
	return [7, 19].filter((r) => (map.get(r) ?? 0) > 0).map((rate) => {
		let gross = map.get(rate) ?? 0;
		if (disc > 0 && sub > 0) gross = Math.round(gross - disc * gross / sub);
		const net = netFromGross(gross, rate);
		return {
			rate,
			gross,
			net,
			tax: taxFromGross(gross, rate)
		};
	});
}
function tableLabel(tables, tableId, type) {
	if (!tableId) {
		if (type === "lieferung") return "Lieferung";
		if (type === "takeaway") return "Mitnahme";
		return "Theke";
	}
	const t = tables.find((x) => x.id === tableId);
	return t ? `Tisch ${t.number}` : "Tisch";
}
function tableStatus(tableId, checks, reservations) {
	const open = checks.find((c) => c.tableId === tableId && c.status !== "paid" && c.status !== "voided");
	if (open?.status === "billed") return "billed";
	if (open) return "occupied";
	const soon = Date.now() + 72e5;
	if (reservations.find((r) => r.tableId === tableId && r.status === "erwartet" && r.at <= soon && r.at >= Date.now() - 9e5)) return "reserved";
	return "free";
}
function snapshotCheck(check, data) {
	const staff = data.staff.find((s) => s.id === check.staffId);
	return {
		restaurantName: data.settings.restaurantName,
		address: data.settings.address,
		taxId: data.settings.taxId,
		tableLabel: tableLabel(data.tables, check.tableId, check.type),
		staffName: staff?.name ?? "Service",
		guestCount: check.guestCount,
		lines: check.items.map((i) => ({
			name: i.modifiers.length ? `${i.name} (${i.modifiers.join(", ")})` : i.name,
			qty: i.qty,
			unitPrice: i.unitPrice,
			taxRate: i.taxRate,
			voided: i.voided
		})),
		discountCents: check.discountCents,
		discountLabel: check.discountLabel,
		tipCents: check.tipCents,
		payments: check.payments.map((p) => ({
			method: p.method,
			amountCents: p.amountCents,
			cardBrand: p.cardBrand,
			cardLast4: p.cardLast4,
			readerName: p.readerName
		})),
		type: check.type
	};
}
function lastCloseAt(dayCloses) {
	if (dayCloses.length === 0) {
		const d = /* @__PURE__ */ new Date();
		d.setHours(0, 0, 0, 0);
		return d.getTime();
	}
	return Math.max(...dayCloses.map((c) => c.at));
}
var seed = createSeedState();
var usePosStore = create()(persist((set, get) => ({
	...seed,
	hydrated: false,
	setHydrated: () => set({ hydrated: true }),
	unlock: (pin) => {
		const staff = get().staff.find((s) => s.active && s.pin === pin);
		if (!staff) return null;
		set({ currentStaffId: staff.id });
		return staff;
	},
	lock: () => set({ currentStaffId: null }),
	openTable: (tableId, guestCount) => {
		const existing = get().getOpenCheckForTable(tableId);
		if (existing) return existing.id;
		const staffId = get().currentStaffId ?? get().staff[0].id;
		const check = {
			id: nid("chk"),
			tableId,
			type: "tisch",
			guestCount,
			staffId,
			items: [],
			openedAt: Date.now(),
			paidAt: null,
			status: "open",
			notes: "",
			discountCents: 0,
			discountLabel: "",
			tipCents: 0,
			payments: [],
			courseHold: {}
		};
		set({ checks: [...get().checks, check] });
		return check.id;
	},
	openWalkIn: (type, guestCount) => {
		const staffId = get().currentStaffId ?? get().staff[0].id;
		const check = {
			id: nid("chk"),
			tableId: null,
			type,
			guestCount,
			staffId,
			items: [],
			openedAt: Date.now(),
			paidAt: null,
			status: "open",
			notes: "",
			discountCents: 0,
			discountLabel: "",
			tipCents: 0,
			payments: [],
			courseHold: {}
		};
		set({ checks: [...get().checks, check] });
		return check.id;
	},
	getOpenCheckForTable: (tableId) => get().checks.find((c) => c.tableId === tableId && c.status !== "paid" && c.status !== "voided"),
	addItem: (checkId, productId, opts) => {
		const product = get().products.find((p) => p.id === productId);
		const check = get().checks.find((c) => c.id === checkId);
		if (!product || !check || check.status === "paid" || check.status === "voided") return null;
		const price = effectivePrice(product, get().settings);
		const extra = product.modifiers.flatMap((g) => g.options).filter((o) => (opts?.modifiers ?? []).includes(o.name)).reduce((s, o) => s + o.priceDelta, 0);
		const item = {
			id: nid("it"),
			productId: product.id,
			name: product.name,
			unitPrice: price + extra,
			qty: opts?.qty ?? 1,
			taxRate: effectiveTax(product, check.type),
			course: product.course,
			station: product.station,
			modifiers: opts?.modifiers ?? [],
			note: opts?.note ?? "",
			sent: false,
			seat: opts?.seat ?? null,
			voided: false
		};
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			items: [...c.items, item],
			status: c.status === "billed" ? "sent" : c.status
		} : c) });
		return item.id;
	},
	setItemQty: (checkId, itemId, qty) => {
		set({ checks: get().checks.map((c) => {
			if (c.id !== checkId) return c;
			return {
				...c,
				items: c.items.map((i) => {
					if (i.id !== itemId || i.sent) return i;
					return {
						...i,
						qty: Math.max(1, qty)
					};
				})
			};
		}) });
	},
	setItemNote: (checkId, itemId, note) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			items: c.items.map((i) => i.id === itemId ? {
				...i,
				note
			} : i)
		} : c) });
	},
	setItemSeat: (checkId, itemId, seat) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			items: c.items.map((i) => i.id === itemId ? {
				...i,
				seat
			} : i)
		} : c) });
	},
	voidItem: (checkId, itemId) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			items: c.items.map((i) => i.id === itemId ? {
				...i,
				voided: true,
				qty: i.qty
			} : i)
		} : c) });
	},
	sendCourses: (checkId, courses) => {
		const state = get();
		const check = state.checks.find((c) => c.id === checkId);
		if (!check) return;
		const staff = state.staff.find((s) => s.id === check.staffId);
		const toSend = check.items.filter((i) => !i.voided && !i.sent && courses.includes(i.course));
		if (toSend.length === 0) return;
		const groups = /* @__PURE__ */ new Map();
		for (const item of toSend) {
			const key = `${item.station}:${item.course}`;
			const list = groups.get(key) ?? [];
			list.push(item);
			groups.set(key, list);
		}
		const tickets = [];
		for (const [key, items] of groups) {
			const [station, course] = key.split(":");
			tickets.push({
				id: nid("kt"),
				checkId,
				tableLabel: tableLabel(state.tables, check.tableId, check.type),
				course,
				station,
				items: items.map((i) => ({
					name: i.name,
					qty: i.qty,
					modifiers: i.modifiers,
					note: i.note
				})),
				status: "neu",
				createdAt: Date.now(),
				staffName: staff?.name ?? "Service"
			});
		}
		const sentIds = new Set(toSend.map((i) => i.id));
		set({
			tickets: [...state.tickets, ...tickets],
			checks: state.checks.map((c) => c.id === checkId ? {
				...c,
				status: c.status === "open" ? "sent" : c.status,
				items: c.items.map((i) => sentIds.has(i.id) ? {
					...i,
					sent: true
				} : i)
			} : c)
		});
	},
	holdCourse: (checkId, course, hold) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			courseHold: {
				...c.courseHold,
				[course]: hold
			}
		} : c) });
	},
	setDiscount: (checkId, cents, label) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			discountCents: Math.max(0, cents),
			discountLabel: label
		} : c) });
	},
	setTip: (checkId, cents) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			tipCents: Math.max(0, cents)
		} : c) });
	},
	setGuests: (checkId, n) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			guestCount: Math.max(1, n)
		} : c) });
	},
	setCheckNotes: (checkId, notes) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			notes
		} : c) });
	},
	requestBill: (checkId) => {
		set({ checks: get().checks.map((c) => c.id === checkId ? {
			...c,
			status: "billed"
		} : c) });
	},
	moveCheck: (checkId, toTableId) => {
		const state = get();
		if (state.checks.some((c) => c.tableId === toTableId && c.id !== checkId && c.status !== "paid" && c.status !== "voided")) return false;
		set({ checks: state.checks.map((c) => c.id === checkId ? {
			...c,
			tableId: toTableId,
			type: "tisch"
		} : c) });
		return true;
	},
	mergeChecks: (fromId, toId) => {
		const state = get();
		const from = state.checks.find((c) => c.id === fromId);
		const to = state.checks.find((c) => c.id === toId);
		if (!from || !to || fromId === toId) return false;
		if (from.status === "paid" || to.status === "paid") return false;
		set({ checks: state.checks.filter((c) => c.id !== fromId).map((c) => c.id === toId ? {
			...c,
			items: [...c.items, ...from.items],
			guestCount: c.guestCount + from.guestCount,
			discountCents: c.discountCents + from.discountCents,
			notes: [c.notes, from.notes].filter(Boolean).join(" · ")
		} : c) });
		return true;
	},
	splitItems: (checkId, itemIds) => {
		const state = get();
		const check = state.checks.find((c) => c.id === checkId);
		if (!check) return null;
		const move = check.items.filter((i) => itemIds.includes(i.id) && !i.voided);
		const keep = check.items.filter((i) => !itemIds.includes(i.id));
		if (move.length === 0 || keep.length === 0) return null;
		const neu = {
			...check,
			id: nid("chk"),
			items: move,
			openedAt: Date.now(),
			status: "open",
			discountCents: 0,
			discountLabel: "",
			tipCents: 0,
			payments: [],
			guestCount: Math.max(1, Math.floor(check.guestCount / 2))
		};
		set({ checks: state.checks.map((c) => c.id === checkId ? {
			...c,
			items: keep
		} : c).concat(neu) });
		return neu.id;
	},
	pay: (checkId, payments, tipCents) => {
		const state = get();
		const check = state.checks.find((c) => c.id === checkId);
		if (!check || check.status === "paid" || check.status === "voided") return null;
		const staffId = state.currentStaffId ?? check.staffId;
		const withTip = {
			...check,
			tipCents,
			payments: [...check.payments, ...payments.map((p) => ({
				id: nid("pay"),
				method: p.method,
				amountCents: p.amountCents,
				receivedCents: p.receivedCents,
				at: Date.now(),
				staffId,
				cardBrand: p.cardBrand,
				cardLast4: p.cardLast4,
				sumupTxId: p.sumupTxId,
				readerName: p.readerName
			}))]
		};
		if (checkDue(withTip) > 2) {
			set({ checks: state.checks.map((c) => c.id === checkId ? withTip : c) });
			return null;
		}
		const paid = {
			...withTip,
			status: "paid",
			paidAt: Date.now()
		};
		const tseCounter = state.settings.tseCounter + 1;
		const bon = state.settings.nextBonNumber;
		const tse = signTse(state.settings.tseSerial, tseCounter, `${bon}|${checkTotal(paid)}|${paid.id}`);
		const receipt = {
			id: nid("bon"),
			checkId,
			number: bon,
			tse,
			printedAt: Date.now(),
			type: "rechnung",
			snapshot: snapshotCheck(paid, {
				...state,
				checks: [paid]
			})
		};
		const stockMap = /* @__PURE__ */ new Map();
		for (const item of paid.items) {
			if (item.voided) continue;
			stockMap.set(item.productId, (stockMap.get(item.productId) ?? 0) + item.qty);
		}
		set({
			checks: state.checks.map((c) => c.id === checkId ? paid : c),
			receipts: [...state.receipts, receipt],
			settings: {
				...state.settings,
				tseCounter,
				nextBonNumber: bon + 1
			},
			products: state.products.map((p) => {
				const used = stockMap.get(p.id);
				if (!used || p.stock == null) return p;
				return {
					...p,
					stock: Math.max(0, p.stock - used)
				};
			})
		});
		return receipt;
	},
	voidCheck: (checkId, reason) => {
		const state = get();
		const check = state.checks.find((c) => c.id === checkId);
		if (!check || check.status === "voided") return null;
		const tseCounter = state.settings.tseCounter + 1;
		const bon = state.settings.nextBonNumber;
		const tse = signTse(state.settings.tseSerial, tseCounter, `STORNO|${bon}|${check.id}|${reason}`, "AVBelegAbbruch-V1");
		const voided = {
			...check,
			status: "voided",
			notes: reason
		};
		const receipt = {
			id: nid("bon"),
			checkId,
			number: bon,
			tse,
			printedAt: Date.now(),
			type: "storno",
			snapshot: snapshotCheck(voided, {
				...state,
				checks: [voided]
			})
		};
		set({
			checks: state.checks.map((c) => c.id === checkId ? voided : c),
			receipts: [...state.receipts, receipt],
			settings: {
				...state.settings,
				tseCounter,
				nextBonNumber: bon + 1
			}
		});
		return receipt;
	},
	printZwischen: (checkId) => {
		const state = get();
		const check = state.checks.find((c) => c.id === checkId);
		if (!check) return null;
		const tseCounter = state.settings.tseCounter + 1;
		const bon = state.settings.nextBonNumber;
		const tse = signTse(state.settings.tseSerial, tseCounter, `ZWISCHEN|${bon}|${check.id}`, "Bestellung-V1");
		const receipt = {
			id: nid("bon"),
			checkId,
			number: bon,
			tse,
			printedAt: Date.now(),
			type: "zwischen",
			snapshot: snapshotCheck(check, state)
		};
		set({
			receipts: [...state.receipts, receipt],
			settings: {
				...state.settings,
				tseCounter,
				nextBonNumber: bon + 1
			}
		});
		return receipt;
	},
	bumpTicket: (ticketId, status) => {
		set({ tickets: get().tickets.map((t) => t.id === ticketId ? {
			...t,
			status
		} : t) });
	},
	upsertProduct: (product) => {
		set({ products: get().products.some((p) => p.id === product.id) ? get().products.map((p) => p.id === product.id ? product : p) : [...get().products, product] });
	},
	removeProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
	upsertCategory: (cat) => {
		set({ categories: get().categories.some((c) => c.id === cat.id) ? get().categories.map((c) => c.id === cat.id ? cat : c) : [...get().categories, cat] });
	},
	upsertStaff: (s) => {
		set({ staff: get().staff.some((x) => x.id === s.id) ? get().staff.map((x) => x.id === s.id ? s : x) : [...get().staff, s] });
	},
	adjustStock: (productId, delta) => {
		set({ products: get().products.map((p) => p.id === productId && p.stock != null ? {
			...p,
			stock: Math.max(0, p.stock + delta)
		} : p) });
	},
	upsertReservation: (r) => {
		set({ reservations: get().reservations.some((x) => x.id === r.id) ? get().reservations.map((x) => x.id === r.id ? r : x) : [...get().reservations, r] });
	},
	setReservationStatus: (id, status, tableId) => {
		set({ reservations: get().reservations.map((r) => r.id === id ? {
			...r,
			status,
			tableId: tableId === void 0 ? r.tableId : tableId
		} : r) });
	},
	closeDay: (countedCash) => {
		const state = get();
		const since = lastCloseAt(state.dayCloses);
		const paid = state.checks.filter((c) => c.status === "paid" && (c.paidAt ?? 0) >= since);
		const salesByMethod = {
			bar: 0,
			karte: 0
		};
		for (const c of paid) for (const p of c.payments) salesByMethod[p.method] += p.amountCents;
		const vatMap = /* @__PURE__ */ new Map();
		for (const c of paid) for (const v of vatBreakdown(c)) {
			const cur = vatMap.get(v.rate) ?? {
				gross: 0,
				net: 0,
				tax: 0
			};
			vatMap.set(v.rate, {
				gross: cur.gross + v.gross,
				net: cur.net + v.net,
				tax: cur.tax + v.tax
			});
		}
		const tseCounter = state.settings.tseCounter + 1;
		const tse = signTse(state.settings.tseSerial, tseCounter, `Z|${since}|${Date.now()}|${salesByMethod.bar}|${salesByMethod.karte}`, "AVBelegAbbruch-V1");
		const staff = state.staff.find((s) => s.id === state.currentStaffId);
		const close = {
			id: nid("z"),
			at: Date.now(),
			staffId: state.currentStaffId ?? "s_chef",
			staffName: staff?.name ?? "Inhaber",
			expectedCash: salesByMethod.bar,
			countedCash,
			salesByMethod,
			vat: [...vatMap.entries()].map(([rate, v]) => ({
				rate,
				...v
			})),
			receiptCount: state.receipts.filter((r) => r.printedAt >= since && r.type === "rechnung").length,
			covers: paid.reduce((s, c) => s + c.guestCount, 0),
			tse
		};
		const receipt = {
			id: nid("bon"),
			checkId: close.id,
			number: state.settings.nextBonNumber,
			tse,
			printedAt: Date.now(),
			type: "z-abschluss",
			snapshot: {
				restaurantName: state.settings.restaurantName,
				address: state.settings.address,
				taxId: state.settings.taxId,
				tableLabel: "Z-Abschluss",
				staffName: close.staffName,
				guestCount: close.covers,
				lines: [{
					name: "Bar",
					qty: 1,
					unitPrice: salesByMethod.bar,
					taxRate: 19
				}, {
					name: "Karte",
					qty: 1,
					unitPrice: salesByMethod.karte,
					taxRate: 19
				}],
				discountCents: 0,
				discountLabel: "",
				tipCents: 0,
				payments: [],
				type: "tisch"
			}
		};
		set({
			dayCloses: [...state.dayCloses, close],
			receipts: [...state.receipts, receipt],
			settings: {
				...state.settings,
				tseCounter,
				nextBonNumber: state.settings.nextBonNumber + 1
			}
		});
		return close;
	},
	updateSettings: (patch) => set({ settings: withSumupSettings({
		...get().settings,
		...patch,
		sumup: {
			...DEFAULT_SUMUP,
			...get().settings.sumup,
			...patch.sumup
		}
	}) }),
	upsertTable: (t) => {
		set({ tables: get().tables.some((x) => x.id === t.id) ? get().tables.map((x) => x.id === t.id ? t : x) : [...get().tables, t] });
	},
	resetDemo: () => {
		set({
			...createSeedState(),
			currentStaffId: get().currentStaffId,
			hydrated: true
		});
	}
}), {
	name: "vesper-pos-v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	merge: (persisted, current) => {
		const p = persisted ?? {};
		const settings = withSumupSettings({
			...current.settings,
			...p.settings,
			sumup: {
				...DEFAULT_SUMUP,
				...current.settings.sumup,
				...p.settings?.sumup
			}
		});
		return {
			...current,
			...p,
			settings
		};
	},
	partialize: (s) => ({
		rooms: s.rooms,
		tables: s.tables,
		categories: s.categories,
		products: s.products,
		staff: s.staff,
		currentStaffId: s.currentStaffId,
		checks: s.checks,
		tickets: s.tickets,
		receipts: s.receipts,
		reservations: s.reservations,
		dayCloses: s.dayCloses,
		settings: s.settings
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			sage: "bg-sage text-sage-fg hover:bg-sage/90",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			muted: "bg-surface-2 text-fg hover:bg-border",
			danger: "bg-danger text-fg hover:bg-danger/90",
			amber: "bg-amber text-accent-fg hover:bg-amber/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5",
			xl: "h-14 px-6 text-base",
			icon: "size-11",
			tile: "h-auto min-h-20 flex-col items-stretch justify-between p-3 text-left"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var KEYS = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"",
	"0",
	"del"
];
function PinLock() {
	const unlock = usePosStore((s) => s.unlock);
	const settings = usePosStore((s) => s.settings);
	const [pin, setPin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(false);
	function press(key) {
		if (key === "del") {
			setPin((p) => p.slice(0, -1));
			setError(false);
			return;
		}
		if (!key || pin.length >= 6) return;
		const next = pin + key;
		setPin(next);
		if (next.length >= 4) {
			if (!unlock(next)) {
				setError(true);
				setTimeout(() => {
					setPin("");
					setError(false);
				}, 420);
			}
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-bg px-4 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-3xl font-semibold tracking-tight",
					children: "Vesper"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-center text-sm text-muted",
					children: settings.restaurantName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-center text-xs font-medium tracking-wide text-subtle uppercase",
					children: "Mitarbeiter-PIN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex justify-center gap-2",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-3 rounded-full border border-border", i < pin.length && "bg-accent border-accent", error && "border-danger bg-danger") }, i))
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-sm text-danger",
					children: "PIN unbekannt"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-sm text-subtle",
					children: "Demo: 1111 Anna · 0000 Inhaber"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-3 gap-2",
					children: KEYS.map((key, i) => key === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "muted",
						className: "h-16 rounded-lg text-xl font-medium",
						onClick: () => press(key === "del" ? "del" : key),
						"aria-label": key === "del" ? "Löschen" : key,
						children: key === "del" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, { className: "size-5" }) : key
					}, key + i))
				})
			]
		})
	});
}
var NAV = [
	{
		to: "/",
		label: "Tischplan",
		icon: LayoutGrid
	},
	{
		to: "/schnellkasse",
		label: "Schnellkasse",
		icon: ShoppingBag
	},
	{
		to: "/kueche",
		label: "Küche",
		icon: ChefHat
	},
	{
		to: "/reservierungen",
		label: "Reservierungen",
		icon: CalendarClock
	},
	{
		to: "/berichte",
		label: "Berichte",
		icon: ChartColumn
	},
	{
		to: "/artikel",
		label: "Artikel",
		icon: UtensilsCrossed
	},
	{
		to: "/personal",
		label: "Personal",
		icon: Users
	},
	{
		to: "/inventar",
		label: "Inventar",
		icon: Package
	},
	{
		to: "/abschluss",
		label: "Abschluss",
		icon: ClipboardCheck
	},
	{
		to: "/einstellungen",
		label: "Einstellungen",
		icon: Settings
	}
];
function AppShell({ children }) {
	const hydrated = usePosStore((s) => s.hydrated);
	const setHydrated = usePosStore((s) => s.setHydrated);
	const currentStaffId = usePosStore((s) => s.currentStaffId);
	const staff = usePosStore((s) => s.staff);
	const lock = usePosStore((s) => s.lock);
	const settings = usePosStore((s) => s.settings);
	const checks = usePosStore((s) => s.checks);
	const dayCloses = usePosStore((s) => s.dayCloses);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [clock, setClock] = (0, import_react.useState)("");
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.resolve(usePosStore.persist.rehydrate()).finally(() => {
			if (!usePosStore.getState().hydrated) setHydrated();
		});
	}, [setHydrated]);
	(0, import_react.useEffect)(() => {
		const tick = () => setClock((/* @__PURE__ */ new Date()).toLocaleTimeString("de-DE", {
			hour: "2-digit",
			minute: "2-digit"
		}));
		tick();
		const id = setInterval(tick, 15e3);
		return () => clearInterval(id);
	}, []);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-sans text-3xl font-semibold tracking-tight",
			children: "Vesper"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Kasse wird geladen…"
		})]
	});
	if (!currentStaffId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinLock, {});
	const me = staff.find((s) => s.id === currentStaffId);
	const since = lastCloseAt(dayCloses);
	const todaySales = checks.filter((c) => c.status === "paid" && (c.paidAt ?? 0) >= since).reduce((s, c) => s + checkTotal(c), 0);
	const openTables = checks.filter((c) => c.status !== "paid" && c.status !== "voided" && c.tableId).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-[220px] shrink-0 flex-col border-r border-border bg-surface lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 pt-6 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold tracking-tight",
						children: "Vesper"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-muted",
						children: settings.restaurantName
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-0.5 px-3 pb-4",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" || pathname.startsWith("/tisch") : pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: "Heute"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-lg tabular-nums",
							children: formatEUR(todaySales)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [openTables, " offene Tische"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center gap-3 border-b border-border bg-surface px-3 sm:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							onClick: () => setMenuOpen((v) => !v),
							"aria-label": "Menü",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: me?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hidden text-xs text-muted sm:block",
								children: me?.role === "inhaber" ? "Inhaber" : me?.role === "bar" ? "Bar" : me?.role === "kueche" ? "Küche" : "Service"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm tabular-nums text-muted",
							children: clock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: lock,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), "Sperren"]
						})
					]
				}),
				menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border bg-surface px-3 py-2 lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setMenuOpen(false),
							className: cn("flex h-11 items-center gap-2 rounded-md px-3 text-sm", pathname === item.to ? "bg-surface-2" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}, item.to))
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-h-0 flex-1 overflow-auto",
					children
				})
			]
		})]
	});
}
//#endregion
export { tableLabel as C, usePosStore as D, todayKey as E, vatBreakdown as O, parseEuroInput as S, taxFromGross as T, formatTime as _, DEFAULT_SUMUP as a, netFromGross as b, STATION_LABEL as c, checkTotal as d, cn as f, formatEUR as g, formatDuration as h, COURSE_ORDER as i, withSumupSettings as k, checkDue as l, formatDateTime as m, Button as n, METHOD_LABEL as o, effectivePrice as p, COURSE_LABEL as r, ROLE_LABEL as s, AppShell as t, checkSubtotal as u, itemTotal as v, tableStatus as w, nid as x, lastCloseAt as y };
