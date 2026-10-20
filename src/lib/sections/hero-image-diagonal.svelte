<script module lang="ts">
	export type HeroImageDiagonalProps = SectionCopyProps & {
		/** Up to five pictures, placed in order from the top right down to the bottom left. The middle one is on top. */
		images: { src: string; alt?: string }[];
		/** How wide the picture in the middle of the diagonal is, as a percent of the content width. */
		imageWidth?: number;
		/** How much smaller the pictures at the two ends are than the middle one, from `0` (same size) to `1`. */
		taper?: number;
		/** How much of the diagonal the pictures cover, from `0` (all in the middle) to `1` (corner to corner). */
		spread?: number;
		/** Width over height of each picture, e.g. `4 / 5`. */
		ratio?: string;
		/** At least the height of the screen. Taller content still grows past it. */
		fullScreen?: boolean;
		/** The section's anchor, so a link or the CMS preview can point to `#id`. */
		id?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import SectionCopy, { type SectionCopyProps } from '$lib/components/section-copy.svelte';
	import { imageProps } from '$lib/utils/image';

	let {
		images,
		imageWidth = 20,
		taper = 0.45,
		spread = 0.7,
		ratio = '4 / 5',
		fullScreen = true,
		id,
		class: className,
		description,
		cta,
		...copy
	}: HeroImageDiagonalProps = $props();

	const shown = $derived(images.slice(0, 5));
	const last = $derived(Math.max(shown.length - 1, 1));
</script>

<section
	{id}
	class="hero-image-diagonal {className ?? ''}"
	class:full-screen={fullScreen}
	style="--image-width: {imageWidth}cqw; --ratio: {ratio}"
>
	<div class="inner">
		<div class="pictures" aria-hidden={shown.every((image) => !image.alt) ? 'true' : undefined}>
			{#each shown as image, index (index)}
				<img
					class="picture"
					style="--t: {0.5 + (index / last - 0.5) * spread}; --scale: {1 -
						taper * Math.abs((2 * index) / last - 1)}; z-index: {shown.length -
						Math.abs(index - last / 2)}"
					alt={image.alt ?? ''}
					{...imageProps(image.src, { sizes: `${imageWidth}vw` })}
				/>
			{/each}
		</div>
		<div class="top">
			<SectionCopy level={1} {...copy} showDescription={false} showCta={false} />
		</div>
		<div class="bottom">
			<SectionCopy
				{description}
				{cta}
				showEyebrow={false}
				showTitle={false}
				eyebrowText={undefined}
			/>
		</div>
	</div>
</section>

<style lang="scss">
	.hero-image-diagonal {
		position: relative;
		overflow: clip;
	}

	.full-screen {
		display: flex;
		flex-direction: column;
		min-height: 100lvh;

		.inner {
			flex: 1;
		}
	}

	.pictures {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	// --t runs 0 (top right) to 1 (bottom left); at the ends a picture would be flush with a corner.
	.picture {
		position: absolute;
		top: calc(var(--t) * 100%);
		left: calc((1 - var(--t)) * 100%);
		translate: calc((var(--t) - 1) * 100%) calc(var(--t) * -100%);
		width: max(var(--image-width) * var(--scale), 88px * var(--scale));
		aspect-ratio: var(--ratio);
		object-fit: cover;
		border-radius: var(--radius);
	}

	.inner {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 48px;
		// Flush with the header logo, which sits at the content edge with no inner padding.
		width: min(var(--content-width), 100% - var(--body-padding) * 2);
		min-height: inherit;
		margin-inline: auto;
		// The pictures size from the content width, never from `100vw`.
		container-type: inline-size;
		padding-block: var(--body-padding-double);
	}

	.top,
	.bottom {
		position: relative;
	}

	.top :global(.section-copy) {
		max-width: min(100%, 31em);
	}

	.bottom {
		align-self: flex-end;
		width: 100%;
		max-width: 320px;
	}
</style>
