<script lang="ts">
	import SectionCopy, { type SectionCopyProps } from '$lib/components/section-copy.svelte';

	let props: SectionCopyProps = $props();
</script>

<section class="hero-simple">
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

	.inner {
		width: 100%;
		max-width: var(--content-width);
		display: flex;
		justify-content: center;
	}
</style>
