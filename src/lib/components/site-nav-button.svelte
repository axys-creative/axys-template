<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export type SiteNavButtonProps = {
		/** `burger` is two lines, `oreo` is two lines with the outer corners rounded that twirl into the X, `chocolate` is nine dots, `kebab` is three vertical dots. */
		symbol?: 'burger' | 'oreo' | 'chocolate' | 'kebab';
		shape?: 'square' | 'round';
		/** `button` puts the symbol in a bordered box. */
		type?: 'icon' | 'button';
		/** Optional text beside the symbol, e.g. "menu". */
		text?: string;
		expanded?: boolean;
		controls?: string;
	} & Omit<HTMLButtonAttributes, 'children' | 'type'>;
</script>

<script lang="ts">
	import { magnet } from '$lib/attachments/magnet';

	let {
		symbol = 'burger',
		shape = 'square',
		type = 'icon',
		text,
		expanded = false,
		controls,
		class: className,
		...rest
	}: SiteNavButtonProps = $props();

	const strokes = $derived({ burger: 2, oreo: 2, chocolate: 9, kebab: 3 }[symbol]);
</script>

<button
	{...rest}
	class="site-nav-button type-{type} {className ?? ''}"
	type="button"
	aria-label={expanded ? 'Close navigation menu' : 'Open navigation menu'}
	aria-expanded={expanded}
	aria-controls={controls}
>
	{#if text}<span class="text">{text}</span>{/if}
	<span
		class="icon {symbol} {shape}"
		aria-hidden="true"
		{@attach magnet({
			x: 1,
			y: 1,
			followDuration: 500,
			returnDuration: 350,
			returnEase: 'cubic-bezier(0, 1.64, 0.63, 1.92)'
		})}
	>
		{#each Array.from({ length: strokes }, (_, i) => i + 1) as number (number)}
			<span class="stroke stroke-{number}"></span>
		{/each}
	</span>
</button>

<style lang="scss">
	@use 'base/mixins';

	.site-nav-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--color-text);
		font: inherit;
		cursor: pointer;

		@include mixins.mq-motion-allow {
			transition: 0.24s ease;
		}

		@include mixins.desktop-hover {
			.text {
				margin-inline-end: 16px;
			}

			.icon {
				scale: 1.1;
			}
		}

		&:active .icon {
			scale: 0.98;
		}
	}

	.text {
		color: var(--color-text);

		@include mixins.mq-motion-allow {
			transition: 0.24s ease;
		}
	}

	.icon {
		aspect-ratio: 1;

		@include mixins.mq-motion-allow {
			transition: 0.24s ease;
		}
	}

	.stroke {
		background: var(--color-text);

		@include mixins.mq-motion-allow {
			transition: 0.24s ease;
		}
	}

	.burger {
		position: relative;
		width: 20px;

		.stroke {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 100%;
			height: 2px;
		}

		.stroke-1 {
			translate: -50% calc(-50% - 3px);
		}

		.stroke-2 {
			translate: -50% calc(-50% + 3px);
		}
	}

	.chocolate {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 5px;

		.stroke {
			width: 3px;
			height: 3px;
		}
	}

	.kebab {
		position: relative;
		width: 24px;

		.stroke {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 4px;
			height: 4px;
		}

		.stroke-1 {
			translate: -50% calc(-50% - 8px);
		}

		.stroke-2 {
			translate: -50% -50%;
		}

		.stroke-3 {
			translate: -50% calc(-50% + 8px);
		}
	}

	.round .stroke {
		border-radius: 24px;
	}

	.oreo {
		position: relative;
		width: 20px;

		@include mixins.mq-motion-allow {
			transition:
				0.24s ease,
				rotate 0.5s var(--ease);
		}

		.stroke {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 100%;
			height: 3px;

			@include mixins.mq-motion-allow {
				transition:
					0.5s var(--ease),
					translate 0.3s ease;
			}
		}

		.stroke-1 {
			translate: -50% calc(-50% - 3px);
			border-radius: 64px 64px 0 0;
		}

		.stroke-2 {
			translate: -50% calc(-50% + 3px);
			border-radius: 0 0 64px 64px;
		}
	}

	// Open state: the burger crosses into an X, the chocolate keeps its corners and center.
	[aria-expanded='true'] {
		.burger .stroke {
			translate: -50% -50%;
		}

		.burger .stroke-1 {
			rotate: 45deg;
		}

		.burger .stroke-2 {
			rotate: -45deg;
		}

		.oreo {
			rotate: 90deg;

			.stroke {
				translate: -50% -50%;
				border-radius: 64px;
			}

			.stroke-1 {
				rotate: 45deg;
			}

			.stroke-2 {
				rotate: -225deg;
			}
		}

		.chocolate {
			.stroke-2,
			.stroke-4,
			.stroke-6,
			.stroke-8 {
				scale: 0;
			}
		}
	}

	// In a box, the symbol sits inside the button's own icon padding (`--btn-padding-icon`, with some room added so the
	// lines sit well inside the border instead of reaching it).
	.type-button .icon {
		--symbol-gap: calc(var(--btn-padding-icon) * 1.5);

		width: 40px;
		height: 40px;
		padding: var(--symbol-gap);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-btn);
		background: var(--color-accent);
	}

	// The lines are as wide as the space inside that padding, whatever the padding is set to.
	.type-button .burger .stroke,
	.type-button .oreo .stroke {
		width: calc(100% - var(--symbol-gap) * 1.5);
	}

	.type-button .kebab,
	.type-button .chocolate {
		width: 40px;
	}
</style>
