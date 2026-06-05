<script>
	let { value = $bindable(''), onchange, placeholder = '', type = 'text' } = $props();

	const inputClass =
		'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

	/** @param {Event & { currentTarget: HTMLInputElement }} e */
	function handleInput(e) {
		const next = e.currentTarget.value;
		value = next;
		onchange?.(next);
	}
</script>

<input {type} class={inputClass} {value} {placeholder} oninput={handleInput} />
