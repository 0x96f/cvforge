/**
 * @typedef {'work' | 'education' | 'projects' | 'certificates' | 'achievements' | 'skills' | 'custom'} SectionId
 * @typedef {import('./fonts.js').FontFamily} FontFamily
 * @typedef {'letter' | 'a4'} PageSize
 *
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} objective
 * @property {string} email
 * @property {string} phone
 * @property {string} website
 * @property {string} location
 *
 * @typedef {Object} WorkEntry
 * @property {string} id
 * @property {string} company
 * @property {string} website
 * @property {string} title
 * @property {string} date
 * @property {string[]} bullets
 *
 * @typedef {Object} EducationEntry
 * @property {string} id
 * @property {string} school
 * @property {string} date
 * @property {string} degree
 * @property {string} gpa
 * @property {string[]} bullets
 *
 * @typedef {Object} ProjectEntry
 * @property {string} id
 * @property {string} name
 * @property {string} website
 * @property {string} date
 * @property {string} description
 *
 * @typedef {Object} CertificateEntry
 * @property {string} id
 * @property {string} name
 * @property {string} date
 * @property {string} description
 *
 * @typedef {Object} AchievementEntry
 * @property {string} id
 * @property {string} name
 * @property {string} date
 * @property {string} description
 *
 * @typedef {Object} FeaturedSkill
 * @property {string} name
 * @property {number} rating
 *
 * @typedef {Object} SectionConfig
 * @property {SectionId} id
 * @property {string} title
 * @property {boolean} visible
 * @property {boolean} useBullets
 *
 * @typedef {Object} ResumeSettings
 * @property {string} themeColor
 * @property {FontFamily} fontFamily
 * @property {number} fontSize
 * @property {PageSize} pageSize
 * @property {SectionId[]} sectionOrder
 *
 * @typedef {Object} ResumeData
 * @property {Profile} profile
 * @property {WorkEntry[]} work
 * @property {EducationEntry[]} education
 * @property {ProjectEntry[]} projects
 * @property {CertificateEntry[]} certificates
 * @property {AchievementEntry[]} achievements
 * @property {{ bullets: string[], featured: FeaturedSkill[] }} skills
 * @property {{ bullets: string[] }} custom
 * @property {SectionConfig[]} sections
 * @property {ResumeSettings} settings
 */

export {};
