<script lang="ts">
	import { page } from '$app/state';
	import site from '$lib/content/meta/site.json';
	import { pages } from '$lib/content/meta/pages.json';

	const entry = $derived(pages.find((p) => p.path === page.url.pathname));
	const title = $derived(entry?.title || site.siteName);
	const description = $derived(entry?.description);
	const ogImage = $derived(entry?.ogImage);
	const crawlPage = $derived(entry?.crawlPage ?? true);
	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	const fullTitle = $derived(`${title} | ${site.siteName}`);
	const metaDescription = $derived(description || site.description);
	const image = $derived(ogImage || site.ogImage);
	const imageUrl = $derived(image ? new URL(image, page.url.origin).href : '');
	const canonical = $derived(page.url.origin + page.url.pathname);
</script>

<svelte:head>
	{#if !isAdmin}
		<title>{fullTitle}</title>
		{#if !crawlPage}
			<meta name="robots" content="noindex, nofollow" />
		{/if}
		<link rel="canonical" href={canonical} />
		{#if metaDescription}
			<meta name="description" content={metaDescription} />
			<meta property="og:description" content={metaDescription} />
		{/if}
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content={site.siteName} />
		<meta property="og:title" content={fullTitle} />
		<meta property="og:url" content={canonical} />
		{#if imageUrl}
			<meta property="og:image" content={imageUrl} />
		{/if}
		<meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
	{/if}
</svelte:head>
