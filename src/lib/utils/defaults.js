import { normalizeFontFamily } from './fonts.js';

/** @typedef {import('./types.js').ResumeData} ResumeData */

export const FEATURED_SKILL_COUNT = 6;

export function newId() {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyFeaturedSkills() {
	return Array.from({ length: FEATURED_SKILL_COUNT }, () => ({
		name: '',
		rating: 0
	}));
}

/** @returns {import('./types.js').SectionConfig[]} */
export function defaultSections() {
	return [
		{ id: 'work', title: 'Work Experience', visible: true, useBullets: true },
		{ id: 'education', title: 'Education', visible: true, useBullets: true },
		{ id: 'projects', title: 'Projects', visible: true, useBullets: false },
		{ id: 'certificates', title: 'Certificates', visible: true, useBullets: false },
		{ id: 'achievements', title: 'Achievements', visible: true, useBullets: false },
		{ id: 'skills', title: 'Skills', visible: true, useBullets: false },
		{ id: 'custom', title: 'Additional', visible: false, useBullets: true }
	];
}

/** @returns {import('./types.js').SectionId[]} */
export function defaultSectionOrder() {
	return defaultSections()
		.filter((section) => section.visible)
		.map((section) => section.id);
}

/** Fixed section order for the builder form. */
export const FORM_SECTION_ORDER = defaultSections().map((section) => section.id);

/** @param {import('./types.js').SectionId[] | undefined} sectionOrder @param {import('./types.js').SectionConfig[]} sections */
function syncSectionOrder(sectionOrder, sections) {
	const visibleIds = sections.filter((section) => section.visible).map((section) => section.id);
	const visibleSet = new Set(visibleIds);
	const known = new Set(FORM_SECTION_ORDER);

	const ordered = (sectionOrder ?? []).filter((id) => known.has(id) && visibleSet.has(id));
	const missing = visibleIds.filter((id) => !ordered.includes(id));
	return [...ordered, ...missing];
}

/** @param {ResumeData} data @returns {import('./types.js').SectionConfig[]} */
export function orderedVisibleSections(data) {
	const byId = new Map(data.sections.map((section) => [section.id, section]));
	/** @type {import('./types.js').SectionConfig[]} */
	const ordered = [];

	for (const id of data.settings.sectionOrder) {
		const section = byId.get(id);
		if (section?.visible) ordered.push(section);
	}

	return ordered;
}

export function emptyWork() {
	return { id: newId(), company: '', website: '', title: '', date: '', bullets: [''] };
}

export function emptyEducation() {
	return { id: newId(), school: '', date: '', degree: '', gpa: '', bullets: [] };
}

export function emptyProject() {
	return { id: newId(), name: '', website: '', date: '', description: '' };
}

export function emptyCertificate() {
	return { id: newId(), name: '', date: '', description: '' };
}

export function emptyAchievement() {
	return { id: newId(), name: '', date: '', description: '' };
}

/** @param {import('./types.js').SectionConfig[] | undefined} parsedSections */
function mergeSections(parsedSections) {
	const defaults = defaultSections();
	if (!parsedSections?.length) return defaults;

	const parsedById = new Map(parsedSections.map((section) => [section.id, section]));
	return defaults.map((section) => parsedById.get(section.id) ?? section);
}

/** @param {Partial<ResumeData>} parsed */
export function mergeResumeData(parsed) {
	const defaults = createDefaultResume();
	const sections = mergeSections(parsed.sections);
	return {
		...defaults,
		...parsed,
		achievements: parsed.achievements ?? defaults.achievements,
		sections,
		settings: {
			...defaults.settings,
			...parsed.settings,
			fontFamily: normalizeFontFamily(parsed.settings?.fontFamily),
			sectionOrder: syncSectionOrder(parsed.settings?.sectionOrder, sections)
		}
	};
}

/** @returns {ResumeData} */
export function createDefaultResume() {
	return {
		profile: {
			name: '',
			objective: '',
			email: '',
			phone: '',
			website: '',
			location: ''
		},
		work: [emptyWork()],
		education: [emptyEducation()],
		projects: [emptyProject()],
		certificates: [emptyCertificate()],
		achievements: [emptyAchievement()],
		skills: {
			bullets: [''],
			featured: emptyFeaturedSkills()
		},
		custom: {
			bullets: ['']
		},
		sections: defaultSections(),
		settings: {
			themeColor: '#009090',
			fontFamily: 'open-sans',
			fontSize: 11,
			pageSize: 'letter',
			sectionOrder: defaultSectionOrder()
		}
	};
}
