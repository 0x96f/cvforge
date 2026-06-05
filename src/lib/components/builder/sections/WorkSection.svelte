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
	import { emptyWork } from '$lib';

	/** @type {{
	 *   work: ResumeData['work'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { work, config, update, updateSection } = $props();
</script>

<SectionAccordion title="Work Experience" {config} onchange={updateSection}>
	<div class="flex flex-col gap-8">
		{#each work as job (job.id)}
			<div class="rounded-lg border border-zinc-100 p-4">
				<div class="mb-4 grid gap-4 sm:grid-cols-2">
					<Field label="Company">
						<TextInput
							value={job.company}
							onchange={(company) =>
								update({
									work: work.map((w) => (w.id === job.id ? { ...w, company } : w))
								})}
						/>
					</Field>
					<Field label="Date">
						<TextInput
							value={job.date}
							onchange={(date) =>
								update({
									work: work.map((w) => (w.id === job.id ? { ...w, date } : w))
								})}
							placeholder="Jan 2022 – Present"
						/>
					</Field>
					<Field label="Job title" class="sm:col-span-2">
						<TextInput
							value={job.title}
							onchange={(title) =>
								update({
									work: work.map((w) => (w.id === job.id ? { ...w, title } : w))
								})}
						/>
					</Field>
				</div>
				<Field label="Description">
					<BulletList
						bullets={job.bullets}
						useBullets={config.useBullets}
						onchange={(bullets) =>
							update({
								work: work.map((w) => (w.id === job.id ? { ...w, bullets } : w))
							})}
					/>
				</Field>
				<RemoveButton
					onClick={() => update({ work: work.filter((w) => w.id !== job.id) })}
					disabled={work.length <= 1}
				/>
			</div>
		{/each}
		<AddButton section="job" onClick={() => update({ work: [...work, emptyWork()] })} />
	</div>
</SectionAccordion>
