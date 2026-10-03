<script lang="ts">
	import '../../styles/styles.scss';
	import AlertStack from '$lib/components/alert-stack.svelte';
	import FooterScrollReveal, {
		type FooterScrollRevealProps
	} from '$lib/components/footer-scroll-reveal.svelte';
	import FooterSimple, { type FooterSimpleProps } from '$lib/components/footer-simple.svelte';
	import PageTransition from '$lib/components/page-transition.svelte';
	import ScrollProgress from '$lib/components/scroll-progress.svelte';
	import SmoothScroll from '$lib/components/smooth-scroll.svelte';
	import HeaderSimple, { type HeaderSimpleProps } from '$lib/components/header-simple.svelte';
	import logo from '$lib/content/global/logo.json';
	import social from '$lib/content/global/social-media.json';
	import footer from '$lib/content/global/footer-simple.json';
	import footerScrollReveal from '$lib/content/global/footer-scroll-reveal.json';
	import site from '$lib/content/meta/site.json';
	import header from '$lib/content/global/header-simple.json';

	let { children } = $props();
</script>

<SmoothScroll />
<PageTransition name="fade" />

<div class="site">
	<HeaderSimple {...header as HeaderSimpleProps} {logo} socialLinks={social.links} />
	<main id="main" tabindex="-1">
		{@render children()}
	</main>
	{#if site.footerTemplate === 'scroll-reveal'}
		<FooterScrollReveal
			{...footerScrollReveal as FooterScrollRevealProps}
			socialLinks={social.links}
		/>
	{:else}
		<FooterSimple {...footer as FooterSimpleProps} {logo} socialLinks={social.links} />
	{/if}
</div>

<ScrollProgress />
<AlertStack />

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
