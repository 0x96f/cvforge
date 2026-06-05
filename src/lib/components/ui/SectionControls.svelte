<script>
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */

	let { config = $bindable(), onchange, showBulletToggle = true } = $props();

	/** @param {boolean} checked */
	function toggleBullets(checked) {
		const next = { ...config, useBullets: checked };
		config = next;
		onchange?.(next);
	}
</script>

{#if showBulletToggle}
	<div class="border-b border-zinc-100 pb-4">
		<label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
			<input
				type="checkbox"
				checked={config.useBullets}
				onchange={(e) => toggleBullets(e.currentTarget.checked)}
				class="h-4 w-4 rounded border-zinc-200 text-teal-600 focus:ring-teal-500"
			/>
			Use bullet points
		</label>
	</div>
{/if}
