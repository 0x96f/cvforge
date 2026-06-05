<script>
	/** @typedef {'json' | 'yaml' | 'pdf'} ExportFormat */

	/** @type {{ disabled?: boolean, exporting?: ExportFormat | null, onExport: (format: ExportFormat) => void }} */
	let { disabled = false, exporting = null, onExport } = $props();

	let open = $state(false);
	/** @type {HTMLDivElement | null} */
	let menuRef = $state(null);

	/** @type {{ format: ExportFormat, label: string, description: string }[]} */
	const options = [
		{ format: 'json', label: 'JSON', description: 'Machine-readable, best for re-importing' },
		{ format: 'yaml', label: 'YAML', description: 'Human-readable, easy to edit in a text editor' },
		{ format: 'pdf', label: 'PDF', description: 'Print-ready resume via Gotenberg' }
	];

	function toggle() {
		if (disabled) return;
		open = !open;
	}

	/** @param {ExportFormat} format */
	function select(format) {
		open = false;
		onExport(format);
	}

	/** @param {MouseEvent} e */
	function handleDocumentClick(e) {
		if (menuRef && !menuRef.contains(/** @type {Node} */ (e.target))) {
			open = false;
		}
	}

	$effect(() => {
		if (!open) return;
		document.addEventListener('click', handleDocumentClick);
		return () => document.removeEventListener('click', handleDocumentClick);
	});
</script>

<div class="relative" bind:this={menuRef}>
	<button
		type="button"
		onclick={toggle}
		{disabled}
		aria-expanded={open}
		aria-haspopup="menu"
		class="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-50"
	>
		Save as
		<svg
			class="size-4 transition {open ? 'rotate-180' : ''}"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	{#if open}
		<div
			role="menu"
			class="absolute right-0 z-20 mt-1 min-w-56 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
		>
			{#each options as option (option.format)}
				<button
					type="button"
					role="menuitem"
					disabled={!!exporting}
					onclick={() => select(option.format)}
					class="flex w-full flex-col px-3 py-2 text-left transition hover:bg-zinc-50 disabled:opacity-50"
				>
					<span class="text-sm font-medium text-zinc-900">
						{option.label}
						{#if exporting === option.format}
							<span class="ml-1 text-xs font-normal text-zinc-500">Exporting…</span>
						{/if}
					</span>
					<span class="text-xs text-zinc-500">{option.description}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
