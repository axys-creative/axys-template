<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { GnomonCutout } from '$lib/utils/gnomon';

	export type CardGnomonProps = {
		/** One entry per notch. Defaults to a single, unlabeled `top-right`. */
		cutouts?: GnomonCutout[];
		/** 0-100. The least every cutout reaches into the card, as a % of its side. It grows when the text wraps. */
		depth?: number;
		/** 0-100. The most every cutout runs along its edge, as a % of the card's side. Longer text wraps and deepens the cutout. */
		maxLength?: number;
		/** In px, added to the measured text width, for the room beside the text and the notch's slant. */
		lengthPadding?: number;
		/** 0-50. The corner curve as a % of the card's side, for every corner. */
		radius?: number;
		/** 45-90 degrees. 90 is a square step; lower tilts it toward a diagonal. */
		angle?: number;
		/** The stroke width in px. */
		borderWidth?: number;
		img?: { src: string; alt?: string; eager?: boolean; sizes?: string };
		/** Anything else the card holds, on top of the image. */
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { imageProps } from '$lib/utils/image';
	import { gnomonShape, gnomonTilt } from '$lib/utils/gnomon';

	let {
		cutouts = [{ from: 'top-right' }],
		depth = 12,
		maxLength = 90,
		lengthPadding = 28,
		radius = 8,
		angle = 90,
		borderWidth = 2,
		img,
		children,
		class: className
	}: CardGnomonProps = $props();

	const id = $props.id();

	const NO_TEXT_LENGTH = 32;
	const LABEL_PADDING = 8;
	const WIDTH_SLACK = 2;
	let cardWidth = $state(0);
	let textWidths = $state<number[]>([]);
	let textHeights = $state<number[]>([]);
	const longest = $derived(Math.max(0, ...textWidths.filter(Boolean)));
	const open = $derived(Math.max(0.2, 1 - gnomonTilt(angle)));
	const fitted = $derived(
		cardWidth && longest
			? Math.min(maxLength, ((longest + WIDTH_SLACK + lengthPadding) / (cardWidth * open)) * 100)
			: NO_TEXT_LENGTH
	);
	const wrapWidth = $derived(Math.max(0, (fitted / 100) * cardWidth * open - lengthPadding));
	const tallest = $derived(Math.max(0, ...textHeights.filter(Boolean)));
	const fittedDepth = $derived(
		cardWidth && tallest ? Math.max(depth, ((tallest + LABEL_PADDING) / cardWidth) * 100) : depth
	);
	const shape = $derived(
		gnomonShape({
			cutouts: cutouts.length ? cutouts : [{ from: 'top-right' }],
			depth: fittedDepth,
			length: fitted,
			radius,
			angle
		})
	);
</script>

<div
	class="card-gnomon {className ?? ''}"
	style="--border-width: {borderWidth}px; --label-inset: {lengthPadding / 2}px"
	bind:clientWidth={cardWidth}
>
	<svg class="stroke" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
		<defs>
			<clipPath {id} clipPathUnits="objectBoundingBox"><path d={shape.clip} /></clipPath>
		</defs>
		<path d={shape.stroke} vector-effect="non-scaling-stroke" />
	</svg>

	<div class="inner" style="clip-path: url(#{id})">
		{#if img?.src}
			<img
				{...imageProps(img.src, { sizes: img.sizes ?? '(min-width: 768px) 400px, 80vw' })}
				alt={img.alt ?? ''}
				loading={img.eager ? 'eager' : 'lazy'}
			/>
		{/if}
		{#if children}<div class="body">{@render children()}</div>{/if}
	</div>

	{#each cutouts as cutout, index (index)}
		{#if cutout.text}
			<span class="label measure" aria-hidden="true" bind:clientWidth={textWidths[index]}
				>{cutout.text}</span
			>
			<span
				class="label measure wrap"
				aria-hidden="true"
				style="width: {wrapWidth}px"
				bind:clientHeight={textHeights[index]}>{cutout.text}</span
			>
		{/if}
	{/each}

	{#each shape.labels as label (label.from)}
		<span class="label" style={label.style}>{label.text}</span>
	{/each}
</div>

<style lang="scss">
	@use 'base/mixins';

	.card-gnomon {
		--border-color: var(--color-border);
		--border-width: 2px;
		--fill: var(--color-surface);

		position: relative;
		display: inline-block;
		width: var(--card-size, 25vw);
		aspect-ratio: 1;

		@include mixins.max-md {
			width: var(--card-size, 50vw);
		}

		&:hover {
			--border-color: var(--color-accent);
		}
	}

	// The stroke is centered on the viewBox edge, so it must overflow or the outer edges and corners get cropped.
	.stroke {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;

		path {
			fill: none;
			stroke: var(--border-color);
			stroke-width: var(--border-width);

			@include mixins.mq-motion-allow {
				transition: stroke 0.3s ease;
			}
		}
	}

	// Same box and shape as the stroke, so the content's edge sits exactly on the line.
	.inner {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: var(--fill);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.body {
		position: absolute;
		inset: 0;
		padding: 16px;
		pointer-events: none;
	}

	.label {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px var(--label-inset, 14px);
		font-size: 14px;
		line-height: 1.2;
		text-align: center;
		pointer-events: none;

		@include mixins.max-xxl {
			font-size: 12px;
		}
	}

	.label.measure {
		padding: 0;
		white-space: nowrap;
		visibility: hidden;

		&.wrap {
			white-space: normal;
		}
	}
</style>
