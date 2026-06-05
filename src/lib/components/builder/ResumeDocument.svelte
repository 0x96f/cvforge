<script>
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */

	import { renderResumeArticle } from '$lib';

	let { data } = $props();

	let html = $derived(renderResumeArticle(data));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div>{@html html}</div>
