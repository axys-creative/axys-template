<script module lang="ts">
	export type LoaderLogoProps = LoaderOptions & {
		/** The logo that fills in as the page loads. */
		logo: LogoProps;
	};
</script>

<script lang="ts">
	import Loader, { type LoaderOptions } from '$lib/components/loader.svelte';
	import Logo, { type LogoProps } from '$lib/components/logo.svelte';

	let { logo, class: className, ...options }: LoaderLogoProps = $props();
</script>

<Loader {...options} exit={700} class="loader-logo {className ?? ''}">
	<div class="layer ghost" aria-hidden="true"><Logo {...logo} /></div>
	<div class="layer filled" aria-hidden="true"><Logo {...logo} /></div>
</Loader>

<style lang="scss">
	@use 'base/mixins';

	:global(.loader-logo) {
		place-items: center;
	}

	.layer {
		--logo-height: clamp(40px, 8vw, 72px);
		--logo-size: var(--logo-height);

		grid-area: 1 / 1;
	}

	.ghost {
		opacity: 0.15;
	}

	.filled {
		clip-path: inset(0 calc((1 - var(--progress)) * 100%) 0 0);
	}

	@include mixins.mq-motion-allow {
		:global(.loader-logo) {
			transition: opacity var(--exit) ease;
		}
	}

	:global(.loader-logo[data-phase='leaving']) {
		opacity: 0;
	}
</style>
