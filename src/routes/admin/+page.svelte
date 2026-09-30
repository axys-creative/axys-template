<script lang="ts">
	import { onMount } from 'svelte';
	import config from './config.json';

	type Identity = { init: () => void };
	type Cms = { init: (options: { config: unknown }) => void };

	onMount(() => {
		const identity = (window as { netlifyIdentity?: Identity }).netlifyIdentity;
		// Decap's fallback re-init would create a second widget iframe.
		if (identity) identity.init = () => {};

		const script = document.createElement('script');
		script.src = 'https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js';
		script.onload = () => (window as { CMS?: Cms }).CMS?.init({ config });
		(window as { CMS_MANUAL_INIT?: boolean }).CMS_MANUAL_INIT = true;
		document.head.append(script);

		return () => script.remove();
	});
</script>

<svelte:head>
	<title>Content Manager</title>
	<meta name="robots" content="noindex" />
</svelte:head>
