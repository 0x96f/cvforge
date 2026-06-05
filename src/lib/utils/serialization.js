import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { mergeResumeData } from './defaults.js';

/** @typedef {import('./types.js').ResumeData} ResumeData */

/** @param {unknown} parsed */
function isResumeLike(parsed) {
	return !!parsed && typeof parsed === 'object' && 'profile' in parsed;
}

/** @param {unknown} parsed */
function normalizeParsedResume(parsed) {
	if (!isResumeLike(parsed)) return null;
	return mergeResumeData(/** @type {Partial<ResumeData>} */ (parsed));
}

/** @param {string} raw */
export function parseResumeJson(raw) {
	try {
		return normalizeParsedResume(JSON.parse(raw));
	} catch {
		return null;
	}
}

/** @param {string} raw */
export function parseResumeYaml(raw) {
	try {
		return normalizeParsedResume(parseYaml(raw));
	} catch {
		return null;
	}
}

/** @param {string} raw @param {string} [filename] */
export function parseResumeFile(raw, filename = '') {
	const ext = filename.split('.').pop()?.toLowerCase();
	if (ext === 'yaml' || ext === 'yml') return parseResumeYaml(raw);
	if (ext === 'json') return parseResumeJson(raw);

	const trimmed = raw.trim();
	if (trimmed.startsWith('{') || trimmed.startsWith('[')) return parseResumeJson(raw);
	return parseResumeYaml(raw) ?? parseResumeJson(raw);
}

/** @param {ResumeData} data */
export function serializeResumeJson(data) {
	return JSON.stringify(data, null, 2);
}

/** @param {ResumeData} data */
export function serializeResumeYaml(data) {
	return stringifyYaml(data, { lineWidth: 0 });
}
