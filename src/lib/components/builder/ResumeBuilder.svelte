<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */
	/** @typedef {import('$lib/types.js').SectionConfig} SectionConfig */
	/** @typedef {import('$lib/types.js').SectionId} SectionId */

	import ResumePreview from './ResumePreview.svelte';
	import ProfileSection from './sections/ProfileSection.svelte';
	import WorkSection from './sections/WorkSection.svelte';
	import EducationSection from './sections/EducationSection.svelte';
	import ProjectsSection from './sections/ProjectsSection.svelte';
	import CertificatesSection from './sections/CertificatesSection.svelte';
	import SkillsSection from './sections/SkillsSection.svelte';
	import CustomSection from './sections/CustomSection.svelte';
	import ResumeSettingsSection from './sections/ResumeSettingsSection.svelte';
	import {
		clearResume,
		createDefaultResume,
		downloadBlob,
		downloadText,
		exportResumePdf,
		loadResume,
		saveResume,
		slugifyName
	} from '$lib';
	import Button from '../ui/Button.svelte';

	let { initialFresh = false } = $props();

	/** @type {ResumeData | null} */
	let data = $state(null);
	let exporting = $state(/** @type {string | null} */ (null));
	let saveHint = $state(false);

	$effect(() => {
		let cancelled = false;

		async function init() {
			if (initialFresh) {
				clearResume();
				if (!cancelled) data = createDefaultResume();
				return;
			}
			const loaded = await loadResume();
			if (!cancelled) data = loaded;
		}

		void init();
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		if (!data) return;
		let cancelled = false;
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let hideHintTimer;

		void saveResume(data).then(() => {
			if (cancelled) return;
			saveHint = true;
			hideHintTimer = setTimeout(() => {
				saveHint = false;
			}, 1500);
		});

		return () => {
			cancelled = true;
			if (hideHintTimer) clearTimeout(hideHintTimer);
		};
	});

	/** @param {Partial<ResumeData>} patch */
	function update(patch) {
		if (!data) return;
		data = { ...data, ...patch };
	}

	/** @param {Partial<ResumeData['settings']>} patch */
	function updateSettings(patch) {
		if (!data) return;
		data = { ...data, settings: { ...data.settings, ...patch } };
	}

	/** @param {SectionId} id @param {SectionConfig} config */
	function updateSection(id, config) {
		if (!data) return;
		data = {
			...data,
			sections: data.sections.map((s) => (s.id === id ? config : s))
		};
	}

	function exportJson() {
		if (!data) return;
		const filename = slugifyName(data.profile.name);
		downloadText(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json');
	}

	async function exportPdf() {
		if (!data) return;
		exporting = 'pdf';
		try {
			const result = await exportResumePdf(data);
			if ('error' in result) {
				throw new Error(result.error);
			}
			const binary = atob(result.pdfBase64);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			const filename = slugifyName(data.profile.name);
			downloadBlob(
				new Blob([bytes], { type: 'application/pdf' }),
				`${filename}.pdf`,
				'application/pdf'
			);
		} catch (e) {
			alert(e instanceof Error ? e.message : 'PDF export failed');
		} finally {
			exporting = null;
		}
	}
</script>

{#if !data}
	<div class="flex min-h-screen items-center justify-center text-zinc-500">Loading…</div>
{:else}
	<div class="min-h-screen bg-zinc-50">
		<header class="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
			<div class="flex w-full flex-wrap items-center justify-between gap-4 px-8 py-3 lg:px-6">
				<Button label="Back" variant="outline" href="/" />
				<div class="flex flex-wrap items-center gap-2">
					{#if saveHint}
						<span class="mr-3 text-xs font-bold text-emerald-600">Saved</span>
					{/if}
					<Button
						label="Save as JSON"
						onClick={exportJson}
						disabled={!!exporting}
						variant="outline"
					/>
					<Button
						label="Save as PDF"
						onClick={exportPdf}
						disabled={!!exporting}
						variant="secondary"
					/>
				</div>
			</div>
		</header>

		<div class="flex w-full flex-col lg:flex-row lg:items-start">
			<main class="min-w-0 flex-1 px-4 py-8 lg:px-6">
				<div
					class="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 lg:hidden"
					role="status"
				>
					<p class="font-bold">Preview not available on mobile</p>
					<p class="mt-1 text-amber-900/80">
						Open on a larger screen for a live preview, or export a PDF to check formatting.
					</p>
				</div>

				<ProfileSection profile={data.profile} {update} />

				{#each data.sections as config (config.id)}
					{#if config.id === 'work'}
						<WorkSection
							work={data.work}
							{config}
							{update}
							updateSection={(c) => updateSection('work', c)}
						/>
					{:else if config.id === 'education'}
						<EducationSection
							education={data.education}
							{config}
							{update}
							updateSection={(c) => updateSection('education', c)}
						/>
					{:else if config.id === 'projects'}
						<ProjectsSection
							projects={data.projects}
							{config}
							{update}
							updateSection={(c) => updateSection('projects', c)}
						/>
					{:else if config.id === 'certificates'}
						<CertificatesSection
							certificates={data.certificates}
							{config}
							{update}
							updateSection={(c) => updateSection('certificates', c)}
						/>
					{:else if config.id === 'skills'}
						<SkillsSection
							skills={data.skills}
							{config}
							{update}
							updateSection={(c) => updateSection('skills', c)}
						/>
					{:else if config.id === 'custom'}
						<CustomSection
							custom={data.custom}
							{config}
							{update}
							updateSection={(c) => updateSection('custom', c)}
						/>
					{/if}
				{/each}

				<ResumeSettingsSection settings={data.settings} {updateSettings} />
			</main>

			<aside
				class="hidden w-full shrink-0 flex-col border-zinc-200 bg-zinc-100 lg:sticky lg:top-14 lg:flex lg:h-[calc(100vh-57px)] lg:w-1/2 lg:max-w-[50vw] lg:border-l"
			>
				<div class="flex min-h-0 flex-1 flex-col p-4 lg:p-6">
					<ResumePreview {data} />
				</div>
			</aside>
		</div>
	</div>
{/if}
