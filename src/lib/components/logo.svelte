<script module lang="ts">
	export type LogoProps = {
		src?: string;
		text?: string;
		alt?: string;
		url?: string;
		tint?: boolean;
	};
</script>

<script lang="ts">
	let { src, text, alt = '', url, tint = false }: LogoProps = $props();

	const label = $derived(text ? undefined : alt || undefined);
</script>

{#snippet content()}
	{#if src && tint}
		<span class="mark" style="mask-image: url('{src}')" aria-hidden="true"></span>
	{:else if src}
		<img {src} alt={text ? '' : alt} />
	{/if}
	{#if text}<span class="text">{text}</span>{/if}
{/snippet}

{#if url}
	<a class="logo" href={url} aria-label={label}>{@render content()}</a>
{:else}
	<div class="logo" role={label ? 'img' : undefined} aria-label={label}>{@render content()}</div>
{/if}

<style lang="scss">
	.logo {
		--logo-size: 28px;

		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: var(--color-text);
		font-family: var(--font-heading);
		font-weight: 700;
		text-decoration: none;
	}

	img,
	.mark {
		width: var(--logo-size);
		height: var(--logo-size);
		object-fit: contain;
	}

	.mark {
		display: block;
		background: currentColor;
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
	}
</style>
