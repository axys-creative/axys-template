<script lang="ts">
	import { onMount } from 'svelte';
	import config from './config.json';

	onMount(async () => {
		const { default: CMS } = await import('decap-cms-app');
		CMS.init({ config: config as never });
	});
</script>

<svelte:head>
	<title>Content Manager</title>
	<meta name="robots" content="noindex" />
</svelte:head>
