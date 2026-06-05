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
		{ id: 'skills', title: 'Skills', visible: true, useBullets: false },
		{ id: 'custom', title: 'Additional', visible: false, useBullets: true }
	];
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

/** @param {Partial<ResumeData>} parsed */
export function mergeResumeData(parsed) {
	const defaults = createDefaultResume();
	return {
		...defaults,
		...parsed,
		settings: {
			...defaults.settings,
			...parsed.settings,
			fontFamily: normalizeFontFamily(parsed.settings?.fontFamily)
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
			pageSize: 'letter'
		}
	};
}
