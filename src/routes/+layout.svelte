<script lang="ts">
	import '../styles/styles.scss';
	import { onMount } from 'svelte';
	import Seo from '$lib/components/seo.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { initTheme } from '$lib/theme.svelte';

	let { children } = $props();

	onMount(initTheme);
</script>

<Seo />
<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
