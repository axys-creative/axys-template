<script module lang="ts">
	import type { ButtonProps } from './button.svelte';

	export type NavLink = ButtonProps & { links?: ButtonProps[] };
</script>

<script lang="ts">
	import { textRoll } from '$lib/attachments/text-roll';
	import { page } from '$app/state';
	import Button from './button.svelte';
	import DropdownLink from './dropdown-link.svelte';

	type Props = {
		links: NavLink[];
		label: string;
		type?: ButtonProps['type'];
		direction?: 'row' | 'column';
		/** Render a `<nav>` landmark. Turn off when an ancestor is already the navigation landmark. */
		landmark?: boolean;
		class?: string;
	};

	let {
		links,
		label,
		type = 'underline',
		direction = 'row',
		landmark = true,
		class: className
	}: Props = $props();
</script>

{#if links.length}
	<svelte:element
		this={landmark ? 'nav' : 'div'}
		aria-label={landmark ? label : undefined}
		class={className}
	>
		<ul class="menu-links {direction}">
			{#each links as { links: children, ...link } (link.url ?? link.text)}
				<li>
					{#if children?.length}
						<DropdownLink
							text={link.text ?? ''}
							links={children}
							type={link.type ?? type}
							mode={direction === 'column' ? 'accordion' : 'popover'}
						/>
					{:else}
						<Button
							{...link}
							type={link.type ?? type}
							current={link.url === page.url.pathname}
							{@attach textRoll()}
						/>
					{/if}
				</li>
			{/each}
		</ul>
	</svelte:element>
{/if}

<style lang="scss">
	.menu-links {
		display: flex;
		gap: 24px;
		padding: 0;
		list-style: none;
	}

	.column {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}
</style>
