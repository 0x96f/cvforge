<script>
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import ResumeBuilder from '$lib/components/builder/ResumeBuilder.svelte';

	/** searchParams are not available during prerender - read only in the browser */
	let fresh = $derived(browser && page.url.searchParams.get('fresh') === '1');
</script>

<svelte:head>
	<title>Resume builder | CVForge</title>
</svelte:head>

<ResumeBuilder initialFresh={fresh} />
