<script>
	// @ts-nocheck
	/** @typedef {import('$lib/types.js').ResumeData} ResumeData */

	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	/** @type {{ profile: ResumeData['profile'], update: (patch: Partial<ResumeData>) => void }} */
	let { profile, update } = $props();
</script>

<section class="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
	<h2 class="mb-4 text-lg font-semibold text-zinc-900">
		Profile
		<span class="ml-2 text-xs font-normal text-zinc-400">always shown</span>
	</h2>
	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Name" class="sm:col-span-2">
			<TextInput
				value={profile.name}
				onchange={(name) => update({ profile: { ...profile, name } })}
				placeholder="Jane Doe"
			/>
		</Field>
		<Field label="Objective / summary" class="sm:col-span-2">
			<TextArea
				value={profile.objective}
				onchange={(objective) => update({ profile: { ...profile, objective } })}
				placeholder="Brief professional summary…"
				rows={4}
			/>
		</Field>
		<Field label="Email">
			<TextInput
				type="email"
				value={profile.email}
				onchange={(email) => update({ profile: { ...profile, email } })}
			/>
		</Field>
		<Field label="Phone">
			<TextInput
				value={profile.phone}
				onchange={(phone) => update({ profile: { ...profile, phone } })}
			/>
		</Field>
		<Field label="Website">
			<TextInput
				value={profile.website}
				onchange={(website) => update({ profile: { ...profile, website } })}
				placeholder="https://"
			/>
		</Field>
		<Field label="Location">
			<TextInput
				value={profile.location}
				onchange={(location) => update({ profile: { ...profile, location } })}
			/>
		</Field>
	</div>
</section>
