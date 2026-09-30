<script lang="ts">
	import Button, { type ButtonProps } from './button.svelte';

	type Props = {
		primary: Omit<ButtonProps, 'type'>;
		secondary?: Omit<ButtonProps, 'type'>;
	};

	let { primary, secondary }: Props = $props();
</script>

<div class="cta-group">
	<Button {...primary} type="solid" />
	{#if secondary}
		<Button {...secondary} type="outline" />
	{/if}
</div>

<style lang="scss">
	.cta-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--cta-group-gap);
	}
</style>
