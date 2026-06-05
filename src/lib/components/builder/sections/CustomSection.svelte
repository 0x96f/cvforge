<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */

	import SectionAccordion from '$lib/components/ui/SectionAccordion.svelte';
	import BulletList from '$lib/components/ui/BulletList.svelte';

	/** @type {{
	 *   custom: ResumeData['custom'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { custom, config, update, updateSection } = $props();
</script>

<SectionAccordion title="Custom section" {config} onchange={updateSection}>
	<p class="mb-4 text-sm text-zinc-500">
		Hidden by default. Click "Show section" to edit and include it in exports.
	</p>
	<BulletList
		bullets={custom.bullets}
		useBullets={config.useBullets}
		onchange={(bullets) => update({ custom: { bullets } })}
	/>
</SectionAccordion>
