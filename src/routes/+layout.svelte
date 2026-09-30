<script lang="ts">
	import '../styles/styles.css';
	import Seo from '$lib/components/seo.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<Seo />
<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
