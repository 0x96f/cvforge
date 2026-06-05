<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */

	import SectionAccordion from '$lib/components/ui/SectionAccordion.svelte';
	import BulletList from '$lib/components/ui/BulletList.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import { FEATURED_SKILL_COUNT } from '$lib';

	/** @type {{
	 *   skills: ResumeData['skills'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { skills, config, update, updateSection } = $props();
</script>

<SectionAccordion title="Skills" {config} onchange={updateSection} showBulletToggle={false}>
	<div class="flex flex-col gap-6">
		<div>
			<h3 class="mb-3 text-sm font-semibold text-zinc-800">Featured skills (optional)</h3>
			<div class="flex flex-col gap-3">
				{#each skills.featured as skill, i (i)}
					<div
						class="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3"
					>
						<input
							class="min-w-[140px] flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
							placeholder="Skill name"
							value={skill.name}
							oninput={(e) => {
								const featured = [...skills.featured];
								featured[i] = { ...featured[i], name: e.currentTarget.value };
								update({ skills: { ...skills, featured } });
							}}
						/>
						<div class="flex gap-1" role="group" aria-label="Skill rating">
							{#each [1, 2, 3, 4, 5] as level (level)}
								<button
									type="button"
									title="Rate {level}"
									onclick={() => {
										const featured = [...skills.featured];
										featured[i] = {
											...featured[i],
											rating: skill.rating === level ? 0 : level
										};
										update({ skills: { ...skills, featured } });
									}}
									class="h-8 w-8"
								>
									<span
										class="block h-4 w-4 rounded-full transition {level <= skill.rating
											? 'bg-teal-600'
											: 'bg-zinc-300 hover:bg-zinc-400'}"
									></span>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-2 text-xs text-zinc-500">
				{FEATURED_SKILL_COUNT} rows · click dots to rate 1–5
			</p>
		</div>
		<Field label="Other skills">
			<BulletList
				bullets={skills.bullets}
				useBullets={false}
				onchange={(bullets) => update({ skills: { ...skills, bullets } })}
			/>
		</Field>
	</div>
</SectionAccordion>
