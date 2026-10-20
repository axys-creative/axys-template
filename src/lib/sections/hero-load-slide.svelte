<script module lang="ts">
	export type HeroLoadSlideProps = SectionCopyProps & {
		/** The three words of the heading, top to bottom. The second and third start indented and slide left to line up with the first. */
		words: [string, string, string];
		/** The font size of the words, any CSS length. */
		size?: string;
		/** At least the height of the screen. Taller content still grows past it. */
		fullScreen?: boolean;
		/** The section's anchor, so a link or the CMS preview can point to `#id`. */
		id?: string;
		/** Skips the reveal and the slide, for the CMS preview. */
		static?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { textReveal } from '$lib/attachments/text-reveal';
	import SectionCopy, { type SectionCopyProps } from '$lib/components/section-copy.svelte';
	import { loading } from '$lib/utils/loading.svelte';

	let {
		words,
		size = 'clamp(72px, 15vw, 180px)',
		fullScreen = true,
		id,
		static: isStatic = false,
		class: className,
		description,
		cta,
		...copy
	}: HeroLoadSlideProps = $props();

	const REVEAL = {
		type: 'chars',
		duration: 0.8,
		stagger: 0.05,
		ease: 'power3.out',
		once: true
	} as const;
	const ROW_DELAY = 0.15;
	const HOLD = 0.1;

	// Seconds until the last letter of the last row has landed.
	const revealTime = $derived(
		Math.max(
			...words.map(
				(word, index) =>
					index * ROW_DELAY + ([...word].length - 1) * REVEAL.stagger + REVEAL.duration
			)
		)
	);

	let section = $state<HTMLElement>();
	let shown = $state(false);
	let aligned = $state(false);

	const reveal = (index: number) =>
		isStatic || !loading.done
			? undefined
			: textReveal({ ...REVEAL, delay: index * ROW_DELAY, trigger: section });

	$effect(() => {
		if (isStatic || !loading.done) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			aligned = true;
			shown = true;
			return;
		}

		let timer: ReturnType<typeof setTimeout>;
		const watch = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) return;
			watch.disconnect();
			timer = setTimeout(
				() => {
					aligned = true;
					shown = true;
				},
				(revealTime + HOLD) * 1000
			);
		});
		watch.observe(section!);

		return () => {
			watch.disconnect();
			clearTimeout(timer);
		};
	});
</script>

<section
	bind:this={section}
	{id}
	class="hero-load-slide {className ?? ''}"
	class:full-screen={fullScreen}
	style="--size: {size}"
>
	{#if copy.eyebrowText || copy.eyebrowIcon}
		<div class="inner">
			<SectionCopy {...copy} showTitle={false} showDescription={false} showCta={false} />
		</div>
	{/if}
	<h1 class="visually-hidden">{words.join(' ')}</h1>

	<div class="words" class:aligned={aligned || isStatic}>
		<div class="inner first">
			<span class="word" aria-hidden="true" {@attach reveal(0)}>{words[0]}</span>
			<div class="copy" class:shown={shown || isStatic}>
				<SectionCopy
					{description}
					descriptionAttach={shown && !isStatic
						? textReveal({
								from: 'top',
								duration: 0.6,
								stagger: 0.03,
								once: true,
								trigger: section
							})
						: undefined}
					{cta}
					showEyebrow={false}
					showTitle={false}
				/>
			</div>
		</div>

		<div class="inner">
			<span class="word" aria-hidden="true" {@attach reveal(1)}>{words[1]}</span>
		</div>

		<div class="inner">
			<span class="word" aria-hidden="true" {@attach reveal(2)}>{words[2]}</span>
		</div>
	</div>
</section>

<style lang="scss">
	@use 'base/mixins';

	.hero-load-slide {
		display: flex;
		flex-direction: column;
		gap: 48px;
		padding-block: var(--body-padding-double);
		overflow: clip;
	}

	.full-screen {
		min-height: 100lvh;
		justify-content: center;
	}

	.inner {
		width: min(var(--content-width), 100% - var(--body-padding) * 2);
		margin-inline: auto;
	}

	// The line box is taller than the 1.05 the rows are spaced for, so the text mask does not clip ascenders and descenders; negative margins give the extra back.
	.words {
		--line-height: 1.3;
		--overhang: calc((var(--line-height) - 1.05) * 0.5em);

		display: flex;
		flex-direction: column;
		width: 100%;
		margin-block: calc(var(--overhang) * -1);
		font-size: var(--size);

		> :global(* + *) {
			margin-top: calc(var(--overhang) * -2);
		}

		@include mixins.min-md {
			> :nth-child(2) {
				--indent: 96px;
			}

			> :nth-child(3) {
				--indent: 192px;
			}

			> .inner {
				translate: var(--indent, 0px) 0;
			}

			@include mixins.mq-motion-allow {
				> .inner {
					transition: translate 1.2s var(--ease);
				}
			}

			&.aligned > .inner {
				translate: 0 0;
			}
		}
	}

	.first {
		display: flex;
		flex-direction: column;
		gap: 24px;

		@include mixins.min-md {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 48px;
		}
	}

	.copy {
		width: 100%;
		max-width: 320px;

		:global(.description) {
			text-wrap: balance;
		}

		@media (scripting: enabled) {
			opacity: 0;
		}

		&.shown {
			opacity: 1;

			@include mixins.mq-motion-allow {
				transition: opacity 0.6s var(--ease);
			}
		}
	}

	.word {
		display: block;
		font-family: var(--font-heading);
		font-size: var(--size);
		font-weight: 300;
		line-height: var(--line-height);
		letter-spacing: 0;
		white-space: nowrap;
	}
</style>
