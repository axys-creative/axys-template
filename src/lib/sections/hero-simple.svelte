<script lang="ts">
	import SectionCopy, { type SectionCopyProps } from '$lib/components/section-copy.svelte';

	let { compact = false, ...props }: SectionCopyProps & { compact?: boolean } = $props();
</script>

<section class="hero-simple" class:compact>
	<div class="inner">
		<SectionCopy level={1} align="center" {...props} />
	</div>
</section>

<style lang="scss">
	.hero-simple {
		display: grid;
		place-items: center;
		min-height: 80dvh;
		padding: var(--body-padding-double) var(--body-padding);
	}

	.compact {
		min-height: 40dvh;
	}

	.inner {
		width: 100%;
		max-width: var(--content-width);
		display: flex;
		justify-content: center;
	}
</style>
