import { json } from '@sveltejs/kit';
import { resumeToPdf } from '$lib/utils/pdf.js';

export const prerender = false;

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let data;
	try {
		data = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	if (!data?.settings || !data?.sections) {
		return json({ error: 'Resume data is required' }, { status: 400 });
	}

	try {
		const pdfBytes = await resumeToPdf(data);
		const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
		return json({ pdfBase64 });
	} catch (error) {
		return json(
			{
				error: error instanceof Error ? error.message : 'PDF generation failed'
			},
			{ status: 500 }
		);
	}
}
