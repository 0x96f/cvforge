/** @typedef {import('./types.js').ResumeData} ResumeData */

/**
 * @typedef {{ pdfBase64: string }} ExportPdfSuccess
 * @typedef {{ error: string }} ExportPdfError
 * @typedef {ExportPdfSuccess | ExportPdfError} ExportPdfResult
 */

/** @param {ResumeData} data */
export async function exportResumePdf(data) {
	if (!data?.settings || !data?.sections) {
		return { error: 'Resume data is required' };
	}

	try {
		const res = await fetch('/api/export-pdf', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		/** @type {ExportPdfResult} */
		const result = await res.json();

		if (!res.ok && 'error' in result) {
			return result;
		}

		return result;
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'PDF generation failed'
		};
	}
}
