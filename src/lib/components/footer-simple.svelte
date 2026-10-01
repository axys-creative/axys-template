<script module lang="ts">
	import type { ButtonProps } from './button.svelte';
	import type { LogoProps } from './logo.svelte';
	import type { SocialLink } from './social-links.svelte';

	export type FooterSimpleProps = {
		logo?: LogoProps;
		message?: string;
		socialLinks?: SocialLink[];
		linksets?: { title?: string; links: ButtonProps[] }[];
		legalLinks?: ButtonProps[];
		returnToTop?: ButtonProps;
		copyright?: string;
		showThemeToggle?: boolean;
		includeTop?: boolean;
		includeBottom?: boolean;
		divider?: boolean;
		float?: boolean;
		glass?: boolean;
	};
</script>

<script lang="ts">
	import site from '$lib/content/meta/site.json';
	import Button from './button.svelte';
	import Logo from './logo.svelte';
	import MenuLinks from './menu-links.svelte';
	import SocialLinks from './social-links.svelte';
	import ThemeToggle from './theme-toggle.svelte';

	let {
		logo,
		message,
		socialLinks = [],
		linksets = [],
		legalLinks = [],
		returnToTop,
		copyright,
		showThemeToggle = false,
		includeTop = true,
		includeBottom = true,
		divider = true,
		float = false,
		glass = false
	}: FooterSimpleProps = $props();

	const copyrightText = $derived(
		copyright || `© ${new Date().getFullYear()} ${site.siteName}. All rights reserved.`
	);
</script>

<footer class="footer" class:float class:glass>
	<div class="inner">
		{#if includeTop}
			<div class="top">
				<div class="top-left">
					{#if logo}<Logo {...logo} url="/" />{/if}
					{#if message}<p class="message">{message}</p>{/if}
					<SocialLinks links={socialLinks} />
				</div>

				{#if linksets.length}
					<div class="linksets">
						{#each linksets as { title, links } (title ?? links[0]?.url)}
							<div class="linkset">
								{#if title}<strong>{title}</strong>{/if}
								<MenuLinks {links} label={title ?? 'Footer'} direction="column" />
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		{#if divider && includeTop && includeBottom}<hr />{/if}

		{#if includeBottom}
			<div class="bottom">
				<div class="bottom-start">
					{#if returnToTop}<Button {...returnToTop} />{/if}
				</div>
				<p class="copyright">{copyrightText}</p>
				<div class="bottom-end">
					<MenuLinks links={legalLinks} label="Legal" />
					{#if showThemeToggle}<ThemeToggle />{/if}
				</div>
			</div>
		{/if}
	</div>
</footer>

<style lang="scss">
	@use 'base/mixins';

	.footer {
		margin-block-start: auto;
		border-block-start: 1px solid var(--color-border);
		background: var(--color-bg);
	}

	.float {
		width: calc(100% - var(--float-offset) * 2);
		max-width: var(--content-width);
		margin: auto auto var(--float-offset);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.glass {
		@include mixins.glass;
	}

	.inner {
		max-width: var(--content-width);
		margin-inline: auto;
		padding: 48px var(--body-padding);
	}

	.top {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 48px;

		@include mixins.min-lg {
			flex-direction: row;
		}
	}

	.top-left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
	}

	.message {
		max-width: 420px;
		color: var(--color-text-muted);
	}

	.linksets {
		display: flex;
		flex-wrap: wrap;
		gap: 64px;
	}

	.linkset strong {
		display: block;
		margin-block-end: 12px;
		color: var(--color-text-muted);
	}

	hr {
		margin-block: 48px;
		border: 0;
		height: 1px;
		background: var(--color-border);
	}

	.bottom {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;

		@include mixins.min-xl {
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			align-items: center;
		}
	}

	.copyright {
		order: 1;
		color: var(--color-text-muted);
		font-size: 14px;

		@include mixins.min-xl {
			order: 0;
		}
	}

	.bottom-end {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;

		@include mixins.min-xl {
			justify-self: end;
		}
	}
</style>
