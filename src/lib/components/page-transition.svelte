<script module lang="ts">
	import type { PageTransitionName, PageTransitionOptions } from '$lib/utils/page-transition';

	export type PageTransitionProps = PageTransitionOptions & {
		/** Which transition plays between pages. */
		name?: PageTransitionName;
	};
</script>

<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import {
		isCover,
		playTiles,
		playViewTransition,
		prefersReducedMotion
	} from '$lib/utils/page-transition';

	let { name = 'fade', preserveHeader = false, ...options }: PageTransitionProps = $props();

	// SvelteKit waits for the promise this returns before it swaps the page.
	onNavigate((navigation) => {
		if (prefersReducedMotion()) return;

		if (isCover(name)) {
			return new Promise<void>((resolve) => {
				playTiles(
					document.body,
					async () => {
						resolve();
						await navigation.complete;
					},
					{ ...options, preserveHeader },
					true
				);
			});
		}

		if (!document.startViewTransition) return;

		return new Promise<void>((resolve) => {
			// Only on during the change: a view-transition name would otherwise break the header's backdrop blur.
			if (preserveHeader) document.documentElement.setAttribute('data-keep-header', '');
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			if (preserveHeader)
				transition.finished.finally(() =>
					document.documentElement.removeAttribute('data-keep-header')
				);
			transition.ready.then(() => playViewTransition(name, options.duration)).catch(() => {});
		});
	});
</script>

<style>
	:global(::view-transition-old(root)),
	:global(::view-transition-new(root)) {
		animation: none;
		mix-blend-mode: normal;
	}

	:global(html[data-keep-header] header.header:not(:has(.island))),
	:global(html[data-keep-header] header.header .island) {
		view-transition-name: site-header;
	}

	:global(::view-transition-old(site-header)) {
		display: none;
	}

	:global(::view-transition-new(site-header)) {
		animation: none;
	}
</style>
