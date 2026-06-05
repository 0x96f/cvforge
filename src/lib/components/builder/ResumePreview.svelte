<script>
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */

	import ResumeDocument from './ResumeDocument.svelte';
	import { PAGE_HEIGHT, PAGE_PADDING, PAGE_WIDTH } from '$lib';

	/** @type {{ data: import('$lib/types.js').ResumeData }} */
	let { data } = $props();

	const PAGE_LABEL = {
		letter: 'US Letter',
		a4: 'A4'
	};

	const ZOOM_MIN = 100;
	const ZOOM_MAX = 200;
	const ZOOM_DEFAULT = 100;

	let zoom = $state(ZOOM_DEFAULT);

	let settings = $derived(data.settings);
	let pageWidth = $derived(PAGE_WIDTH[settings.pageSize]);
	let pageHeight = $derived(PAGE_HEIGHT[settings.pageSize]);
	let zoomFactor = $derived(zoom / 100);
	let fitScale = $derived(`min(100cqw / ${pageWidth}, 100cqh / ${pageHeight})`);
</script>

<div class="flex h-full min-h-0 w-full flex-col">
	<div class="mb-3 flex shrink-0 items-baseline justify-between gap-2">
		<p class="text-xs font-medium tracking-wide text-zinc-500 uppercase">Preview</p>
		<p class="text-xs text-zinc-400">{PAGE_LABEL[settings.pageSize]}</p>
	</div>
	<div class="@container-size min-h-0 flex-1 overflow-auto">
		<div class="flex min-h-full min-w-full items-center justify-center">
			<div
				style:width="calc(min(100cqw, 100cqh * {pageWidth} / {pageHeight}) * {zoomFactor})"
				style:height="calc(min(100cqh, 100cqw * {pageHeight} / {pageWidth}) * {zoomFactor})"
			>
				<div
					class="bg-white shadow-xl ring-1 ring-zinc-200"
					style:width={pageWidth}
					style:min-height={pageHeight}
					style:padding={PAGE_PADDING}
					style:transform-origin="top left"
					style:transform="scale(calc({fitScale} * {zoomFactor}))"
				>
					<ResumeDocument {data} />
				</div>
			</div>
		</div>
	</div>
	<div class="mt-3 flex shrink-0 items-center gap-3">
		<input
			type="range"
			min={ZOOM_MIN}
			max={ZOOM_MAX}
			step={5}
			bind:value={zoom}
			aria-label="Preview zoom"
			class="h-1.5 min-w-0 flex-1 cursor-pointer accent-gray-900"
		/>
		<span class="w-10 shrink-0 text-right text-xs font-medium text-zinc-500 tabular-nums"
			>{zoom}%</span
		>
	</div>
</div>
