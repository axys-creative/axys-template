<script module lang="ts">
	import type { ButtonProps } from './button.svelte';
	import type { NavLink } from './menu-links.svelte';
	import type { SocialLink } from './social-links.svelte';

	export type SiteNavProps = {
		id: string;
		open: boolean;
		links?: NavLink[];
		/** Small links along the bottom. */
		footerLinks?: ButtonProps[];
		socialLinks?: SocialLink[];
		/** Shows at every screen size. Without it, it is for small screens only (a header shows its own links above that). */
		always?: boolean;
		/** `overlay` fills the screen. `slide` is a panel that slides in from the right, over about three quarters of the screen (all of it on the smallest), with no backdrop, and the social links in a strap at its bottom right. */
		variant?: 'overlay' | 'slide';
		/** The icon in the strap's loop, for the `slide` variant. */
		strapIcon?: string;
		/** The panel's background: a solid color, a translucent blur, or the glass attachment (refraction in Chrome, blur elsewhere). */
		surface?: 'solid' | 'blur' | 'glass';
		/** Called when a link inside is chosen. */
		onlink?: () => void;
	};
</script>

<script lang="ts">
	import { glass } from '$lib/attachments/glass';
	import { textRoll } from '$lib/attachments/text-roll';
	import Button from './button.svelte';
	import MenuLinks from './menu-links.svelte';
	import SocialLinks from './social-links.svelte';
	import Strap from './strap.svelte';

	let {
		id,
		open,
		links = [],
		footerLinks = [],
		socialLinks = [],
		always = false,
		variant = 'overlay',
		strapIcon = 'orbit',
		surface = 'solid',
		onlink
	}: SiteNavProps = $props();

	// While the navigation is open, everything behind it is out of reach for keyboards and screen readers, and the page
	// does not scroll.
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

	const onclick = (event: MouseEvent) => {
		if ((event.target as Element).closest('a')) onlink?.();
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<nav
	{id}
	class="site-nav {variant}"
	class:open
	class:always
	class:blur={surface === 'blur'}
	aria-label="Site navigation"
	inert={!open}
	data-lenis-prevent
	{onclick}
	{@attach surface === 'glass' ? glass({ blur: 16, tint: 'rgb(0 0 0 / 0.6)' }) : undefined}
>
	{#if variant === 'slide'}
		<div class="scroll">
			<MenuLinks
				class="site-nav-links"
				{links}
				label="Primary"
				direction="column"
				landmark={false}
			/>
		</div>

		<!-- The strap runs past the panel's edge, which clips it, so only its loop end shows. -->
		<div class="corner">
			{#if footerLinks.length}
				<ul class="footer-links">
					{#each footerLinks as link (link.url ?? link.text)}
						<li><Button {...link} type="underline" size="sm" {@attach textRoll()} /></li>
					{/each}
				</ul>
			{/if}

			<Strap icon={strapIcon} bleed={40}><SocialLinks links={socialLinks} /></Strap>
		</div>
	{:else}
		<div class="constraint">
			<MenuLinks
				class="site-nav-links"
				{links}
				label="Primary"
				direction="column"
				landmark={false}
			/>

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
	{/if}
</nav>

<style lang="scss">
	@use 'base/mixins';

	// A full-screen navigation that fades in under the header.
	.site-nav {
		position: fixed;
		inset: 0;
		z-index: var(--z-nav);
		display: flex;
		flex-direction: column;
		overflow: auto;
		background: var(--glass-tint, var(--color-bg));
		opacity: 0;
		visibility: hidden;
		pointer-events: none;

		@include mixins.mq-motion-allow {
			transition:
				opacity 0.24s ease,
				visibility 0.24s;
		}

		&:not(.always) {
			@include mixins.min-lg {
				display: none;
			}
		}

		&.blur {
			@include mixins.glass;
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
		max-width: calc(var(--content-width) + var(--body-padding) * 2);
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

	// The slide variant: a panel from the right with rounded left corners, over the page and not over a backdrop.
	.slide {
		inset: 0 0 0 auto;
		width: min(75vw, 640px);
		overflow: hidden;
		border-radius: 28px 0 0 28px;
		border-inline-start: 1px solid var(--color-border);
		// It only slides: it is fully opaque, and only off the screen when closed.
		opacity: 1;
		translate: 100% 0;

		@include mixins.mq-motion-allow {
			transition:
				translate 0.45s var(--ease),
				visibility 0.45s;
		}

		@include mixins.max-md {
			width: 100%;
			border-radius: 0;
			border-inline-start: 0;
		}

		&.open {
			translate: 0 0;
		}
	}

	.scroll {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		gap: 32px;
		min-height: 0;
		padding: 112px var(--body-padding) 24px;
		overflow: auto;

		@include mixins.max-md {
			padding-inline: 24px;
		}
	}

	.slide :global(.site-nav-links) {
		margin-block: auto;
	}

	// The links rise in one after another once the panel is moving.
	.slide :global(.site-nav-links > ul > li) {
		opacity: 0;
		translate: 64px 0;

		@include mixins.mq-motion-allow {
			transition:
				opacity 0.3s ease,
				translate 0.3s ease;
		}
	}

	.slide.open :global(.site-nav-links > ul > li) {
		opacity: 1;
		translate: 0 0;

		@include mixins.mq-motion-allow {
			@for $i from 1 through 8 {
				&:nth-of-type(#{$i}) {
					transition:
						opacity 1.2s var(--ease) #{0.2s + 0.1s * $i},
						translate 1.2s var(--ease) #{0.2s + 0.1s * $i};
				}
			}
		}
	}

	.corner {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: space-between;
		padding-block-end: 24px;
		padding-inline-start: var(--body-padding);

		@include mixins.max-md {
			padding-inline-start: 24px;
		}
	}

	.slide .footer-links {
		flex-direction: column;
	}

	// Pushed past the panel's right edge by the strap's own bleed, which the panel then clips. It slides in a moment
	// after the panel, from beyond that edge.
	.corner :global(.strap) {
		margin-inline-end: -40px;
		translate: 100% 0;

		@include mixins.mq-motion-allow {
			transition: translate 0.3s ease;
		}
	}

	.slide.open .corner :global(.strap) {
		translate: 0 0;

		@include mixins.mq-motion-allow {
			transition: translate 0.8s var(--ease) 0.25s;
		}
	}
</style>
