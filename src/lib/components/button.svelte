<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type ButtonProps = {
		text: string;
		textDescription?: string;
		url?: string;
		newTab?: boolean;
		type?: 'solid' | 'outline';
		htmlType?: 'button' | 'submit' | 'reset';
		size?: 'sm' | 'md' | 'lg';
		iconStart?: Snippet;
		iconEnd?: Snippet;
	};
</script>

<script lang="ts">
	let {
		text,
		textDescription,
		url,
		newTab = false,
		type = 'solid',
		htmlType = 'button',
		size = 'md',
		iconStart,
		iconEnd
	}: ButtonProps = $props();
</script>

{#snippet content()}
	{#if iconStart}
		<span class="icon">{@render iconStart()}</span>
	{/if}
	<span class="text">{text}</span>
	{#if iconEnd}
		<span class="icon">{@render iconEnd()}</span>
	{/if}
{/snippet}

{#if url}
	<a
		class="button {type} {size}"
		href={url}
		aria-label={textDescription}
		target={newTab ? '_blank' : undefined}
		rel={newTab ? 'noopener noreferrer' : undefined}
	>
		{@render content()}
	</a>
{:else}
	<button class="button {type} {size}" type={htmlType} aria-label={textDescription}>
		{@render content()}
	</button>
{/if}

<style lang="scss">
	@use 'base/mixins';

	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: var(--radius);
		font-family: var(--font-body);
		font-weight: 600;
		line-height: 1;
		text-decoration: none;
		cursor: pointer;
	}

	.button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.solid {
		@include mixins.btn-type-solid;
	}

	.outline {
		@include mixins.btn-type-outline;
	}

	.icon {
		display: inline-flex;
	}

	.sm {
		padding: 8px 16px;
		font-size: 14px;
	}

	.md {
		padding: 12px 24px;
		font-size: 16px;
	}

	.lg {
		padding: 16px 32px;
		font-size: 20px;
	}
</style>
