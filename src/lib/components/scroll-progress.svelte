<script module lang="ts">
	export type ScrollProgressProps = {
		/** Where the bar sits: `bottom` is a short bar that fills left to right; `right` and `left` are bars down a side that fill downward. */
		placement?: 'bottom' | 'right' | 'left';
		/** Clicking the bar scrolls the page to that point. */
		allowClick?: boolean;
		/** Hides the browser's own scrollbar, since the bar takes its place. */
		hideScrollbar?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { cursorHide } from '$lib/attachments/cursor-hide';
	import { watchScroll } from '$lib/attachments/watch-scroll';

	let {
		placement = 'right',
		allowClick = true,
		hideScrollbar = true,
		class: className
	}: ScrollProgressProps = $props();

	let bar = $state<HTMLElement>();
	let track = $state<HTMLElement>();

	onMount(() => {
		const update = () => {
			const scrollable = document.documentElement.scrollHeight - innerHeight;
			const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
			bar!.style.setProperty('--progress', String(progress));
		};

		update();
		addEventListener('scroll', update, { passive: true });
		addEventListener('resize', update);
		return () => {
			removeEventListener('scroll', update);
			removeEventListener('resize', update);
		};
	});

	$effect(() => {
		if (!hideScrollbar) return;
		document.documentElement.classList.add('hide-scrollbar');
		return () => document.documentElement.classList.remove('hide-scrollbar');
	});

	// Scrolls to the point that was clicked, measured along the bar.
	const seek = (event: MouseEvent) => {
		const rect = track!.getBoundingClientRect();
		const fraction =
			placement === 'bottom'
				? (event.clientX - rect.left) / rect.width
				: (event.clientY - rect.top) / rect.height;
		const scrollable = document.documentElement.scrollHeight - innerHeight;
		scrollTo({
			top: scrollable * Math.min(1, Math.max(0, fraction)),
			behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
		});
	};
</script>

<!-- The page's own scrollbar and keyboard already do this job, so the bar is decorative for assistive tech. -->
<div
	bind:this={track}
	class="scroll-progress {placement} {className ?? ''}"
	class:clickable={allowClick}
	aria-hidden="true"
	onclick={allowClick ? seek : undefined}
	{@attach watchScroll({ idle: 500 })}
	{@attach allowClick ? cursorHide() : undefined}
>
	<div class="bar" bind:this={bar}></div>
</div>

<style lang="scss">
	@use 'base/mixins';

	:global(html.hide-scrollbar) {
		scrollbar-width: none;
	}

	:global(html.hide-scrollbar::-webkit-scrollbar) {
		width: 0;
		height: 0;
	}

	.scroll-progress {
		position: fixed;
		z-index: var(--z-scroll-progress, 5);
		overflow: hidden;
		border-radius: 24px;
		background: var(--color-surface);
		pointer-events: none;

		@include mixins.mq-motion-allow {
			transition:
				width 0.5s var(--ease),
				height 0.5s var(--ease),
				opacity 0.3s ease;
		}

		// After a moment without scrolling it fades back, and returns on hover.
		&:global([data-scroll-idle]) {
			opacity: 0.25;
		}

		&:hover {
			opacity: 1;
		}
	}

	.clickable {
		cursor: pointer;
		pointer-events: auto;
	}

	.bar {
		--progress: 0;

		width: 100%;
		height: 100%;
		background: var(--color-accent);
		transform-origin: left top;

		@include mixins.mq-motion-allow {
			transition: transform 0.25s ease-out;
		}
	}

	.bottom {
		bottom: 12px;
		left: 50%;
		width: 128px;
		height: 4px;
		translate: -50% 0;

		.bar {
			transform: scaleX(var(--progress));
		}

		&.clickable:hover {
			height: 12px;
		}
	}

	.right,
	.left {
		top: 50%;
		width: 4px;
		height: 128px;
		translate: 0 -50%;

		.bar {
			transform: scaleY(var(--progress));
		}

		&.clickable:hover {
			width: 12px;
		}
	}

	.right {
		right: 12px;
	}

	.left {
		left: 12px;
	}
</style>
