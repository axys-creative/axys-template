<script module lang="ts">
	import type { HeaderNavProps } from './header-types';

	export type HeaderIslandProps = HeaderNavProps & {
		/** A translucent, blurred background. */
		blur?: boolean;
		/** The glass attachment's background: refraction in Chrome, blur elsewhere. Wins over `blur`. */
		glass?: boolean;
		hideOnScroll?: boolean;
	};
</script>

<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { glass as glassEffect } from '$lib/attachments/glass';
	import { textRoll } from '$lib/attachments/text-roll';
	import { watchScroll } from '$lib/attachments/watch-scroll';
	import Button, { type ButtonProps } from './button.svelte';
	import Logo from './logo.svelte';
	import MenuLinks from './menu-links.svelte';
	import SiteNavButton from './site-nav-button.svelte';
	import SocialLinks from './social-links.svelte';

	let {
		logo,
		links = [],
		ctas = [],
		socialLinks = [],
		navFooterLinks = [],
		adminLogin = false,
		showSkipLink = true,
		navButton = {},
		blur = false,
		glass = false,
		hideOnScroll = true
	}: HeaderIslandProps = $props();

	const id = $props.id();
	const panelId = `${id}-navigation`;
	const footerLinks = $derived<ButtonProps[]>([
		...navFooterLinks,
		...(adminLogin ? [{ text: 'Admin Log In', url: '/admin' }] : [])
	]);

	let open = $state(false);
	let island = $state<HTMLElement>();

	const close = () => (open = false);

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape' || !open) return;
		close();
		island?.querySelector<HTMLElement>('.bar button')?.focus();
	};

	// A press anywhere else, or focus moving out of the island, closes it.
	const onPointerdown = (event: PointerEvent) => {
		if (open && island && !island.contains(event.target as Node)) close();
	};
	const onFocusout = (event: FocusEvent) => {
		if (open && island && !island.contains(event.relatedTarget as Node | null)) close();
	};

	const onPanelClick = (event: MouseEvent) => {
		if ((event.target as Element).closest('a')) close();
	};

	afterNavigate(close);
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerdown} />

<header
	class="header"
	data-nav-open={open || undefined}
	{@attach hideOnScroll ? watchScroll() : undefined}
>
	{#if showSkipLink}
		<a class="skip-link" href="#main">Skip to main content</a>
	{/if}

	<div
		class="island"
		class:open
		class:blur={blur && !glass}
		class:has-glass={glass}
		bind:this={island}
		onfocusout={onFocusout}
	>
		{#if glass}<div class="glass-layer" aria-hidden="true" {@attach glassEffect()}></div>{/if}

		<div class="bar">
			{#if logo}<Logo {...logo} url="/" />{/if}
			<SiteNavButton
				{...navButton}
				expanded={open}
				controls={panelId}
				onclick={() => (open = !open)}
			/>
		</div>

		<!-- The panel is a grid that grows from no height, so the island opens downward. -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
		<nav
			id={panelId}
			class="panel"
			aria-label="Site navigation"
			inert={!open}
			data-lenis-prevent
			onclick={onPanelClick}
		>
			<div class="content">
				<div class="main">
					<MenuLinks
						class="panel-links"
						{links}
						label="Primary"
						direction="column"
						landmark={false}
					/>

					{#if ctas.length}
						<div class="ctas">
							{#each ctas as cta (cta.url ?? cta.text)}
								<Button {...cta} {@attach textRoll()} />
							{/each}
						</div>
					{/if}
				</div>

				<div class="footer">
					{#if footerLinks.length}
						<ul class="footer-links">
							{#each footerLinks as link (link.url ?? link.text)}
								<li><Button {...link} type="underline" size="sm" {@attach textRoll()} /></li>
							{/each}
						</ul>
					{/if}
					<SocialLinks links={socialLinks} />
				</div>
			</div>
		</nav>
	</div>
</header>

<style lang="scss">
	@use 'base/mixins';

	// The header takes no room in the page. It sticks to the top and the island floats over what scrolls beneath.
	.header {
		position: sticky;
		top: 0;
		z-index: var(--z-header);
		height: 0;
	}

	.island {
		--island-width: 420px;
		--island-padding: 8px;

		position: absolute;
		top: var(--float-offset);
		left: 50%;
		display: flex;
		flex-direction: column;
		width: min(calc(100% - var(--float-offset) * 2), var(--island-width));
		max-height: calc(100dvh - var(--float-offset) * 2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-bg);
		translate: -50% 0;
		padding: var(--island-padding);

		@include mixins.mq-motion-allow {
			transition:
				width 0.4s var(--ease),
				translate var(--duration) var(--ease);
		}

		&.open {
			--island-width: 560px;
		}
	}

	.header:global([data-scroll-down]):not(:focus-within):not([data-nav-open]) .island {
		translate: -50% calc(-100% - var(--float-offset) * 2);
	}

	// The blur sits on a pseudo-element, and glass on its own layer, so the panel inside stays crisp.
	.blur,
	.has-glass {
		background: transparent;
	}

	.glass-layer {
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
	}

	.blur::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		@include mixins.glass;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 8px 12px 8px 24px;
	}

	.panel {
		display: grid;
		grid-template-rows: 0fr;
		min-height: 0;
		visibility: hidden;

		@include mixins.mq-motion-allow {
			transition:
				grid-template-rows 0.4s var(--ease),
				visibility 0.4s;
		}
	}

	.open .panel {
		grid-template-rows: 1fr;
		visibility: visible;
		padding-block-start: 24px;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 32px;
		min-height: 0;
		padding-inline: 24px;
		overflow: hidden;
		opacity: 0;

		@include mixins.mq-motion-allow {
			transition:
				padding 0.4s var(--ease),
				opacity var(--duration) var(--ease);
		}
	}

	// Open, it scrolls if the links are taller than the screen.
	.open .content {
		padding-block: 8px 24px;
		overflow: auto;
		opacity: 1;
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: 32px;

		@include mixins.min-md {
			flex-direction: row;
			align-items: flex-start;
			justify-content: space-between;
		}
	}

	.panel :global(.panel-links) {
		--btn-font-size: 24px;
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;

		@include mixins.min-md {
			flex-direction: column;
			align-items: flex-end;
		}
	}

	.footer {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		padding-block-start: 24px;
		border-block-start: 1px solid var(--color-border);

		@include mixins.min-md {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1ch 24px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.skip-link {
		position: absolute;
		top: var(--float-offset);
		left: var(--float-offset);
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;

		&:focus {
			width: auto;
			height: auto;
			padding: 8px 16px;
			clip-path: none;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-btn);
			background: var(--color-bg);
		}
	}
</style>
