<script module lang="ts">
	import type { ImageCircleProps } from '$lib/components/image-circle.svelte';

	export type HeroImageCircleProps = SectionCopyProps & {
		/** The first circle's images. */
		images: ImageCircleProps['images'];
		/** The second circle's images, for `center`. Defaults to the same images as the first. */
		imagesEnd?: ImageCircleProps['images'];
		/** `center` puts a circle on each side of centered copy. `left` keeps one circle, on the right, and left-aligns the copy. */
		direction?: 'center' | 'left';
		/** Spins the circles as the page scrolls, with `1` about a quarter turn over the section's pass. `0` is off. */
		scrub?: number;
		/** How far the circles sit from the copy, as a percent of their own width. Higher pushes them off the screen. */
		offset?: number;
		/** Image Circle props for both circles, such as `itemWidth`, `gap` or `duration`. */
		circle?: Omit<ImageCircleProps, 'images' | 'direction' | 'bloom' | 'clip' | 'class'>;
		class?: string;
	};
</script>

<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import ImageCircle from '$lib/components/image-circle.svelte';
	import SectionCopy, { type SectionCopyProps } from '$lib/components/section-copy.svelte';
	import { loadGsap } from '$lib/utils/gsap';

	let {
		images,
		imagesEnd,
		direction = 'center',
		scrub = 0,
		offset = 30,
		circle,
		class: className,
		...copy
	}: HeroImageCircleProps = $props();

	const left = $derived(direction === 'left');

	// Spins a circle from one side of upright to the other as the section crosses the screen.
	const spin =
		(side: 1 | -1): Attachment<HTMLElement> =>
		(el) => {
			if (scrub <= 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			let cancelled = false;
			let revert: (() => void) | undefined;
			const half = scrub * 45 * side;

			loadGsap('scrollTrigger').then((gsap) => {
				const section = el.closest('section');
				if (cancelled || !section) return;
				const tween = gsap.fromTo(
					el,
					{ rotation: -half },
					{
						rotation: half,
						ease: 'none',
						scrollTrigger: { trigger: section, start: '-50% bottom', end: '150% top', scrub: true }
					}
				);
				revert = () => {
					tween.scrollTrigger?.kill();
					tween.kill();
				};
			});

			return () => {
				cancelled = true;
				revert?.();
			};
		};
</script>

<section class="hero-image-circle {className ?? ''}" class:left style="--offset: {offset}%">
	<div class="inner">
		<div class="circle first">
			<div class="spin" {@attach spin(-1)}>
				<ImageCircle
					{...circle}
					{images}
					direction="left"
					bloom={left ? 'left' : 'right'}
					clip={false}
				/>
			</div>
		</div>

		<SectionCopy level={1} align={left ? 'start' : 'center'} {...copy} />

		{#if !left}
			<div class="circle second">
				<div class="spin" {@attach spin(1)}>
					<ImageCircle
						{...circle}
						images={imagesEnd ?? images}
						direction="right"
						bloom="left"
						clip={false}
					/>
				</div>
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	@use 'base/mixins';

	// Only the sides are clipped, so the circles can bleed above and below the section on desktop without
	// adding sideways scroll. `container-type` lets them size from the section, never from `100vw`.
	.hero-image-circle {
		position: relative;
		container-type: inline-size;
		overflow-x: clip;

		@include mixins.max-lg {
			overflow: clip;
		}
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 64px;
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--body-padding-double) var(--body-padding);

		@include mixins.max-lg {
			flex-direction: column;
		}
	}

	.circle {
		position: absolute;
		top: 50%;
		width: 40cqw;

		@include mixins.max-lg {
			position: static;
			order: 1;
			// Runs edge to edge, past the section's side padding.
			width: calc(100% + var(--body-padding) * 2);
			margin-inline: calc(var(--body-padding) * -1);
			// The circle stays round and the box shows its top half.
			aspect-ratio: 2 / 1;
			overflow: hidden;
		}
	}

	.first {
		left: 0;
		translate: calc(-50% - var(--offset)) -50%;

		@include mixins.max-lg {
			translate: none;

			// Stacked below the copy, the upright card faces up toward it.
			:global(.image-circle) {
				--bloom-ref: 0;
			}
		}
	}

	.second {
		right: 0;
		translate: calc(50% + var(--offset)) -50%;

		@include mixins.max-lg {
			display: none;
		}
	}

	.left {
		@include mixins.min-lg {
			.inner {
				justify-content: flex-start;
			}

			.first {
				right: 0;
				left: auto;
				translate: calc(50% + var(--offset)) -50%;
			}
		}
	}

	.spin {
		width: 100%;
		will-change: transform;
	}
</style>
