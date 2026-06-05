<script>
	let { value = $bindable(''), onchange, placeholder = '', rows = 3 } = $props();

	const inputClass =
		'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y';

	/** @param {Event & { currentTarget: HTMLTextAreaElement }} e */
	function handleInput(e) {
		const next = e.currentTarget.value;
		value = next;
		onchange?.(next);
	}
</script>

<textarea class={inputClass} {rows} {value} {placeholder} oninput={handleInput}></textarea>
