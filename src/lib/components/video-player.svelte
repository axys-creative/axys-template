<script module lang="ts">
	import type { HTMLVideoAttributes } from 'svelte/elements';

	export type VideoPlayerProps = {
		/** The video file. Self-hosted or CDN files are best. */
		src: string;
		/** An image shown before the video plays. */
		poster?: string;
		/** A `.vtt` captions file. */
		captions?: string;
		captionsLang?: string;
		/** The video's accessible name. */
		title?: string;
		/** The icon on the play button: a name from `static/icons`, or a path to any single-color SVG. */
		playIcon?: string;
		/** The play button's accessible name. */
		playLabel?: string;
		/** The shape of the frame, as a CSS aspect ratio. */
		aspect?: string;
		class?: string;
	} & Omit<HTMLVideoAttributes, 'src' | 'poster' | 'title' | 'class' | 'children'>;
</script>

<script lang="ts">
	import Icon from './icon.svelte';

	let {
		src,
		poster,
		captions,
		captionsLang = 'en',
		title,
		playIcon = 'play',
		playLabel = 'Play video',
		aspect = '16 / 9',
		class: className,
		controls = true,
		preload = 'metadata',
		...rest
	}: VideoPlayerProps = $props();

	let video = $state<HTMLVideoElement>();
	let paused = $state(true);
	let ended = $state(false);

	// The button follows the video's own state, so it is right however playback started: the button, the native
	// controls, the keyboard or autoplay.
	const resting = $derived(paused || ended);

	const play = () => {
		video?.play().catch(() => {});
		// Hands keyboard users straight to the native controls.
		video?.focus();
	};
</script>

<div class="video-player {className ?? ''}" style="--aspect: {aspect}">
	<video
		bind:this={video}
		bind:paused
		bind:ended
		{src}
		{poster}
		{controls}
		{preload}
		{title}
		playsinline
		{...rest}
	>
		{#if captions}
			<track kind="captions" src={captions} srclang={captionsLang} label="Captions" default />
		{/if}
	</video>

	<button type="button" class="play" class:hidden={!resting} aria-label={playLabel} onclick={play}>
		<Icon name={playIcon} class="play-icon" />
	</button>
</div>

<style lang="scss">
	@use 'base/mixins';

	.video-player {
		--play-size: 80px;
		--play-bg: var(--color-accent);
		--play-color: var(--color-text);

		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: var(--radius);
		background: black;

		@include mixins.max-md {
			--play-size: 56px;
		}
	}

	video {
		display: block;
		width: 100%;
		aspect-ratio: var(--aspect);
		object-fit: contain;
	}

	// Only the circle is a button, not a full-size layer, so the native controls along the bottom stay clickable.
	.play {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		width: var(--play-size);
		height: var(--play-size);
		margin: auto;
		padding: calc(var(--play-size) * 0.3);
		border: 0;
		border-radius: 50%;
		background: var(--play-bg);
		color: var(--play-color);
		cursor: pointer;

		@include mixins.mq-motion-allow {
			transition:
				opacity 0.3s var(--ease),
				scale 0.3s var(--ease),
				visibility 0.3s;
		}

		@include mixins.desktop-hover {
			scale: 1.1;
		}

		&:focus-visible {
			outline: 2px solid var(--color-accent-text);
			outline-offset: 3px;
		}

		// While playing it fades out. `visibility` also takes it out of the tab order once the fade ends.
		&.hidden {
			visibility: hidden;
			opacity: 0;
			pointer-events: none;
		}

		:global(.play-icon) {
			--icon-size: 100%;

			width: 100%;
			height: 100%;
		}
	}
</style>
