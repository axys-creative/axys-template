<script module lang="ts">
	import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';

	export type ButtonProps = {
		text?: string;
		textDescription?: string;
		url?: string;
		newTab?: boolean;
		type?: 'solid' | 'outline' | 'underline' | 'text';
		htmlType?: 'button' | 'submit' | 'reset';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		current?: boolean;
		expanded?: boolean;
		controls?: string;
		iconStart?: string;
		iconEnd?: string;
		class?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	} & Omit<HTMLAttributes<HTMLElement>, 'class' | 'children' | 'onclick'>;
</script>

<script lang="ts">
	import Icon from './icon.svelte';

	let {
		text,
		textDescription,
		url,
		newTab = false,
		type = 'solid',
		htmlType = 'button',
		size = 'md',
		disabled = false,
		current = false,
		expanded,
		controls,
		iconStart,
		iconEnd,
		class: className,
		onclick,
		...rest
	}: ButtonProps = $props();

	const label = $derived(
		textDescription && newTab ? `${textDescription} (opens in a new tab)` : textDescription
	);
	const classes = $derived(`button ${type} ${size} ${text ? '' : 'icon-only'} ${className ?? ''}`);
</script>

{#snippet content()}
	{#if iconStart}<Icon name={iconStart} />{/if}
	{#if text}<span class="label">{text}</span>{/if}
	{#if newTab && !textDescription}
		<span class="visually-hidden">(opens in a new tab)</span>
	{/if}
	{#if iconEnd}<Icon name={iconEnd} />{/if}
{/snippet}

{#if url}
	<a
		{...rest}
		class={classes}
		href={url}
		aria-label={label}
		aria-current={current ? 'page' : undefined}
		aria-expanded={expanded}
		aria-controls={controls}
		target={newTab ? '_blank' : undefined}
		rel={newTab ? 'noopener noreferrer' : undefined}
	>
		{@render content()}
	</a>
{:else}
	<button
		{...rest}
		class={classes}
		type={htmlType}
		aria-label={label}
		aria-expanded={expanded}
		aria-controls={controls}
		{disabled}
		{onclick}
	>
		{@render content()}
	</button>
{/if}

<style lang="scss">
	@use 'base/mixins';

	.button {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		gap: var(--btn-gap);
		padding: 0;
		border: 0;
		border-radius: var(--radius-btn);
		background: none;
		font-family: var(--font-body);
		font-size: var(--btn-font-size);
		font-weight: var(--btn-font-weight);
		line-height: 1.2;
		text-decoration: none;
		cursor: pointer;

		@include mixins.mq-motion-allow {
			transition:
				background var(--duration) var(--ease),
				color var(--duration) var(--ease),
				border-color var(--duration) var(--ease),
				scale var(--duration) var(--ease);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}
	}

	.solid,
	.outline {
		padding: var(--btn-padding);
		border: 1px solid var(--color-accent);
	}

	.solid {
		background: var(--color-accent);
		color: var(--color-text);

		@include mixins.desktop-hover {
			background: transparent;
			color: var(--color-accent-text);
		}
	}

	.outline {
		color: var(--color-text);

		@include mixins.desktop-hover {
			color: var(--color-accent-text);

			@include mixins.mq-motion-allow {
				scale: 0.96;
			}
		}
	}

	.label {
		position: relative;
	}

	.button > :global(.icon) {
		@include mixins.mq-motion-allow {
			transition: rotate var(--duration) var(--ease);
		}
	}

	.button[aria-expanded='true'] > :global(.icon:last-child) {
		rotate: 180deg;
	}

	.underline {
		color: var(--color-text);

		.label::before {
			content: '';
			position: absolute;
			inset: auto auto 0 0;
			width: 100%;
			height: 1px;
			background: currentColor;

			@include mixins.mq-motion-allow {
				transition:
					width var(--duration) var(--ease),
					inset var(--duration) var(--ease);
			}
		}

		@include mixins.desktop-hover {
			.label::before {
				inset: auto 0 0 auto;
				width: 0;
			}
		}
	}

	.text {
		color: var(--color-accent-text);

		@include mixins.desktop-hover {
			color: var(--color-text);
		}
	}

	.sm {
		--btn-font-size: 13px;
	}

	.lg {
		--btn-font-size: 18px;
	}

	.solid.sm,
	.outline.sm {
		padding: var(--btn-padding-sm);
	}

	.solid.lg,
	.outline.lg {
		padding: var(--btn-padding-lg);
	}

	.button.icon-only {
		padding: var(--btn-padding-icon);
	}
</style>
