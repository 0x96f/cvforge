<script>
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */
	/** @typedef {import('$lib/types.js').SkillCategory} SkillCategory */

	import SectionAccordion from '$lib/components/ui/SectionAccordion.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import AddButton from '$lib/components/ui/AddButton.svelte';
	import RemoveButton from '$lib/components/ui/RemoveButton.svelte';
	import { emptySkillCategory } from '$lib';

	/** @type {{
	 *   skills: ResumeData['skills'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { skills, config, update, updateSection } = $props();

	/** @param {string} id @param {Partial<SkillCategory>} patch */
	function updateCategory(id, patch) {
		update({
			skills: {
				categories: skills.categories.map((category) =>
					category.id === id ? { ...category, ...patch } : category
				)
			}
		});
	}

	/** @param {string} id */
	function nameChange(id) {
		return (/** @type {string} */ name) => updateCategory(id, { name });
	}

	/** @param {string} id */
	function skillsChange(id) {
		return (/** @type {string} */ text) => updateCategory(id, { skills: text.split('\n') });
	}
</script>

<SectionAccordion title="Skills" {config} onchange={updateSection} showBulletToggle={false}>
	<div class="flex flex-col gap-6">
		<p class="text-sm text-zinc-500">
			Group your skills into categories, such as Languages, Frameworks, or Tools.
		</p>
		{#each skills.categories as category (category.id)}
			<div class="flex flex-col gap-4 rounded-lg border border-zinc-100 p-4">
				<Field label="Category name">
					<TextInput
						value={category.name}
						placeholder="e.g. Languages"
						onchange={nameChange(category.id)}
					/>
				</Field>
				<Field label="Skills">
					<TextArea
						value={category.skills.join('\n')}
						placeholder="e.g. JavaScript, Python, Go"
						onchange={skillsChange(category.id)}
					/>
				</Field>
				<RemoveButton
					onClick={() =>
						update({
							skills: { categories: skills.categories.filter((item) => item.id !== category.id) }
						})}
				/>
			</div>
		{/each}
		<AddButton
			section="category"
			onClick={() =>
				update({ skills: { categories: [...skills.categories, emptySkillCategory()] } })}
		/>
	</div>
</SectionAccordion>
