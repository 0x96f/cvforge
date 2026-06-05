import { orderedVisibleSections } from './defaults.js';
import { fontFamilyStack } from './fonts.js';

/** @typedef {import('./types.js').ResumeData} ResumeData */
/** @typedef {import('./types.js').SectionConfig} SectionConfig */
/** @typedef {import('./types.js').SectionId} SectionId */

/** @param {string[] | undefined} lines */
function flattenLines(lines) {
	return (lines ?? []).flatMap((line) =>
		line
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean)
	);
}

/** @param {ResumeData} data */
function contactFields(data) {
	return [
		{ label: 'Email', value: data.profile.email },
		{ label: 'Phone', value: data.profile.phone },
		{ label: 'Website', value: data.profile.website },
		{ label: 'Location', value: data.profile.location }
	]
		.map((field) => ({ ...field, value: field.value.trim() }))
		.filter((field) => field.value);
}

/** @param {number} rating */
function dotRating(rating) {
	const filled = Math.min(5, Math.max(0, Math.round(rating)));
	return '●'.repeat(filled) + '○'.repeat(5 - filled);
}

/** @param {string} text */
function esc(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** @param {string} url */
function formatHref(url) {
	const trimmed = url.trim();
	if (!trimmed) return '';
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	return `https://${trimmed}`;
}

const META_TEXT_STYLE = 'font-size:0.875em;font-style:italic;opacity:0.8';

const META_LINE_STYLE = `margin:0.25em 0;${META_TEXT_STYLE};display:flex;justify-content:space-between;gap:1em;align-items:baseline`;

/** @param {string} [website] */
function metaLink(website) {
	const websiteText = (website ?? '').trim();
	if (!websiteText) return '';

	return `<a href="${esc(formatHref(websiteText))}" style="color:inherit;text-decoration:none">${esc(websiteText)}</a>`;
}

/** @param {string} date @param {string} [website] */
function workMetaLine(date, website) {
	const dateText = date.trim();
	const link = metaLink(website);
	if (!dateText && !link) return '';

	const left = dateText ? `<span>${esc(dateText)}</span>` : '<span></span>';
	const right = link ? `<span style="flex-shrink:0">${link}</span>` : '';

	return `<p style="${META_LINE_STYLE}">${left}${right}</p>`;
}

/** @param {string} name @param {string} [website] */
function projectHeader(name, website) {
	const nameText = name.trim();
	if (!nameText) return '';

	const link = metaLink(website);
	if (!link) {
		return `<h3 style="margin:0;font-weight:600">${esc(nameText)}</h3>`;
	}

	return `<h3 style="margin:0;font-weight:600;display:flex;justify-content:space-between;gap:1em;align-items:baseline"><span>${esc(nameText)}</span><span style="flex-shrink:0;${META_TEXT_STYLE};font-weight:400">${link}</span></h3>`;
}

/** @param {string[] | undefined} lines @param {boolean} useBullets */
function bulletItems(lines, useBullets) {
	const items = flattenLines(lines);
	if (!items.length) return '';

	if (!useBullets) {
		return `<div style="display:flex;flex-direction:column;gap:0.5em">${items
			.map((item) => `<p style="margin:0">${esc(item)}</p>`)
			.join('')}</div>`;
	}

	const lis = items.map((item) => `<li>${esc(item)}</li>`).join('');
	return `<ul style="margin:0;padding-left:1.25rem;list-style-type:disc;display:flex;flex-direction:column;gap:0.25em">${lis}</ul>`;
}

/** @param {string} title @param {string} themeColor */
function sectionHeading(title, themeColor) {
	return `<h2 style="margin:1.5em 0 0.75em;padding-bottom:0.25em;border-bottom:1px solid ${esc(themeColor)};color:${esc(themeColor)};font-size:1.1em;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">${esc(title)}</h2>`;
}

/** @param {ResumeData} data @param {SectionConfig} config @param {string} themeColor */
function renderWork(data, config, themeColor) {
	const entries = data.work.filter((w) => w.company.trim() || w.title.trim());
	if (!entries.length) return '';

	const articles = entries
		.map((job) => {
			const header = [job.title, job.company]
				.filter((s) => s.trim())
				.map(esc)
				.join(' - ');
			const meta = workMetaLine(job.date, job.website);
			const bullets = bulletItems(job.bullets, config.useBullets);
			const bulletsBlock = bullets ? `<div style="margin-top:0.25em">${bullets}</div>` : '';
			return `<article><h3 style="margin:0;font-weight:600">${header}</h3>${meta}${bulletsBlock}</article>`;
		})
		.join('');

	return `<section>${sectionHeading(config.title, themeColor)}<div style="display:flex;flex-direction:column;gap:1em">${articles}</div></section>`;
}

/** @param {ResumeData} data @param {SectionConfig} config @param {string} themeColor */
function renderEducation(data, config, themeColor) {
	const entries = data.education.filter((e) => e.school.trim() || e.degree.trim());
	if (!entries.length) return '';

	const articles = entries
		.map((entry) => {
			const degree = [entry.degree, entry.gpa ? `GPA: ${entry.gpa}` : '']
				.filter((s) => s.trim())
				.join(' - ');
			const date = entry.date.trim()
				? `<p style="margin:0.25em 0 0;font-size:0.875em;font-style:italic;opacity:0.8">${esc(entry.date.trim())}</p>`
				: '';
			const degreeLine = degree ? `<p style="margin:0.25em 0 0">${esc(degree)}</p>` : '';
			const bullets = bulletItems(entry.bullets, config.useBullets);
			const bulletsBlock = bullets ? `<div style="margin-top:0.25em">${bullets}</div>` : '';
			return `<article><h3 style="margin:0;font-weight:600">${esc(entry.school.trim() || 'School')}</h3>${date}${degreeLine}${bulletsBlock}</article>`;
		})
		.join('');

	return `<section>${sectionHeading(config.title, themeColor)}<div style="display:flex;flex-direction:column;gap:1em">${articles}</div></section>`;
}

/** @param {string} text */
function descriptionBlock(text) {
	const trimmed = text.trim();
	if (!trimmed) return '';
	return `<p style="margin:0.25em 0 0">${esc(trimmed).replace(/\n/g, '<br />')}</p>`;
}

/** @param {ResumeData} data @param {SectionConfig} config @param {string} themeColor */
function renderProjects(data, config, themeColor) {
	const entries = data.projects.filter((p) => p.name.trim());
	if (!entries.length) return '';

	const articles = entries
		.map((project) => {
			const header = projectHeader(project.name, project.website);
			const date = project.date.trim()
				? `<p style="margin:0.25em 0 0;${META_TEXT_STYLE}">${esc(project.date.trim())}</p>`
				: '';
			const description = descriptionBlock(project.description);
			return `<article>${header}${date}${description}</article>`;
		})
		.join('');

	return `<section>${sectionHeading(config.title, themeColor)}<div style="display:flex;flex-direction:column;gap:1em">${articles}</div></section>`;
}

/** @param {{ name: string, date: string, description: string }[]} entries @param {SectionConfig} config @param {string} themeColor */
function renderNameDateDescriptionSection(entries, config, themeColor) {
	if (!entries.length) return '';

	const articles = entries
		.map((entry) => {
			const date = entry.date.trim()
				? `<p style="margin:0.25em 0 0;${META_TEXT_STYLE}">${esc(entry.date.trim())}</p>`
				: '';
			const description = descriptionBlock(entry.description);
			return `<article><h3 style="margin:0;font-weight:600">${esc(entry.name.trim())}</h3>${date}${description}</article>`;
		})
		.join('');

	return `<section>${sectionHeading(config.title, themeColor)}<div style="display:flex;flex-direction:column;gap:1em">${articles}</div></section>`;
}

/** @param {ResumeData} data @param {SectionConfig} config @param {string} themeColor */
function renderCertificates(data, config, themeColor) {
	const entries = data.certificates.filter((c) => c.name.trim());
	return renderNameDateDescriptionSection(entries, config, themeColor);
}

/** @param {ResumeData} data @param {SectionConfig} config @param {string} themeColor */
function renderAchievements(data, config, themeColor) {
	const entries = (data.achievements ?? []).filter((a) => a.name.trim());
	return renderNameDateDescriptionSection(entries, config, themeColor);
}

/** @param {string} title @param {string} themeColor */
function columnHeading(title, themeColor) {
	return `<h3 style="margin:0 0 0.5em;font-size:0.9em;font-weight:600;color:${esc(themeColor)}">${esc(title)}</h3>`;
}

/** @param {ResumeData} data @param {SectionConfig} config @param {string} themeColor */
function renderSkills(data, config, themeColor) {
	const featured = data.skills.featured.filter((s) => s.name.trim());
	const items = flattenLines(data.skills.bullets);
	if (!featured.length && !items.length) return '';

	const featuredHtml = featured.length
		? `<div style="display:flex;flex-direction:column;gap:0.25em">${featured
				.map(
					(skill) =>
						`<div style="display:flex;align-items:baseline;justify-content:space-between;gap:1em"><span>${esc(skill.name.trim())}</span><span style="flex-shrink:0;font-size:0.875em;letter-spacing:0.1em;opacity:0.7">${dotRating(skill.rating)}</span></div>`
				)
				.join('')}</div>`
		: '';

	const listHtml = items.length
		? `<div style="display:flex;flex-direction:column;gap:0.25em">${items
				.map((item) => `<p style="margin:0">${esc(item)}</p>`)
				.join('')}</div>`
		: '';

	const columns = [];
	if (featuredHtml) {
		const heading = columnHeading('Featured', themeColor);
		columns.push(`<div style="flex:1;min-width:0">${heading}${featuredHtml}</div>`);
	}
	if (listHtml) {
		const heading = featuredHtml ? columnHeading('Other skills', themeColor) : '';
		columns.push(`<div style="flex:1;min-width:0">${heading}${listHtml}</div>`);
	}

	const body =
		columns.length === 2
			? `<div style="display:flex;gap:2em;align-items:flex-start">${columns.join('')}</div>`
			: columns.join('');

	return `<section>${sectionHeading(config.title, themeColor)}${body}</section>`;
}

/** @param {ResumeData} data @param {SectionConfig} config @param {string} themeColor */
function renderCustom(data, config, themeColor) {
	const items = flattenLines(data.custom.bullets);
	if (!items.length) return '';

	const bulletsHtml = bulletItems(data.custom.bullets, config.useBullets);
	return `<section>${sectionHeading(config.title, themeColor)}${bulletsHtml}</section>`;
}

/** @type {Record<SectionId, (data: ResumeData, config: SectionConfig, themeColor: string) => string>} */
const RENDERERS = {
	work: renderWork,
	education: renderEducation,
	projects: renderProjects,
	certificates: renderCertificates,
	achievements: renderAchievements,
	skills: renderSkills,
	custom: renderCustom
};

/** @param {ResumeData} data */
export function renderResumeArticle(data) {
	const { settings } = data;
	const contact = contactFields(data);

	const parts = [
		`<article style="font-family:${fontFamilyStack(settings.fontFamily)};font-size:${settings.fontSize}pt;line-height:1.45;color:#18181b">`
	];

	if (data.profile.name.trim()) {
		parts.push(
			`<h1 style="margin:0 0 0.5em;font-size:1.85em;font-weight:700;color:${esc(settings.themeColor)}">${esc(data.profile.name.trim())}</h1>`
		);
	}

	if (contact.length) {
		const contactHtml = contact
			.map(
				(field) =>
					`<div><span style="font-weight:600">${esc(field.label)}:</span> ${esc(field.value)}</div>`
			)
			.join('');
		parts.push(
			`<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.25rem 1rem;margin:0 0 0.75em;font-size:0.875em;opacity:0.8">${contactHtml}</div>`
		);
	}

	if (data.profile.objective.trim()) {
		parts.push(`<p style="margin:1em 0">${esc(data.profile.objective.trim())}</p>`);
	}

	for (const config of orderedVisibleSections(data)) {
		const render = RENDERERS[config.id];
		if (render) {
			parts.push(render(data, config, settings.themeColor));
		}
	}

	parts.push('</article>');
	return parts.join('');
}
