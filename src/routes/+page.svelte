<script>
	import { GITHUB_URL } from '$lib';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>CVForge - Open source resume builder</title>
	<meta
		name="description"
		content="Build and export your resume as PDF or JSON. Data stored locally in your browser."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-white">
	<main
		class="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pt-8 pb-24 text-center"
	>
		<h1 class="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
			Build a resume in your browser. Export when you're ready.
		</h1>

		<p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
			Privacy-focused and open source. Your resume is saved and encrypted on this device. PDF export
			sends your resume to Gotenberg to create the file. JSON export happens entirely in your
			browser.
		</p>

		<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
			<Button size="xl" label="Create resume" variant="primary" href="/create" />
			<Button size="xl" href={GITHUB_URL} externalLink label="View on GitHub" variant="outline" />
		</div>

		<ul class="mt-16 grid max-w-4xl gap-4 text-left text-sm text-zinc-600 sm:grid-cols-3">
			<li class="rounded-xl border border-zinc-100 bg-white p-5 shadow-md">
				<h3 class="font-semibold text-zinc-900">Privacy & encryption</h3>
				<p class="mt-1 leading-relaxed">
					Your resume stays on this device, encrypted. Nothing is logged.
				</p>
			</li>
			<li class="rounded-xl border border-zinc-100 bg-white p-5 shadow-md">
				<h3 class="font-semibold text-zinc-900">Open source</h3>
				<p class="mt-1 leading-relaxed">
					MIT-licensed. Inspect the code, self-host, or contribute on GitHub.
				</p>
			</li>
			<li class="rounded-xl border border-zinc-100 bg-white p-5 shadow-md">
				<h3 class="font-semibold text-zinc-900">Export formats</h3>
				<p class="mt-1 leading-relaxed">Download PDF or JSON with one click.</p>
			</li>
		</ul>
	</main>

	<footer class="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
		<p>
			MIT-licensed |
			<a
				href={GITHUB_URL}
				class="font-bold text-blue-500 hover:underline"
				target="_blank"
				rel="external noopener noreferrer"
			>
				Source on GitHub
			</a>
		</p>
	</footer>
</div>
