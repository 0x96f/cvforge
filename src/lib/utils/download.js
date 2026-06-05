/** @param {BlobPart} content @param {string} filename @param {string} mime */
export function downloadBlob(content, filename, mime) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

/** @param {string} text @param {string} filename @param {string} mime */
export function downloadText(text, filename, mime) {
	downloadBlob(text, filename, mime);
}

/** @param {string} name */
export function slugifyName(name) {
	const slug = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	return slug || 'resume';
}
