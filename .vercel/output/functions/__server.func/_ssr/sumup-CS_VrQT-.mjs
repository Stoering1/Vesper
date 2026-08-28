import { n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sumup-CS_VrQT-.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SUMUP = "https://api.sumup.com";
function problemMessage(json, status) {
	if (json && typeof json === "object") {
		const o = json;
		const detail = typeof o.detail === "string" ? o.detail : "";
		const title = typeof o.title === "string" ? o.title : "";
		const message = typeof o.message === "string" ? o.message : "";
		const raw = detail || message || title;
		if (raw) {
			if (/unauthorized|invalid.*(token|key|api)/i.test(raw) || status === 401) return "API-Schlüssel ungültig. Bitte in den Einstellungen prüfen.";
			if (/not found/i.test(raw) || status === 404) return "Terminal oder Händlerkonto nicht gefunden.";
			if (/busy|in progress|already/i.test(raw) || status === 409) return "Das Terminal ist beschäftigt. Bitte Vorgang am Gerät beenden.";
			return raw;
		}
	}
	if (status === 401) return "API-Schlüssel ungültig.";
	if (status === 404) return "Terminal nicht gefunden.";
	if (status === 409) return "Terminal ist beschäftigt.";
	return `SumUp-Fehler (${status})`;
}
async function sumupFetch(apiKey, path, init) {
	try {
		const res = await fetch(`${SUMUP}${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: "application/json",
				...init?.body ? { "Content-Type": "application/json" } : {},
				...init?.headers
			}
		});
		const text = await res.text();
		let json = null;
		if (text) try {
			json = JSON.parse(text);
		} catch {
			json = { raw: text };
		}
		if (!res.ok) return {
			ok: false,
			status: res.status,
			error: problemMessage(json, res.status)
		};
		return {
			ok: true,
			status: res.status,
			json
		};
	} catch {
		return {
			ok: false,
			status: 0,
			error: "Keine Verbindung zu SumUp. Internet am PC prüfen."
		};
	}
}
function asRecord(v) {
	return v && typeof v === "object" ? v : null;
}
function parseReader(raw) {
	const o = asRecord(raw);
	if (!o || typeof o.id !== "string") return null;
	const device = asRecord(o.device);
	return {
		id: o.id,
		name: typeof o.name === "string" ? o.name : "SumUp",
		status: typeof o.status === "string" ? o.status : "unknown",
		model: typeof device?.model === "string" ? device.model : "solo",
		identifier: typeof device?.identifier === "string" ? device.identifier : ""
	};
}
function parseReaderList(json) {
	if (Array.isArray(json)) return json.map(parseReader).filter((x) => Boolean(x));
	const o = asRecord(json);
	const items = o?.items ?? o?.readers ?? o?.data;
	if (Array.isArray(items)) return items.map(parseReader).filter((x) => Boolean(x));
	const one = parseReader(json);
	return one ? [one] : [];
}
function parseLiveStatus(json) {
	const root = asRecord(json);
	const d = asRecord(root?.data) ?? root ?? {};
	const status = String(d.status ?? "").toUpperCase();
	const batteryRaw = d.battery_level;
	const battery = typeof batteryRaw === "number" ? Math.round(batteryRaw) : null;
	return {
		online: status === "ONLINE" || String(d.state ?? "").length > 0,
		state: typeof d.state === "string" ? d.state : "IDLE",
		battery,
		connection: typeof d.connection_type === "string" ? d.connection_type : null,
		firmware: typeof d.firmware_version === "string" ? d.firmware_version : null
	};
}
function parseCheckout(json) {
	const root = asRecord(json);
	const d = asRecord(root?.data) ?? root;
	if (!d) return null;
	const id = typeof d.client_transaction_id === "string" && d.client_transaction_id || typeof d.clientTransactionId === "string" && d.clientTransactionId || "";
	if (!id) return null;
	return {
		clientTransactionId: id,
		checkoutId: typeof d.checkout_id === "string" ? d.checkout_id : void 0
	};
}
function parseTransaction(json) {
	const root = asRecord(json);
	let row = root;
	if (Array.isArray(root?.items) && root.items[0]) row = asRecord(root.items[0]);
	else if (Array.isArray(json) && json[0]) row = asRecord(json[0]);
	else if (asRecord(root?.data)) row = asRecord(root?.data);
	if (!row) return null;
	const card = asRecord(row.card);
	const status = String(row.status ?? row.transaction_status ?? "").toUpperCase();
	if (!status) return null;
	const brand = typeof row.card_type === "string" && row.card_type || typeof card?.type === "string" && card.type || typeof row.payment_type === "string" && row.payment_type || void 0;
	const last4 = typeof row.last_4_digits === "string" && row.last_4_digits || typeof card?.last_4_digits === "string" && card.last_4_digits || void 0;
	const txId = typeof row.id === "string" && row.id || typeof row.transaction_code === "string" && row.transaction_code || typeof row.client_transaction_id === "string" && row.client_transaction_id || void 0;
	return {
		status,
		cardBrand: brand?.toUpperCase(),
		cardLast4: last4,
		txId
	};
}
var sumupListReaders_createServerFn_handler = createServerRpc({
	id: "bf891c18627733a9ab040362950ba0cbc403bc58348ae14868ef8a9430d8521e",
	name: "sumupListReaders",
	filename: "src/lib/pos/sumup.ts"
}, (opts) => sumupListReaders.__executeServer(opts));
var sumupListReaders = createServerFn({ method: "POST" }).validator((d) => d).handler(sumupListReaders_createServerFn_handler, async ({ data }) => {
	const code = data.merchantCode.trim();
	const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers`);
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	return {
		ok: true,
		data: parseReaderList(res.json)
	};
});
var sumupPairReader_createServerFn_handler = createServerRpc({
	id: "fd3cd09260571787fe0656b0db13b8fa834974c106b4d0c1b9717c5f908641ce",
	name: "sumupPairReader",
	filename: "src/lib/pos/sumup.ts"
}, (opts) => sumupPairReader.__executeServer(opts));
var sumupPairReader = createServerFn({ method: "POST" }).validator((d) => d).handler(sumupPairReader_createServerFn_handler, async ({ data }) => {
	const code = data.merchantCode.trim();
	const pairing = data.pairingCode.replace(/\s+/g, "").toUpperCase();
	if (pairing.length < 8 || pairing.length > 9) return {
		ok: false,
		error: "Pairing-Code muss 8 oder 9 Zeichen haben."
	};
	const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers`, {
		method: "POST",
		body: JSON.stringify({
			pairing_code: pairing,
			name: data.name.trim() || "Theke"
		})
	});
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	const reader = parseReader(res.json) ?? parseReader(asRecord(res.json)?.data);
	if (!reader) return {
		ok: false,
		error: "SumUp hat kein Terminal zurückgegeben."
	};
	return {
		ok: true,
		data: reader
	};
});
var sumupReaderStatus_createServerFn_handler = createServerRpc({
	id: "9add97660207927ae3acd681cb8eaa7fd2e026cb5573f477d88c4c798a2872d0",
	name: "sumupReaderStatus",
	filename: "src/lib/pos/sumup.ts"
}, (opts) => sumupReaderStatus.__executeServer(opts));
var sumupReaderStatus = createServerFn({ method: "POST" }).validator((d) => d).handler(sumupReaderStatus_createServerFn_handler, async ({ data }) => {
	const code = data.merchantCode.trim();
	const id = data.readerId.trim();
	const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}/status`);
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	return {
		ok: true,
		data: parseLiveStatus(res.json)
	};
});
var sumupStartCheckout_createServerFn_handler = createServerRpc({
	id: "cf73f98021d6d40c4ded69d4f09423a2dd60c53547e6ec09e2942460b3daaf35",
	name: "sumupStartCheckout",
	filename: "src/lib/pos/sumup.ts"
}, (opts) => sumupStartCheckout.__executeServer(opts));
var sumupStartCheckout = createServerFn({ method: "POST" }).validator((d) => d).handler(sumupStartCheckout_createServerFn_handler, async ({ data }) => {
	const code = data.merchantCode.trim();
	const id = data.readerId.trim();
	const value = Math.round(data.amountCents);
	if (value < 1) return {
		ok: false,
		error: "Betrag muss größer als 0 sein."
	};
	const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}/checkout`, {
		method: "POST",
		body: JSON.stringify({
			total_amount: {
				currency: "EUR",
				minor_unit: 2,
				value
			},
			description: data.description.slice(0, 120)
		})
	});
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	const parsed = parseCheckout(res.json);
	if (!parsed) return {
		ok: false,
		error: "SumUp hat keine Transaktions-ID geliefert."
	};
	return {
		ok: true,
		data: { clientTransactionId: parsed.clientTransactionId }
	};
});
var sumupTerminateCheckout_createServerFn_handler = createServerRpc({
	id: "1318c56ebf0bcee744c4df52b4270d88c29fc4bc71b7e5c69b2ac8f8fae7c5d3",
	name: "sumupTerminateCheckout",
	filename: "src/lib/pos/sumup.ts"
}, (opts) => sumupTerminateCheckout.__executeServer(opts));
var sumupTerminateCheckout = createServerFn({ method: "POST" }).validator((d) => d).handler(sumupTerminateCheckout_createServerFn_handler, async ({ data }) => {
	const code = data.merchantCode.trim();
	const id = data.readerId.trim();
	const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}/terminate`, { method: "POST" });
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	return { ok: true };
});
var sumupGetTransaction_createServerFn_handler = createServerRpc({
	id: "4598c63717414f2d62bb8bc1e3f8611be94602f699745e807ea334615b706022",
	name: "sumupGetTransaction",
	filename: "src/lib/pos/sumup.ts"
}, (opts) => sumupGetTransaction.__executeServer(opts));
var sumupGetTransaction = createServerFn({ method: "POST" }).validator((d) => d).handler(sumupGetTransaction_createServerFn_handler, async ({ data }) => {
	const key = data.apiKey.trim();
	const code = data.merchantCode.trim();
	const tx = encodeURIComponent(data.clientTransactionId);
	const first = await sumupFetch(key, `/v2.1/merchants/${encodeURIComponent(code)}/transactions?client_transaction_id=${tx}`);
	let parsed = first.ok ? parseTransaction(first.json) : null;
	if (!parsed) {
		const fallback = await sumupFetch(key, `/v0.1/me/transactions?id=${tx}`);
		if (fallback.ok) parsed = parseTransaction(fallback.json);
		else if (!first.ok) return {
			ok: false,
			error: first.error
		};
	}
	if (!parsed) return {
		ok: true,
		data: { status: "PENDING" }
	};
	return {
		ok: true,
		data: parsed
	};
});
var sumupDeleteReader_createServerFn_handler = createServerRpc({
	id: "d353d05e62b6c8a6a0ce08e3c91a3c079a7b2c4b88f9900c324890216a53be27",
	name: "sumupDeleteReader",
	filename: "src/lib/pos/sumup.ts"
}, (opts) => sumupDeleteReader.__executeServer(opts));
var sumupDeleteReader = createServerFn({ method: "POST" }).validator((d) => d).handler(sumupDeleteReader_createServerFn_handler, async ({ data }) => {
	const code = data.merchantCode.trim();
	const id = data.readerId.trim();
	const res = await sumupFetch(data.apiKey.trim(), `/v0.1/merchants/${encodeURIComponent(code)}/readers/${encodeURIComponent(id)}`, { method: "DELETE" });
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	return { ok: true };
});
//#endregion
export { sumupDeleteReader_createServerFn_handler, sumupGetTransaction_createServerFn_handler, sumupListReaders_createServerFn_handler, sumupPairReader_createServerFn_handler, sumupReaderStatus_createServerFn_handler, sumupStartCheckout_createServerFn_handler, sumupTerminateCheckout_createServerFn_handler };
