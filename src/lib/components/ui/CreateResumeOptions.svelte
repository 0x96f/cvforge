<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { clearResume, hasStoredResume, importResume, parseResumeJson } from '$lib';

	let stored = $derived(browser ? hasStoredResume() : null);
	let importError = $state(/** @type {string | null} */ (null));
	let importing = $state(false);

	/** @param {boolean} fresh */
	function goToBuilder(fresh) {
		goto(resolve(fresh ? '/builder?fresh=1' : '/builder'));
	}

	function handleStartFresh() {
		clearResume();
		goToBuilder(true);
	}

	function handleUploadClick() {
		importError = null;
		fileInput?.click();
	}

	/** @type {HTMLInputElement | null} */
	let fileInput = $state(null);

	/** @param {Event} e */
	async function handleFileChange(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;

		importing = true;
		importError = null;

		try {
			const text = await file.text();
			const data = parseResumeJson(text);
			if (!data) {
				importError = 'Could not read that file. Upload a JSON export from CVForge.';
				return;
			}
			await importResume(data);
			goToBuilder(false);
		} catch {
			importError = 'Failed to read the file. Please try again.';
		} finally {
			importing = false;
		}
	}
</script>

{#if stored === null}
	<div class="flex min-h-screen items-center justify-center text-zinc-500">Loading…</div>
{:else}
	<div class="flex min-h-screen flex-col bg-white">
		<main class="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 pt-8 pb-24">
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
				{stored ? 'Welcome back' : 'Create your resume'}
			</h1>
			<p class="mt-2 text-zinc-600">
				{stored
					? 'Pick up where you left off, start fresh, or import a JSON file.'
					: 'Start with a blank form or import existing resume data.'}
			</p>

			<div class="mt-8 flex flex-col gap-3">
				{#if stored}
					<button
						type="button"
						onclick={() => goToBuilder(false)}
						class="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:border-blue-400 hover:bg-blue-100/80"
					>
						<span class="block font-semibold text-zinc-900">Continue editing</span>
						<span class="mt-1 block text-sm text-zinc-600"
							>Open your saved resume from this browser.</span
						>
					</button>
				{/if}

				<button
					type="button"
					onclick={handleStartFresh}
					class="rounded-xl border border-zinc-200 bg-white p-5 text-left transition hover:border-zinc-400 hover:bg-zinc-50"
				>
					<span class="block font-semibold text-zinc-900"
						>{stored ? 'Start over' : 'Start new'}</span
					>
					<span class="mt-1 block text-sm text-zinc-600">
						{stored
							? 'Discard the saved resume and begin with a blank form.'
							: 'Begin with an empty resume form.'}
					</span>
				</button>

				<button
					type="button"
					onclick={handleUploadClick}
					disabled={importing}
					class="rounded-xl border border-zinc-200 bg-white p-5 text-left transition hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
				>
					<span class="block font-semibold text-zinc-900">Upload JSON</span>
					<span class="mt-1 block text-sm text-zinc-600"
						>Import a CVForge JSON export to pre-fill the form.</span
					>
				</button>
			</div>

			{#if importError}
				<p class="mt-4 text-sm text-red-600" role="alert">{importError}</p>
			{/if}

			<input
				bind:this={fileInput}
				type="file"
				accept=".json,application/json"
				class="sr-only"
				onchange={handleFileChange}
			/>
		</main>
	</div>
{/if}
