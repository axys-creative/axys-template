<script lang="ts">
	import '../../styles/styles.scss';
	import FooterSimple, { type FooterSimpleProps } from '$lib/components/footer-simple.svelte';
	import SmoothScroll from '$lib/components/smooth-scroll.svelte';
	import HeaderSimple, { type HeaderSimpleProps } from '$lib/components/header-simple.svelte';
	import logo from '$lib/content/global/logo.json';
	import social from '$lib/content/global/social-media.json';
	import footer from '$lib/content/global/footer-simple.json';
	import header from '$lib/content/global/header-simple.json';

	let { children } = $props();
</script>

<SmoothScroll />

<div class="site">
	<HeaderSimple {...header as HeaderSimpleProps} {logo} socialLinks={social.links} />
	<main id="main" tabindex="-1">
		{@render children()}
	</main>
	<FooterSimple {...footer as FooterSimpleProps} {logo} socialLinks={social.links} />
</div>

<style lang="scss">
	.site {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	main {
		flex: 1;

		&:focus {
			outline: none;
		}
	}
</style>
