<script>
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */

	import Button from '$lib/components/ui/Button.svelte';
	import SectionControls from '$lib/components/ui/SectionControls.svelte';

	let { title, config = $bindable(), onchange, showBulletToggle = true, children } = $props();

	function toggleVisible() {
		const next = { ...config, visible: !config.visible };
		config = next;
		onchange?.(next);
	}
</script>

<section class="mb-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
	<div class="flex flex-wrap items-center justify-between gap-3 p-6">
		<h2 class="text-lg font-semibold text-zinc-900">{title}</h2>
		<Button
			variant="outline"
			label={config.visible ? 'Hide section' : 'Show section'}
			onClick={toggleVisible}
		/>
	</div>

	{#if config.visible}
		<div class="border-t border-zinc-100 px-6 pt-4 pb-6">
			<SectionControls bind:config {onchange} {showBulletToggle} />
			<div class="mt-6">
				{@render children()}
			</div>
		</div>
	{/if}
</section>
