import { a as DEFAULT_SUMUP } from "./shell-2UgE9VPX.mjs";
import { n as createServerFn, r as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sumup-C1AvonDU.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var PHASE_COPY = {
	idle: "Bereit",
	sending: "Betrag wird an das Terminal gesendet…",
	waiting_card: "Bitte Karte auflegen oder Chip einstecken",
	selecting_tip: "Gast wählt Trinkgeld am Terminal",
	waiting_pin: "PIN am Terminal eingeben",
	waiting_signature: "Unterschrift am Terminal",
	processing: "Zahlung wird autorisiert…",
	successful: "Zahlung genehmigt",
	failed: "Zahlung abgelehnt",
	cancelled: "Zahlung abgebrochen",
	offline: "Terminal offline"
};
function isSumupLiveReady(s) {
	return s.mode === "live" && s.apiKey.trim().length > 8 && s.merchantCode.trim().length > 2 && s.readerId.trim().startsWith("rdr_") && !s.readerId.includes("demo");
}
function maskApiKey(key) {
	const t = key.trim();
	if (t.length < 8) return t ? "••••" : "";
	return `${t.slice(0, 4)} · •••• ${t.slice(-4)}`;
}
var sumupListReaders = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("bf891c18627733a9ab040362950ba0cbc403bc58348ae14868ef8a9430d8521e"));
var sumupPairReader = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("fd3cd09260571787fe0656b0db13b8fa834974c106b4d0c1b9717c5f908641ce"));
var sumupReaderStatus = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("9add97660207927ae3acd681cb8eaa7fd2e026cb5573f477d88c4c798a2872d0"));
var sumupStartCheckout = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("cf73f98021d6d40c4ded69d4f09423a2dd60c53547e6ec09e2942460b3daaf35"));
var sumupTerminateCheckout = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("1318c56ebf0bcee744c4df52b4270d88c29fc4bc71b7e5c69b2ac8f8fae7c5d3"));
var sumupGetTransaction = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("4598c63717414f2d62bb8bc1e3f8611be94602f699745e807ea334615b706022"));
var sumupDeleteReader = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("d353d05e62b6c8a6a0ce08e3c91a3c079a7b2c4b88f9900c324890216a53be27"));
function mapReaderState(state, online) {
	if (!online) return "offline";
	switch (state.toUpperCase()) {
		case "WAITING_FOR_CARD": return "waiting_card";
		case "SELECTING_TIP": return "selecting_tip";
		case "WAITING_FOR_PIN": return "waiting_pin";
		case "WAITING_FOR_SIGNATURE": return "waiting_signature";
		case "UPDATING_FIRMWARE": return "processing";
		default: return "waiting_card";
	}
}
function sleep(ms, signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new DOMException("Aborted", "AbortError"));
			return;
		}
		const t = globalThis.setTimeout(resolve, ms);
		signal?.addEventListener("abort", () => {
			globalThis.clearTimeout(t);
			reject(new DOMException("Aborted", "AbortError"));
		}, { once: true });
	});
}
function createDemoGate() {
	let settle = null;
	const promised = new Promise((resolve) => {
		settle = resolve;
	});
	return {
		choose(choice) {
			settle?.(choice);
		},
		wait(timeoutMs, signal) {
			return Promise.race([promised, sleep(timeoutMs, signal).then(() => "contactless")]);
		}
	};
}
async function runDemoCheckout(opts) {
	const name = opts.readerName || DEFAULT_SUMUP.readerName;
	opts.onPhase("sending");
	await sleep(700, opts.signal);
	opts.onPhase("waiting_card");
	const choice = opts.gate ? await opts.gate.wait(4e3, opts.signal) : (await sleep(4e3, opts.signal), "contactless");
	if (choice === "decline") {
		opts.onPhase("processing");
		await sleep(600, opts.signal);
		opts.onPhase("failed");
		return {
			status: "failed",
			readerName: name,
			error: "Karte abgelehnt (Demo)"
		};
	}
	if (choice === "chip") {
		opts.onPhase("waiting_pin");
		await sleep(1100, opts.signal);
	}
	opts.onPhase("processing");
	await sleep(900, opts.signal);
	opts.onPhase("successful");
	return {
		status: "successful",
		cardBrand: choice === "chip" ? "MASTERCARD" : "VISA",
		cardLast4: choice === "chip" ? "4444" : "4242",
		sumupTxId: `demo_${Date.now().toString(36)}`,
		readerName: name
	};
}
async function runLiveCheckout(opts) {
	const s = opts.settings;
	const creds = {
		apiKey: s.apiKey,
		merchantCode: s.merchantCode
	};
	opts.onPhase("sending");
	const started = await sumupStartCheckout({ data: {
		...creds,
		readerId: s.readerId,
		amountCents: opts.amountCents,
		description: opts.description
	} });
	if (!started.ok || !started.data) {
		opts.onPhase("failed");
		return {
			status: "failed",
			readerName: s.readerName,
			error: started.error ?? "Checkout fehlgeschlagen"
		};
	}
	const txId = started.data.clientTransactionId;
	const deadline = Date.now() + 9e4;
	let sawCardPrompt = false;
	while (Date.now() < deadline) {
		if (opts.signal.aborted) {
			await sumupTerminateCheckout({ data: {
				...creds,
				readerId: s.readerId
			} }).catch(() => void 0);
			throw new DOMException("Aborted", "AbortError");
		}
		const [st, tx] = await Promise.all([sumupReaderStatus({ data: {
			...creds,
			readerId: s.readerId
		} }), sumupGetTransaction({ data: {
			...creds,
			clientTransactionId: txId
		} })]);
		if (st.ok && st.data) {
			const phase = mapReaderState(st.data.state, st.data.online);
			if (phase === "offline" && !sawCardPrompt) opts.onPhase("offline", st.data);
			else {
				if (phase === "waiting_card" || phase === "waiting_pin") sawCardPrompt = true;
				if (phase !== "offline") opts.onPhase(phase, st.data);
			}
		}
		const tStatus = tx.ok ? tx.data?.status : void 0;
		if (tStatus === "SUCCESSFUL") {
			opts.onPhase("successful", st.data);
			return {
				status: "successful",
				cardBrand: tx.data?.cardBrand,
				cardLast4: tx.data?.cardLast4,
				sumupTxId: tx.data?.txId ?? txId,
				readerName: s.readerName
			};
		}
		if (tStatus === "FAILED") {
			opts.onPhase("failed", st.data);
			return {
				status: "failed",
				readerName: s.readerName,
				sumupTxId: tx.data?.txId ?? txId,
				error: "Zahlung vom Karteninstitut abgelehnt"
			};
		}
		if (tStatus === "CANCELLED") {
			opts.onPhase("cancelled", st.data);
			return {
				status: "cancelled",
				readerName: s.readerName,
				sumupTxId: tx.data?.txId ?? txId
			};
		}
		if (sawCardPrompt && st.ok && st.data?.online && st.data.state === "IDLE" && tStatus === "PENDING") {
			await sleep(800, opts.signal);
			continue;
		}
		await sleep(1100, opts.signal);
	}
	await sumupTerminateCheckout({ data: {
		...creds,
		readerId: s.readerId
	} }).catch(() => void 0);
	opts.onPhase("failed");
	return {
		status: "failed",
		readerName: s.readerName,
		error: "Zeitüberschreitung am Terminal"
	};
}
async function runSumupCheckout(opts) {
	if (isSumupLiveReady(opts.settings)) return runLiveCheckout(opts);
	return runDemoCheckout({
		amountCents: opts.amountCents,
		readerName: opts.settings.readerName || DEFAULT_SUMUP.readerName,
		signal: opts.signal,
		onPhase: opts.onPhase,
		gate: opts.demoGate
	});
}
//#endregion
export { runSumupCheckout as a, sumupPairReader as c, maskApiKey as i, sumupReaderStatus as l, createDemoGate as n, sumupDeleteReader as o, isSumupLiveReady as r, sumupListReaders as s, PHASE_COPY as t };
