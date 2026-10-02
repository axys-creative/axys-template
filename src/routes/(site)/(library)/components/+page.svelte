<!-- LIBRARY: DELETE ME. Documentation page; remove with the rest of the library (see CLAUDE.md). -->
<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import PostCard from '$lib/components/post-card.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import VideoOverlay from '$lib/components/video-overlay.svelte';
	import { mouseCursorProps, postCardProps, videoOverlayProps } from '$lib/library/component-props';
	import LibrarySection from '$lib/library/library-section.svelte';
	import HeroSimple from '$lib/sections/hero-simple.svelte';
	import { navEntry } from '$lib/utils/nav';

	const nav = navEntry('/components');
	let videoOpen = $state(false);
</script>

<HeroSimple
	eyebrowText={nav.group}
	eyebrowIcon={nav.icon}
	title="Components"
	description="Larger pieces of UI that bring their own behavior. The smaller building blocks live in the style guide."
/>

<div class="components">
	<LibrarySection
		title="Mouse Cursor"
		type="Component"
		description="A custom cursor that follows the mouse. Mount it once in a layout; attachments such as `cursorContent` and `cursorTarget` then change how it looks. It is hidden on touch devices and with reduced motion. See the Attachments page for live demos."
		props={mouseCursorProps}
	/>

	<LibrarySection
		title="Post Card"
		type="Component"
		description="A link card for one post in a list, with its cover image, tag, date, author and description. The first card of the Blog page is featured."
		props={postCardProps}
	>
		<PostCard
			post={{
				slug: 'a-short-post',
				title: 'A sample post',
				description: 'Cards are shown in a grid on the Blog page.',
				author: 'Author Here',
				date: '2026-02-02',
				tag: 'Update',
				coverImage: '/images/img-sample-1.jpg'
			}}
		/>
	</LibrarySection>

	<LibrarySection
		title="Theme Toggle"
		type="Component"
		description="Switches between system, light and dark, and remembers the choice. It takes no props; an inline script in `app.html` applies the saved theme before the page paints."
	>
		<ThemeToggle />
	</LibrarySection>

	<LibrarySection
		title="Video Overlay"
		type="Component"
		description="A modal video on the native `<dialog>`, so focus trapping, Escape to close and an inert background come for free. The video only loads once it is opened and is released after it closes. Open it from anything by setting `open`; focus returns to the trigger on close."
		props={videoOverlayProps}
	>
		<Button text="Toggle Video Overlay" onclick={() => (videoOpen = true)} />
		<VideoOverlay
			bind:open={videoOpen}
			title="Sample video"
			src="https://www.dropbox.com/scl/fi/6sh06eo6b3x84qo823qcq/sample-video-1.mp4?rlkey=0v6dqkra2wk7de0rz849ufm7o&st=0705ulra&raw=1"
			poster="/images/img-sample-1.jpg"
		/>
	</LibrarySection>
</div>

<style lang="scss">
	/* LIBRARY: DELETE ME */
	.components {
		display: flex;
		flex-direction: column;
		gap: 64px;
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--body-padding);
	}
</style>
