/** @typedef {keyof typeof RESUME_FONTS} FontFamily */

export const RESUME_FONTS = {
	inter: {
		label: 'Inter',
		family: 'Resume Inter',
		file: '/fonts/Inter-Regular.woff2',
		weight: 400,
		fallback: 'Helvetica, Arial, sans-serif'
	},
	roboto: {
		label: 'Roboto',
		family: 'Resume Roboto',
		file: '/fonts/Roboto-Regular.woff2',
		weight: 400,
		fallback: 'Helvetica, Arial, sans-serif'
	},
	lato: {
		label: 'Lato',
		family: 'Resume Lato',
		file: '/fonts/Lato-Regular.woff2',
		weight: 400,
		fallback: 'Helvetica, Arial, sans-serif'
	},
	'open-sans': {
		label: 'Open Sans',
		family: 'Resume Open Sans',
		file: '/fonts/OpenSans-Regular.woff2',
		weight: 400,
		fallback: 'Helvetica, Arial, sans-serif'
	},
	montserrat: {
		label: 'Montserrat',
		family: 'Resume Montserrat',
		file: '/fonts/Montserrat-Regular.woff2',
		weight: 400,
		fallback: 'Helvetica, Arial, sans-serif'
	}
};

export const FONT_FAMILY_IDS = /** @type {FontFamily[]} */ (Object.keys(RESUME_FONTS));

/** @param {string | undefined} value */
export function normalizeFontFamily(value) {
	if (value && value in RESUME_FONTS) return /** @type {FontFamily} */ (value);
	return 'open-sans';
}

/** @param {FontFamily} id */
export function fontFamilyStack(id) {
	const font = RESUME_FONTS[id];
	return `'${font.family}', ${font.fallback}`;
}

/** @param {string} file */
function fontFormat(file) {
	if (file.endsWith('.woff2')) return 'woff2';
	if (file.endsWith('.woff')) return 'woff';
	if (file.endsWith('.ttf')) return 'truetype';
	return 'opentype';
}

/** @param {FontFamily} id @param {string} src */
export function fontFaceRule(id, src) {
	const font = RESUME_FONTS[id];
	const format = fontFormat(font.file);
	return `@font-face{font-family:"${font.family}";src:url("${src}") format("${format}");font-weight:${font.weight};font-style:normal;font-display:swap;}`;
}
