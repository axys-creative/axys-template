<script lang="ts">
	import { page } from '$app/state';
	import site from '$lib/content/meta/site.json';
	import { pages } from '$lib/content/meta/pages.json';

	// A page can pass its own `seo` in its load data (a blog post does); otherwise pages.json decides.
	type PageSeo = { title: string; description?: string; ogImage?: string; type?: string };

	const entry = $derived(pages.find((p) => p.path === page.url.pathname));
	const seo = $derived(page.data.seo as PageSeo | undefined);
	const title = $derived(seo?.title || entry?.title || site.siteName);
	const description = $derived(seo?.description || entry?.description);
	const ogImage = $derived(seo?.ogImage || entry?.ogImage);
	const crawlPage = $derived(entry?.crawlPage ?? true);
	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	const fullTitle = $derived(`${title} | ${site.siteName}`);
	const metaDescription = $derived(description || site.description);
	const image = $derived(ogImage || site.ogImage);
	const origin = $derived(site.url || page.url.origin);
	const canonical = $derived(origin + page.url.pathname);
	const imageUrl = $derived(image ? new URL(image, origin).href : '');
	const schema = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: site.siteName,
			url: origin,
			...(site.contactEmail && { email: site.contactEmail })
		}).replaceAll('<', '\\u003c')
	);
	const schemaTag = $derived(`<script type="application/ld+json">${schema}</${'script'}>`);
</script>

<svelte:head>
	{#if !isAdmin}
		{#if site.themeColor}<meta name="theme-color" content={site.themeColor} />{/if}
		{#if site.author}<meta name="author" content={site.author} />{/if}
		{#if site.faviconLight}
			<link rel="icon" href={site.faviconLight} media="(prefers-color-scheme: light)" />
		{/if}
		{#if site.faviconDark}
			<link rel="icon" href={site.faviconDark} media="(prefers-color-scheme: dark)" />
		{/if}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html schemaTag}
		<title>{fullTitle}</title>
		{#if !crawlPage}
			<meta name="robots" content="noindex, nofollow" />
		{/if}
		<link rel="canonical" href={canonical} />
		{#if metaDescription}
			<meta name="description" content={metaDescription} />
			<meta property="og:description" content={metaDescription} />
		{/if}
		<meta property="og:type" content={seo?.type ?? 'website'} />
		<meta property="og:site_name" content={site.siteName} />
		<meta property="og:title" content={fullTitle} />
		<meta property="og:url" content={canonical} />
		{#if imageUrl}
			<meta property="og:image" content={imageUrl} />
		{/if}
		<meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
	{/if}
</svelte:head>
