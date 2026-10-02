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

	let { name = 'fade', ...options }: PageTransitionProps = $props();

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
					options,
					true
				);
			});
		}

		if (!document.startViewTransition) return;

		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
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
</style>
