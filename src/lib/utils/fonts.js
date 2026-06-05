/** @typedef {keyof typeof RESUME_FONTS} FontFamily */

/** @typedef {{ label: string, family: string, file: string, italicFile: string, fallback: string }} ResumeFont */

export const RESUME_FONTS = /** @type {Record<string, ResumeFont>} */ ({
	inter: {
		label: 'Inter',
		family: 'Resume Inter',
		file: '/fonts/Inter-VariableFont_opsz,wght.woff2',
		italicFile: '/fonts/Inter-Italic-VariableFont_opsz,wght.woff2',
		fallback: 'Helvetica, Arial, sans-serif'
	},
	roboto: {
		label: 'Roboto',
		family: 'Resume Roboto',
		file: '/fonts/Roboto-VariableFont_wdth,wght.woff2',
		italicFile: '/fonts/Roboto-Italic-VariableFont_wdth,wght.woff2',
		fallback: 'Helvetica, Arial, sans-serif'
	},
	'open-sans': {
		label: 'Open Sans',
		family: 'Resume Open Sans',
		file: '/fonts/OpenSans-VariableFont_wdth,wght.woff2',
		italicFile: '/fonts/OpenSans-Italic-VariableFont_wdth,wght.woff2',
		fallback: 'Helvetica, Arial, sans-serif'
	},
	montserrat: {
		label: 'Montserrat',
		family: 'Resume Montserrat',
		file: '/fonts/Montserrat-VariableFont_wght.woff2',
		italicFile: '/fonts/Montserrat-Italic-VariableFont_wght.woff2',
		fallback: 'Helvetica, Arial, sans-serif'
	},
	geist: {
		label: 'Geist',
		family: 'Resume Geist',
		file: '/fonts/Geist-VariableFont_wght.woff2',
		italicFile: '/fonts/Geist-Italic-VariableFont_wght.woff2',
		fallback: 'Helvetica, Arial, sans-serif'
	},
	'work-sans': {
		label: 'Work Sans',
		family: 'Resume Work Sans',
		file: '/fonts/WorkSans-VariableFont_wght.woff2',
		italicFile: '/fonts/WorkSans-Italic-VariableFont_wght.woff2',
		fallback: 'Helvetica, Arial, sans-serif'
	}
});

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

/** @param {ResumeFont} font @param {string} src @param {'normal' | 'italic'} style */
function singleFontFaceRule(font, src, style) {
	const file = style === 'italic' ? font.italicFile : font.file;
	const format = fontFormat(file);
	return `@font-face{font-family:"${font.family}";src:url("${src}") format("${format}");font-weight:100 900;font-style:${style};font-display:swap;}`;
}

/** @param {FontFamily} id @param {(file: string) => string} srcFor */
export function fontFaceRules(id, srcFor) {
	const font = RESUME_FONTS[id];
	return [
		singleFontFaceRule(font, srcFor(font.file), 'normal'),
		singleFontFaceRule(font, srcFor(font.italicFile), 'italic')
	].join('');
}

/** @param {FontFamily} id @param {string} src */
export function fontFaceRule(id, src) {
	return fontFaceRules(id, () => src);
}

/** @param {FontFamily} id */
export function resumeFontFiles(id) {
	const font = RESUME_FONTS[id];
	return [font.file, font.italicFile];
}
