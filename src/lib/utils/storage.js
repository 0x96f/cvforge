import { DEK_STORAGE_KEY, STORAGE_KEY } from './consts.js';
import { env } from '$env/dynamic/public';
import { createDefaultResume } from './defaults.js';
import { normalizeFontFamily } from './fonts.js';

/** @typedef {import('./types.js').ResumeData} ResumeData */

// --- encryption ---

const ALGORITHM = 'AES-GCM';
const IV_BYTES = 12;
const PBKDF2_ITERATIONS = 100_000;
const KEK_SALT = 'cvfrg:kek:v1';

/** @type {CryptoKey | null} */
let cachedDek = null;

function getPepper() {
	return env.PUBLIC_STORAGE_ENCRYPTION_KEY ?? 'cvfrg-dev-pepper-OEcjM1AVn8AyWI7DRq';
}

/** @param {Uint8Array} bytes */
function bufferToBase64(bytes) {
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary);
}

/** @param {string} b64 */
function base64ToBuffer(b64) {
	const binary = atob(b64);
	const buffer = new ArrayBuffer(binary.length);
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

/**
 * @param {Uint8Array} iv
 * @param {ArrayBuffer} ciphertext
 */
function encodePayload(iv, ciphertext) {
	const envelope = {
		v: 1,
		iv: bufferToBase64(iv),
		data: bufferToBase64(new Uint8Array(ciphertext))
	};
	return JSON.stringify(envelope);
}

/** @param {string} raw */
function decodePayload(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (parsed.v !== 1 || !parsed.iv || !parsed.data) return null;
		return {
			iv: base64ToBuffer(parsed.iv),
			data: base64ToBuffer(parsed.data)
		};
	} catch {
		return null;
	}
}

async function deriveKek() {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		enc.encode(getPepper()),
		'PBKDF2',
		false,
		['deriveKey']
	);
	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: enc.encode(KEK_SALT),
			iterations: PBKDF2_ITERATIONS,
			hash: 'SHA-256'
		},
		keyMaterial,
		{ name: ALGORITHM, length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

async function generateDek() {
	return crypto.subtle.generateKey({ name: ALGORITHM, length: 256 }, true, ['encrypt', 'decrypt']);
}

/** @param {CryptoKey} key @param {string} plaintext */
async function encryptWithKey(key, plaintext) {
	const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
	const ciphertext = await crypto.subtle.encrypt(
		{ name: ALGORITHM, iv },
		key,
		new TextEncoder().encode(plaintext)
	);
	return encodePayload(iv, ciphertext);
}

/** @param {CryptoKey} key @param {string} payload */
async function decryptWithKey(key, payload) {
	const parsed = decodePayload(payload);
	if (!parsed) return null;
	try {
		const plaintext = await crypto.subtle.decrypt(
			{ name: ALGORITHM, iv: parsed.iv },
			key,
			parsed.data
		);
		return new TextDecoder().decode(plaintext);
	} catch {
		return null;
	}
}

/** @param {CryptoKey} dek */
async function persistDek(dek) {
	const kek = await deriveKek();
	const raw = await crypto.subtle.exportKey('raw', dek);
	const payload = await encryptWithKey(kek, bufferToBase64(new Uint8Array(raw)));
	localStorage.setItem(DEK_STORAGE_KEY, payload);
}

async function loadOrCreateDek() {
	if (cachedDek) return cachedDek;

	const stored = localStorage.getItem(DEK_STORAGE_KEY);
	const kek = await deriveKek();

	if (stored) {
		const rawB64 = await decryptWithKey(kek, stored);
		if (rawB64) {
			cachedDek = await crypto.subtle.importKey(
				'raw',
				base64ToBuffer(rawB64),
				{ name: ALGORITHM, length: 256 },
				false,
				['encrypt', 'decrypt']
			);
			return cachedDek;
		}
	}

	cachedDek = await generateDek();
	await persistDek(cachedDek);
	return cachedDek;
}

/** @param {string} plaintext */
async function encryptStorage(plaintext) {
	const dek = await loadOrCreateDek();
	return encryptWithKey(dek, plaintext);
}

/** @param {string} payload */
async function decryptStorage(payload) {
	const dek = await loadOrCreateDek();
	return decryptWithKey(dek, payload);
}

function resetCachedDek() {
	cachedDek = null;
}

// --- persistence ---

/** @param {Partial<ResumeData>} parsed */
function mergeResumeData(parsed) {
	const defaults = createDefaultResume();
	return {
		...defaults,
		...parsed,
		settings: {
			...defaults.settings,
			...parsed.settings,
			fontFamily: normalizeFontFamily(parsed.settings?.fontFamily)
		}
	};
}

export function hasStoredResume() {
	if (typeof window === 'undefined') return false;
	return localStorage.getItem(STORAGE_KEY) !== null;
}

export async function loadResume() {
	if (typeof window === 'undefined') return createDefaultResume();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return createDefaultResume();

		const decrypted = await decryptStorage(raw);
		if (!decrypted) return createDefaultResume();
		return mergeResumeData(JSON.parse(decrypted));
	} catch {
		return createDefaultResume();
	}
}

/** @param {ResumeData} data */
export async function saveResume(data) {
	if (typeof window === 'undefined') return;
	const payload = await encryptStorage(JSON.stringify(data));
	localStorage.setItem(STORAGE_KEY, payload);
}

export function clearResume() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(STORAGE_KEY);
	localStorage.removeItem(DEK_STORAGE_KEY);
	resetCachedDek();
}

/** @param {string} raw */
export function parseResumeJson(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object') return null;
		return mergeResumeData(parsed);
	} catch {
		return null;
	}
}

/** @param {ResumeData} data */
export async function importResume(data) {
	await saveResume(data);
}
