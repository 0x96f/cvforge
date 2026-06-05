<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */
	/** @typedef {import('$lib/types.js').SectionId} SectionId */

	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { FONT_FAMILY_IDS, RESUME_FONTS, normalizeFontFamily } from '$lib';

	/** @type {{
	 *   settings: ResumeData['settings'],
	 *   sections: ResumeData['sections'],
	 *   updateSettings: (patch: Partial<ResumeData['settings']>) => void
	 * }} */
	let { settings, sections, updateSettings } = $props();

	let visibleSectionOrder = $derived(
		settings.sectionOrder.filter((id) => sections.find((section) => section.id === id)?.visible)
	);

	/** @param {SectionId} id */
	function sectionTitle(id) {
		return sections.find((section) => section.id === id)?.title ?? id;
	}

	/** @param {number} index @param {number} delta */
	function moveSection(index, delta) {
		const order = [...visibleSectionOrder];
		const next = index + delta;
		if (next < 0 || next >= order.length) return;
		[order[index], order[next]] = [order[next], order[index]];
		updateSettings({ sectionOrder: order });
	}
</script>

<section class="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
	<h2 class="mb-4 text-lg font-semibold text-zinc-900">Resume settings</h2>
	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Theme color">
			<div class="flex items-center gap-3">
				<input
					type="color"
					value={settings.themeColor}
					oninput={(e) => updateSettings({ themeColor: e.currentTarget.value })}
					class="h-10 w-14 cursor-pointer rounded border border-zinc-200"
				/>
				<TextInput
					value={settings.themeColor}
					onchange={(themeColor) => updateSettings({ themeColor })}
				/>
			</div>
		</Field>
		<Field label="Font family">
			<select
				class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
				value={settings.fontFamily}
				onchange={(e) =>
					updateSettings({
						fontFamily: normalizeFontFamily(e.currentTarget.value)
					})}
			>
				{#each FONT_FAMILY_IDS as id (id)}
					<option value={id}>{RESUME_FONTS[id].label}</option>
				{/each}
			</select>
		</Field>
		<Field label="Font size (pt)">
			<input
				type="number"
				min="8"
				max="16"
				class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
				value={settings.fontSize}
				oninput={(e) => updateSettings({ fontSize: Number(e.currentTarget.value) || 11 })}
			/>
		</Field>
		<Field label="Page size">
			<select
				class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
				value={settings.pageSize}
				onchange={(e) =>
					updateSettings({
						pageSize: /** @type {'letter' | 'a4'} */ (e.currentTarget.value)
					})}
			>
				<option value="letter">Letter</option>
				<option value="a4">A4</option>
			</select>
		</Field>
	</div>

	<div class="mt-6 border-t border-zinc-100 pt-4">
		<h3 class="mb-1 text-sm font-semibold text-zinc-900">Section order</h3>
		<p class="mb-3 text-xs text-zinc-500">
			Only visible sections appear here. Showing a section adds it to the bottom. The form above
			stays in a fixed order.
		</p>
		<ul class="flex flex-col gap-2">
			{#each visibleSectionOrder as sectionId, index (sectionId)}
				<li class="flex items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2">
					<span class="flex-1 text-sm text-zinc-800">{sectionTitle(sectionId)}</span>
					<button
						type="button"
						aria-label="Move {sectionTitle(sectionId)} up"
						disabled={index === 0}
						onclick={() => moveSection(index, -1)}
						class="rounded border border-zinc-200 px-2 py-1 text-xs text-zinc-600 enabled:hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						↑
					</button>
					<button
						type="button"
						aria-label="Move {sectionTitle(sectionId)} down"
						disabled={index === visibleSectionOrder.length - 1}
						onclick={() => moveSection(index, 1)}
						class="rounded border border-zinc-200 px-2 py-1 text-xs text-zinc-600 enabled:hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						↓
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<p class="mt-3 text-xs text-zinc-500">
		Theme, font, page size, and section order apply to the preview and PDF export.
	</p>
</section>
