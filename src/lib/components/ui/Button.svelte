<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	/** @typedef {'primary' | 'secondary' | 'outline'} ButtonVariant */
	/** @typedef {'sm' | 'md' | 'xl'} ButtonSize */

	/** @typedef {Object} ButtonBaseProps
	 * @property {string} label
	 * @property {boolean} [disabled]
	 * @property {ButtonVariant} [variant]
	 * @property {ButtonSize} [size]
	 */

	/** @typedef {ButtonBaseProps & {
	 *   href: import('$app/types').Pathname,
	 *   externalLink?: false,
	 *   onClick?: never
	 * }} InternalLinkButtonProps */
	/** @typedef {ButtonBaseProps & { href: string, externalLink: true, onClick?: never }} ExternalLinkButtonProps */
	/** @typedef {ButtonBaseProps & { onClick: (e: MouseEvent) => void, href?: never, externalLink?: never }} ActionButtonProps */

	/** @type {InternalLinkButtonProps | ExternalLinkButtonProps | ActionButtonProps} */
	let {
		label,
		onClick,
		href,
		externalLink = false,
		disabled = false,
		variant = 'primary',
		size = 'md'
	} = $props();

	const commonClasses =
		'inline-flex items-center justify-center rounded-lg font-medium no-underline transition cursor-pointer';

	/** @type {Record<ButtonSize, string>} */
	const sizeClasses = {
		sm: 'rounded-md px-2.5 py-1 text-xs',
		md: 'rounded-lg px-3 py-1.5 text-sm',
		xl: 'rounded-xl px-5 py-2.5 text-base'
	};

	/** @type {Record<ButtonVariant, string>} */
	const variantClasses = {
		primary: 'text-white bg-gray-900 hover:bg-gray-700',
		secondary: 'text-white bg-teal-600 hover:bg-teal-700',
		outline: 'text-zinc-900 outline outline-zinc-400 bg-white hover:bg-zinc-100'
	};

	const classes = $derived(
		`${commonClasses} ${sizeClasses[size]} ${variantClasses[variant]}${disabled ? ' pointer-events-none opacity-50' : ''}`
	);

	function handleNavigate() {
		if (disabled || !href || externalLink) return;
		goto(resolve(/** @type {import('$app/types').Pathname} */ (href)));
	}
</script>

{#if href}
	{#if externalLink}
		<a
			href={disabled ? undefined : href}
			target="_blank"
			rel="external noopener noreferrer"
			aria-disabled={disabled || undefined}
			class={classes}
		>
			{label}
		</a>
	{:else}
		<button type="button" onclick={handleNavigate} {disabled} class={classes}>
			{label}
		</button>
	{/if}
{:else}
	<button type="button" onclick={onClick} {disabled} class={classes}>
		{label}
	</button>
{/if}
