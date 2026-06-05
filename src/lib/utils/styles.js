/** @typedef {import('./fonts.js').FontFamily} FontFamily */

/** @typedef {'letter' | 'a4'} PageSize */

export const PAGE_GOTENBERG = {
	letter: { paperWidth: '8.5in', paperHeight: '11in' },
	a4: { paperWidth: '210mm', paperHeight: '297mm' }
};

/** PDF margin and preview padding - keep in sync. */
export const PAGE_PADDING = '0.5in';

export const PAGE_WIDTH = {
	letter: '8.5in',
	a4: '210mm'
};

export const PAGE_HEIGHT = {
	letter: '11in',
	a4: '297mm'
};
