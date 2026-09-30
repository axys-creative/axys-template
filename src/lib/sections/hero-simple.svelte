<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import Eyebrow from '$lib/components/eyebrow.svelte';
	import CtaGroup from '$lib/components/cta-group.svelte';

	type Props = {
		title: string;
		description?: string;
		eyebrowText?: string;
		eyebrowIcon?: Snippet;
		eyebrowDirection?: 'row' | 'column';
		cta?: ComponentProps<typeof CtaGroup>;
	};

	let {
		title,
		description,
		eyebrowText,
		eyebrowIcon,
		eyebrowDirection = 'row',
		cta
	}: Props = $props();
</script>

<section class="hero-simple">
	<div class="inner">
		<Eyebrow text={eyebrowText} icon={eyebrowIcon} direction={eyebrowDirection} />
		<h1>{title}</h1>
		{#if description}
			<p class="body-large">{description}</p>
		{/if}
		{#if cta}
			<CtaGroup {...cta} />
		{/if}
	</div>
</section>

<style lang="scss">
	.hero-simple {
		padding: var(--body-padding-double) var(--body-padding);
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		max-width: var(--content-width);
		margin-inline: auto;
	}

	p {
		max-width: 640px;
		color: var(--color-text-muted);
	}
</style>
