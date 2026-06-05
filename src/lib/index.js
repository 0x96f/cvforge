export * from './utils/consts.js';
export * from './utils/download.js';

export {
	FEATURED_SKILL_COUNT,
	newId,
	emptyFeaturedSkills,
	defaultSections,
	emptyWork,
	emptyEducation,
	emptyProject,
	emptyCertificate,
	createDefaultResume,
	mergeResumeData
} from './utils/defaults.js';

export {
	RESUME_FONTS,
	FONT_FAMILY_IDS,
	normalizeFontFamily,
	fontFamilyStack,
	fontFaceRule,
	fontFaceRules,
	resumeFontFiles
} from './utils/fonts.js';

export { PAGE_GOTENBERG, PAGE_PADDING, PAGE_WIDTH, PAGE_HEIGHT } from './utils/styles.js';

export {
	hasStoredResume,
	loadResume,
	saveResume,
	clearResume,
	importResume
} from './utils/storage.js';

export {
	parseResumeJson,
	parseResumeYaml,
	parseResumeFile,
	serializeResumeJson,
	serializeResumeYaml
} from './utils/serialization.js';

export { renderResumeArticle } from './utils/render-html.js';
export { exportResumePdf } from './utils/export-pdf.js';
