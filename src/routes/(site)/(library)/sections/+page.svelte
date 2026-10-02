<!-- LIBRARY: DELETE ME. Documentation page; remove with the rest of the library (see CLAUDE.md). -->
<script lang="ts">
	import {
		blogArticleBodyProps,
		blogArticleHeroProps,
		heroSimpleProps
	} from '$lib/library/component-props';
	import LibrarySection from '$lib/library/library-section.svelte';
	import HeroSimple from '$lib/sections/hero-simple.svelte';
	import { navEntry } from '$lib/utils/nav';

	const nav = navEntry('/sections');
</script>

<HeroSimple
	eyebrowText={nav.group}
	eyebrowIcon={nav.icon}
	title="Sections"
	description="Full-width blocks of a page. Each opens with the same eyebrow, title, description and buttons."
/>

<div class="sections">
	<LibrarySection
		title="Blog Article Body"
		type="Section"
		description="The text of a post: Markdown rendered to HTML, in a readable column with styled headings, lists, quotes and code. See the Blog page for it in use."
		props={blogArticleBodyProps}
	/>

	<LibrarySection
		title="Blog Article Hero"
		type="Section"
		description="The top of a post: tag, date and author, the title, a short description and a wide cover image."
		props={blogArticleHeroProps}
	/>

	<LibrarySection
		title="Hero Simple"
		type="Section"
		description="A page's opening section: Section Copy centered in a tall block. Every page in this library opens with one, and so does the home page. For a hero that is not a page title, pass a lower `level`."
		props={heroSimpleProps}
	/>
</div>

<style lang="scss">
	/* LIBRARY: DELETE ME */
	.sections {
		display: flex;
		flex-direction: column;
		gap: 128px;
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--body-padding);
	}
</style>
