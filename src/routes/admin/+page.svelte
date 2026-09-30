<script lang="ts">
	import { onMount } from 'svelte';
	import config from './config.json';

	onMount(async () => {
		// The widget already initialized from app.html; Decap's fallback re-init would duplicate it.
		const identity = (window as { netlifyIdentity?: { init: () => void } }).netlifyIdentity;
		if (identity) identity.init = () => {};

		const { default: CMS } = await import('decap-cms-app');
		CMS.init({ config: config as never });
	});
</script>

<svelte:head>
	<title>Content Manager</title>
	<meta name="robots" content="noindex" />
</svelte:head>
