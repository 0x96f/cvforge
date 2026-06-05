<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */

	import SectionAccordion from '$lib/components/ui/SectionAccordion.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import AddButton from '$lib/components/ui/AddButton.svelte';
	import RemoveButton from '$lib/components/ui/RemoveButton.svelte';
	import { emptyProject } from '$lib';

	/** @type {{
	 *   projects: ResumeData['projects'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { projects, config, update, updateSection } = $props();
</script>

<SectionAccordion title="Projects" {config} onchange={updateSection} showBulletToggle={false}>
	<div class="flex flex-col gap-8">
		{#each projects as project (project.id)}
			<div class="rounded-lg border border-zinc-100 p-4">
				<div class="mb-4 grid gap-4 sm:grid-cols-2">
					<Field label="Project name">
						<TextInput
							value={project.name}
							onchange={(name) =>
								update({
									projects: projects.map((p) => (p.id === project.id ? { ...p, name } : p))
								})}
						/>
					</Field>
					<Field label="Date">
						<TextInput
							value={project.date}
							onchange={(date) =>
								update({
									projects: projects.map((p) => (p.id === project.id ? { ...p, date } : p))
								})}
						/>
					</Field>
				</div>
				<Field label="Description">
					<TextArea
						value={project.description}
						onchange={(description) =>
							update({
								projects: projects.map((p) => (p.id === project.id ? { ...p, description } : p))
							})}
					/>
				</Field>
				<RemoveButton
					onClick={() => update({ projects: projects.filter((p) => p.id !== project.id) })}
					disabled={projects.length <= 1}
				/>
			</div>
		{/each}
		<AddButton
			section="project"
			onClick={() => update({ projects: [...projects, emptyProject()] })}
		/>
	</div>
</SectionAccordion>
