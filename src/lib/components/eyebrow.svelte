<script lang="ts">
	import Icon from './icon.svelte';

	type Props = {
		text?: string;
		/** Icon name from `static/icons`. */
		icon?: string;
		direction?: 'row' | 'column';
	};

	let { text, icon, direction = 'row' }: Props = $props();
</script>

{#if icon || text}
	<div class="eyebrow" class:column={direction === 'column'}>
		{#if icon}
			<span class="eyebrow-icon"><Icon name={icon} /></span>
		{/if}
		{#if text}
			<span class="eyebrow-text">{text}</span>
		{/if}
	</div>
{/if}

<style lang="scss">
	.eyebrow {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
		color: var(--color-accent-text);
	}

	.eyebrow.column {
		flex-direction: column;
		align-items: flex-start;
	}

	.eyebrow-icon {
		display: inline-flex;
	}

	.eyebrow-text {
		font-family: var(--font-mono);
		font-size: 14px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
