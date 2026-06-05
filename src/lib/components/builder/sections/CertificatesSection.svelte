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
	import { emptyCertificate } from '$lib';

	/** @type {{
	 *   certificates: ResumeData['certificates'],
	 *   config: SectionConfig,
	 *   update: (patch: Partial<ResumeData>) => void,
	 *   updateSection: (config: SectionConfig) => void
	 * }} */
	let { certificates, config, update, updateSection } = $props();
</script>

<SectionAccordion title="Certificates" {config} onchange={updateSection} showBulletToggle={false}>
	<div class="flex flex-col gap-8">
		{#each certificates as certificate (certificate.id)}
			<div class="rounded-lg border border-zinc-100 p-4">
				<div class="mb-4 grid gap-4 sm:grid-cols-2">
					<Field label="Certificate name">
						<TextInput
							value={certificate.name}
							onchange={(name) =>
								update({
									certificates: certificates.map((c) =>
										c.id === certificate.id ? { ...c, name } : c
									)
								})}
						/>
					</Field>
					<Field label="Date">
						<TextInput
							value={certificate.date}
							onchange={(date) =>
								update({
									certificates: certificates.map((c) =>
										c.id === certificate.id ? { ...c, date } : c
									)
								})}
						/>
					</Field>
				</div>
				<Field label="Description">
					<TextArea
						value={certificate.description}
						onchange={(description) =>
							update({
								certificates: certificates.map((c) =>
									c.id === certificate.id ? { ...c, description } : c
								)
							})}
					/>
				</Field>
				<RemoveButton
					onClick={() =>
						update({ certificates: certificates.filter((c) => c.id !== certificate.id) })}
					disabled={certificates.length <= 1}
				/>
			</div>
		{/each}
		<AddButton
			section="certificate"
			onClick={() => update({ certificates: [...certificates, emptyCertificate()] })}
		/>
	</div>
</SectionAccordion>
