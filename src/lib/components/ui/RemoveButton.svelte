<script>
	/** @type {{ onClick: (e: MouseEvent) => void, disabled?: boolean }} */
	let { onClick, disabled = false } = $props();
</script>

<div class="mt-4">
	<button
		type="button"
		onclick={onClick}
		{disabled}
		class="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
	>
		Remove
	</button>
</div>
