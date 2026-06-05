<script>
	let { label, children, class: className = '' } = $props();
</script>

<label class="flex flex-col gap-1.5 {className}">
	<span class="text-sm font-medium text-zinc-700">{label}</span>
	{@render children()}
</label>
