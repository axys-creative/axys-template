<script module lang="ts">
	import type { ButtonProps } from './button.svelte';
	import type { HeaderNavProps } from './header-types';

	export type HeaderSimpleProps = HeaderNavProps & {
		linkPlacement?: 'start' | 'center' | 'end';
		float?: boolean;
		/** A translucent, blurred background. */
		blur?: boolean;
		/** The glass attachment's background: refraction in Chrome, blur elsewhere. Wins over `blur`. */
		glass?: boolean;
		hideOnScroll?: boolean;
	};
</script>

<script lang="ts">
	import { glass as glassEffect } from '$lib/attachments/glass';
	import { textRoll } from '$lib/attachments/text-roll';
	import { watchScroll } from '$lib/attachments/watch-scroll';
	import Button from './button.svelte';
	import Logo from './logo.svelte';
	import MenuLinks from './menu-links.svelte';
	import SiteNavButton from './site-nav-button.svelte';
	import SocialLinks from './social-links.svelte';

	let {
		logo,
		links = [],
		ctas = [],
		socialLinks = [],
		linkPlacement = 'end',
		float = false,
		blur = false,
		glass = false,
		hideOnScroll = true,
		showSkipLink = true,
		navButton = {},
		navFooterLinks = [],
		adminLogin = false
	}: HeaderSimpleProps = $props();

	const navId = 'site-navigation';
	const footerLinks = $derived<ButtonProps[]>([
		...navFooterLinks,
		...(adminLogin ? [{ text: 'Admin Log In', url: '/admin' }] : [])
	]);

	let open = $state(false);
	let buttonWrapper = $state<HTMLElement>();

	const toggle = () => (open = !open);
	const close = () => (open = false);

	// While the navigation is open, everything behind it is out of reach for keyboards and screen readers.
	$effect(() => {
		if (!open) return;

		const behind = document.querySelectorAll<HTMLElement>('main, footer');
		behind.forEach((el) => (el.inert = true));
		document.body.style.overflow = 'hidden';

		return () => {
			behind.forEach((el) => (el.inert = false));
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		const query = matchMedia('(min-width: 1024px)');
		const onChange = () => query.matches && close();
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	});

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape' || !open) return;
		close();
		buttonWrapper?.querySelector('button')?.focus();
	};

	const onNavClick = (event: MouseEvent) => {
		if ((event.target as Element).closest('a')) close();
	};
</script>

<svelte:window onkeydown={onKeydown} />

<header
	class="header {linkPlacement}"
	class:float
	class:blur={blur && !glass}
	class:has-glass={glass}
	data-nav-open={open || undefined}
	{@attach hideOnScroll ? watchScroll() : undefined}
>
	{#if glass}<div class="glass-layer" aria-hidden="true" {@attach glassEffect()}></div>{/if}

	{#if showSkipLink}
		<a class="skip-link" href="#main">Skip to main content</a>
	{/if}

	<div class="inner">
		{#if logo}<Logo {...logo} url="/" />{/if}

		<MenuLinks
			class="links"
			{links}
			label="Primary"
			dropdownSurface={glass ? 'glass' : blur ? 'blur' : 'solid'}
		/>

		{#if ctas.length}
			<div class="ctas">
				{#each ctas as cta (cta.url ?? cta.text)}
					<Button {...cta} {@attach textRoll()} />
				{/each}
			</div>
		{/if}

		<div class="nav-button" bind:this={buttonWrapper}>
			<SiteNavButton {...navButton} expanded={open} controls={navId} onclick={toggle} />
		</div>
	</div>
</header>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<nav
	id={navId}
	class="site-nav"
	class:open
	aria-label="Site navigation"
	inert={!open}
	data-lenis-prevent
	onclick={onNavClick}
>
	<div class="constraint">
		<MenuLinks class="site-nav-links" {links} label="Primary" direction="column" landmark={false} />

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

<style lang="scss">
	@use 'base/mixins';

	.header {
		position: sticky;
		top: 0;
		z-index: var(--z-header);
		border-block-end: 1px solid var(--color-border);
		background: var(--color-bg);

		@include mixins.mq-motion-allow {
			transition: translate var(--duration) var(--ease);
		}

		&:global([data-scroll-down]):not(:focus-within):not([data-nav-open]) {
			translate: 0 -100%;
		}
	}

	.float {
		top: var(--float-offset);
		width: calc(100% - var(--float-offset) * 2);
		max-width: var(--content-width);
		margin: var(--float-offset) auto 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);

		&:global([data-scroll-down]):not(:focus-within):not([data-nav-open]) {
			translate: 0 calc(-100% - var(--float-offset) * 2);
		}
	}

	// The blur sits on a pseudo-element, and glass on its own layer, so dropdown panels can still blur the page behind them.
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

	.blur {
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			border-radius: inherit;
			@include mixins.glass;
		}
	}

	.inner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		max-width: var(--content-width);
		margin-inline: auto;
		padding: 12px var(--body-padding);
	}

	.header :global(.links),
	.ctas {
		display: none;

		@include mixins.min-lg {
			display: flex;
		}
	}

	.ctas {
		align-items: center;
		gap: 2ch;
	}

	.start :global(.links) {
		margin-inline-end: auto;
	}

	.end :global(.links) {
		margin-inline-start: auto;
	}

	.center :global(.links) {
		position: absolute;
		left: 50%;
		translate: -50% 0;
	}

	.nav-button {
		margin-inline-start: auto;

		@include mixins.min-lg {
			display: none;
		}
	}

	.skip-link {
		position: absolute;
		top: 100%;
		left: 0;
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

	// The mobile navigation sits under the header and fades in.
	.site-nav {
		position: fixed;
		inset: 0;
		z-index: var(--z-nav);
		display: flex;
		flex-direction: column;
		overflow: auto;
		background: var(--color-bg);
		opacity: 0;
		visibility: hidden;
		pointer-events: none;

		@include mixins.mq-motion-allow {
			transition:
				opacity 0.24s ease,
				visibility 0.24s;
		}

		@include mixins.min-lg {
			display: none;
		}

		&.open {
			opacity: 1;
			visibility: visible;
			pointer-events: all;
		}
	}

	.constraint {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 48px;
		width: 100%;
		max-width: var(--content-width);
		height: 100dvh;
		min-height: 640px;
		margin: 0 auto var(--body-padding);
		padding: var(--body-padding);

		@include mixins.max-sm {
			min-height: 520px;
		}
	}

	.site-nav :global(.site-nav-links) {
		--btn-font-size: 24px;

		margin-block: max(40vh, 200px) auto;

		@include mixins.max-sm {
			--btn-font-size: 20px;

			margin-block: 32vh auto;
		}
	}

	.footer {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		width: 100%;

		@include mixins.min-md {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1ch;
		margin: 0;
		padding: 0;
		list-style: none;

		@include mixins.min-md {
			flex-direction: row;
		}
	}
</style>
