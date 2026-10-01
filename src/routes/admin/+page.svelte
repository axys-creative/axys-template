<script lang="ts">
	import { onMount } from 'svelte';
	import config from './config.json';
	import site from '$lib/content/meta/site.json';
	import { loadIdentity } from '$lib/utils/identity';

	type Cms = { init: (options: { config: unknown }) => void };

	onMount(() => {
		let script: HTMLScriptElement | undefined;

		loadIdentity().then((identity) => {
			// Decap's fallback re-init would create a second widget iframe.
			identity.init = () => {};

			script = document.createElement('script');
			script.src = 'https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js';
			script.onload = () => (window as { CMS?: Cms }).CMS?.init({ config });
			(window as { CMS_MANUAL_INIT?: boolean }).CMS_MANUAL_INIT = true;
			document.head.append(script);
		});

		return () => script?.remove();
	});
</script>

<svelte:head>
	<title>Admin | {site.siteName}</title>
	<meta name="robots" content="noindex" />
</svelte:head>
