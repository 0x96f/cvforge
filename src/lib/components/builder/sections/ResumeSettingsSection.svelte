<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */

	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { FONT_FAMILY_IDS, RESUME_FONTS, normalizeFontFamily } from '$lib';

	/** @type {{
	 *   settings: ResumeData['settings'],
	 *   updateSettings: (patch: Partial<ResumeData['settings']>) => void
	 * }} */
	let { settings, updateSettings } = $props();
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
	<p class="mt-3 text-xs text-zinc-500">
		Theme, font, and page size apply to both the preview and PDF export.
	</p>
</section>
