<script>
	let {
		bullets = $bindable(['']),
		onchange,
		useBullets = true,
		placeholder = 'Add a line…'
	} = $props();

	const textareaClass =
		'min-w-0 flex-1 resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

	/** @param {number} index @param {string} value */
	function update(index, value) {
		const next = [...bullets];
		next[index] = value;
		bullets = next;
		onchange?.(next);
	}

	function add() {
		const next = [...bullets, ''];
		bullets = next;
		onchange?.(next);
	}

	/** @param {number} index */
	function remove(index) {
		if (index === 0) return;
		let next;
		if (bullets.length <= 1) {
			next = [''];
		} else {
			next = bullets.filter((_, i) => i !== index);
		}
		bullets = next;
		onchange?.(next);
	}
</script>

<div class="flex flex-col gap-3">
	{#each bullets as line, index (index)}
		<div class="flex items-start gap-2">
			{#if useBullets}
				<span class="mt-2.5 w-4 shrink-0 text-zinc-400">•</span>
			{/if}
			<textarea
				class={textareaClass}
				rows="2"
				value={line}
				{placeholder}
				oninput={(e) => update(index, e.currentTarget.value)}
			></textarea>
			{#if index > 0}
				<button
					type="button"
					title="Remove"
					aria-label="Remove"
					onclick={() => remove(index)}
					class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-3xl text-xl text-red-400 hover:bg-red-50"
				>
					×
				</button>
			{:else}
				<span class="mt-1 h-8 w-8 shrink-0" aria-hidden="true"></span>
			{/if}
		</div>
	{/each}
	<button
		type="button"
		onclick={add}
		class="self-start text-sm font-medium text-teal-600 hover:font-semibold"
	>
		+ Add line
	</button>
</div>
