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
	import { emptyAchievement } from '$lib';

	/** @type {{
	 *   achievements: ResumeData['achievements'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { achievements, config, update, updateSection } = $props();
</script>

<SectionAccordion title="Achievements" {config} onchange={updateSection} showBulletToggle={false}>
	<div class="flex flex-col gap-8">
		{#each achievements as achievement (achievement.id)}
			<div class="rounded-lg border border-zinc-100 p-4">
				<div class="mb-4 grid gap-4 sm:grid-cols-2">
					<Field label="Achievement name">
						<TextInput
							value={achievement.name}
							onchange={(name) =>
								update({
									achievements: achievements.map((a) =>
										a.id === achievement.id ? { ...a, name } : a
									)
								})}
						/>
					</Field>
					<Field label="Date">
						<TextInput
							value={achievement.date}
							onchange={(date) =>
								update({
									achievements: achievements.map((a) =>
										a.id === achievement.id ? { ...a, date } : a
									)
								})}
						/>
					</Field>
				</div>
				<Field label="Description">
					<TextArea
						value={achievement.description}
						onchange={(description) =>
							update({
								achievements: achievements.map((a) =>
									a.id === achievement.id ? { ...a, description } : a
								)
							})}
					/>
				</Field>
				<RemoveButton
					onClick={() =>
						update({ achievements: achievements.filter((a) => a.id !== achievement.id) })}
					disabled={achievements.length <= 1}
				/>
			</div>
		{/each}
		<AddButton
			section="achievement"
			onClick={() => update({ achievements: [...achievements, emptyAchievement()] })}
		/>
	</div>
</SectionAccordion>
