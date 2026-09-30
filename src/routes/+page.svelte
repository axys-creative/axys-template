<script lang="ts">
	import HeroSimple from '$lib/sections/hero-simple.svelte';
	import hero from '$lib/content/page_home/hero-simple.json';

	const cta = {
		primary: hero.cta.primary,
		secondary: hero.cta.secondary.text ? hero.cta.secondary : undefined
	};
</script>

<HeroSimple {...hero} {cta} />
