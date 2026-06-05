import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fontFaceRule, RESUME_FONTS } from './fonts.js';
import { renderResumeArticle } from './render-html.js';
import { PAGE_GOTENBERG, PAGE_PADDING } from './styles.js';

/** @typedef {import('./types.js').ResumeData} ResumeData */
/** @typedef {import('./fonts.js').FontFamily} FontFamily */

const DEFAULT_GOTENBERG_URL = 'http://gotenberg:3000';

/** @param {FontFamily} id */
function resumeFontFace(id) {
	const filename = RESUME_FONTS[id].file.replace(/^\/fonts\//, '');
	return fontFaceRule(id, filename);
}

/** @param {ResumeData} data */
function resumeToHtml(data) {
	const body = renderResumeArticle(data);
	const fontFace = resumeFontFace(data.settings.fontFamily);

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    ${fontFace}
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    article h2:first-of-type { margin-top: 0; }
    section > h2 {
      break-after: avoid;
      page-break-after: avoid;
    }
    article {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  ${body}
</body>
</html>`;
}

/** @param {FontFamily} id */
function readResumeFont(id) {
	const font = RESUME_FONTS[id];
	const filename = font.file.replace(/^\/fonts\//, '');
	const candidates = [
		path.join(process.cwd(), 'static', 'fonts', filename),
		path.join(process.cwd(), 'static', font.file.slice(1))
	];

	for (const filePath of candidates) {
		if (existsSync(filePath)) {
			return { bytes: readFileSync(filePath), filename };
		}
	}

	throw new Error(
		`Font not found: ${filename} (cwd=${process.cwd()}, tried ${candidates.join(', ')})`
	);
}

/** @param {ResumeData} data */
export async function resumeToPdf(data) {
	const gotenbergUrl = process.env.GOTENBERG_URL ?? DEFAULT_GOTENBERG_URL;
	const endpoint = `${gotenbergUrl.replace(/\/$/, '')}/forms/chromium/convert/html`;

	const html = resumeToHtml(data);
	const { bytes: fontBytes, filename: fontFilename } = readResumeFont(data.settings.fontFamily);
	const { paperWidth, paperHeight } = PAGE_GOTENBERG[data.settings.pageSize];

	const form = new FormData();
	form.append('files', new Blob([html], { type: 'text/html' }), 'index.html');
	form.append('files', new Blob([new Uint8Array(fontBytes)], { type: 'font/woff2' }), fontFilename);
	form.append('paperWidth', paperWidth);
	form.append('paperHeight', paperHeight);
	form.append('marginTop', PAGE_PADDING);
	form.append('marginRight', PAGE_PADDING);
	form.append('marginBottom', PAGE_PADDING);
	form.append('marginLeft', PAGE_PADDING);
	form.append('printBackground', 'true');

	const res = await fetch(endpoint, {
		method: 'POST',
		body: form
	});

	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		throw new Error(
			detail ? `Gotenberg PDF failed: ${detail}` : `Gotenberg PDF failed (${res.status})`
		);
	}

	return Buffer.from(await res.arrayBuffer());
}
