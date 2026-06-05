<script>
	/** @type {{ section: string, onClick: (e: MouseEvent) => void }} */
	let { section, onClick } = $props();
</script>

<button
	type="button"
	onclick={onClick}
	class="self-start text-sm font-medium text-teal-600 hover:font-semibold"
>
	+ Add {section}
</button>
