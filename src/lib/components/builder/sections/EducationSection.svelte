<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */

	import SectionAccordion from '$lib/components/ui/SectionAccordion.svelte';
	import BulletList from '$lib/components/ui/BulletList.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import AddButton from '$lib/components/ui/AddButton.svelte';
	import RemoveButton from '$lib/components/ui/RemoveButton.svelte';
	import { emptyEducation } from '$lib';

	/** @type {{
	 *   education: ResumeData['education'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { education, config, update, updateSection } = $props();
</script>

<SectionAccordion title="Education" {config} onchange={updateSection}>
	<div class="flex flex-col gap-8">
		{#each education as entry (entry.id)}
			<div class="rounded-lg border border-zinc-100 p-4">
				<div class="mb-4 grid gap-4 sm:grid-cols-2">
					<Field label="School">
						<TextInput
							value={entry.school}
							onchange={(school) =>
								update({
									education: education.map((e) => (e.id === entry.id ? { ...e, school } : e))
								})}
						/>
					</Field>
					<Field label="Date">
						<TextInput
							value={entry.date}
							onchange={(date) =>
								update({
									education: education.map((e) => (e.id === entry.id ? { ...e, date } : e))
								})}
						/>
					</Field>
					<Field label="Degree & major">
						<TextInput
							value={entry.degree}
							onchange={(degree) =>
								update({
									education: education.map((e) => (e.id === entry.id ? { ...e, degree } : e))
								})}
						/>
					</Field>
					<Field label="GPA">
						<TextInput
							value={entry.gpa}
							onchange={(gpa) =>
								update({
									education: education.map((e) => (e.id === entry.id ? { ...e, gpa } : e))
								})}
						/>
					</Field>
				</div>
				<Field label="Additional info (optional)">
					<BulletList
						bullets={entry.bullets.length ? entry.bullets : ['']}
						useBullets={config.useBullets}
						onchange={(bullets) =>
							update({
								education: education.map((e) => (e.id === entry.id ? { ...e, bullets } : e))
							})}
					/>
				</Field>
				<RemoveButton
					onClick={() => update({ education: education.filter((e) => e.id !== entry.id) })}
					disabled={education.length <= 1}
				/>
			</div>
		{/each}
		<AddButton
			section="school"
			onClick={() => update({ education: [...education, emptyEducation()] })}
		/>
	</div>
</SectionAccordion>
