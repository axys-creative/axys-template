<!-- LIBRARY: DELETE ME. Documentation page; remove with the rest of the library (see CLAUDE.md). -->
<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import CtaGroup from '$lib/components/cta-group.svelte';
	import Eyebrow from '$lib/components/eyebrow.svelte';
	import Icon from '$lib/components/icon.svelte';
	import Logo from '$lib/components/logo.svelte';
	import MenuLinks from '$lib/components/menu-links.svelte';
	import SectionCopy from '$lib/components/section-copy.svelte';
	import SiteNavButton, { type SiteNavButtonProps } from '$lib/components/site-nav-button.svelte';
	import SocialLinks from '$lib/components/social-links.svelte';
	import Tag from '$lib/components/tag.svelte';
	import social from '$lib/content/global/social-media.json';
	import {
		buttonProps,
		colorTokens,
		ctaGroupProps,
		eyebrowProps,
		iconProps,
		logoProps,
		menuLinksProps,
		sectionCopyProps,
		siteNavButtonProps,
		socialLinksProps,
		tagProps,
		typographyTokens
	} from '$lib/library/component-props';
	import LibrarySection from '$lib/library/library-section.svelte';
	import HeroSimple from '$lib/sections/hero-simple.svelte';
	import { navEntry } from '$lib/utils/nav';

	const nav = navEntry('/style-guide');

	const colors = [
		'bg',
		'surface',
		'text',
		'text-muted',
		'border',
		'accent',
		'accent-text',
		'secondary',
		'tertiary',
		'error'
	];
	const icons = ['check', 'chevron-right', 'arrow-tr', 'new-tab', 'copy', 'x', 'mail', 'social-x'];
	const sizes = ['sm', 'md', 'lg'] as const;
	const symbols: NonNullable<SiteNavButtonProps['symbol']>[] = ['burger', 'chocolate', 'kebab'];
	const shapes: NonNullable<SiteNavButtonProps['shape']>[] = ['square', 'round'];
	let navOpen = $state(false);
	let show = $state({ eyebrow: true, title: true, description: true, cta: true });

	const sampleCopy = {
		eyebrowText: 'Eyebrow',
		eyebrowIcon: 'bolt',
		title: 'A title for the section',
		description:
			'A short description that supports the title and tells the visitor what to expect next.',
		cta: { primary: { text: 'Primary', url: '/' }, secondary: { text: 'Secondary', url: '/' } }
	};

	const sampleLinks = [
		{ text: 'Home', url: '/' },
		{
			text: 'Resources',
			links: [
				{ text: 'Style Guide', url: '/style-guide', iconStart: 'palette' },
				{ text: 'Attachments', url: '/attachments', iconStart: 'bolt' }
			]
		},
		{ text: 'Website', url: 'https://axyscreative.com', newTab: true }
	];
</script>

<HeroSimple
	eyebrowText={nav.group}
	eyebrowIcon={nav.icon}
	title="Style guide"
	description="Colors, type and the base components every site starts from."
/>

<div class="style-guide">
	<LibrarySection
		title="Colors"
		type="Tokens"
		description="CSS custom properties set on the root. The light theme overrides them with `data-theme` on `html`, so use the variable and never a fixed color."
		props={colorTokens}
		propsLabel="props"
	>
		<ul class="swatches">
			{#each colors as name (name)}
				<li>
					<span class="swatch" style="background: var(--color-{name})"></span>
					<code>--color-{name}</code>
				</li>
			{/each}
		</ul>
	</LibrarySection>

	<LibrarySection
		title="Typography"
		type="Tokens"
		description="Headings take their styles from the element, or from a `.h1` to `.h6` class on any element, so size and heading level can differ."
		props={typographyTokens}
		propsLabel="props"
	>
		<p class="h1">Heading 1</p>
		<p class="h2">Heading 2</p>
		<p class="h3">Heading 3</p>
		<p class="h4">Heading 4</p>
		<p class="h5">Heading 5</p>
		<p class="h6">Heading 6</p>
		<p class="body-large">Body large. The quick brown fox jumps over the lazy dog.</p>
		<p class="body">Body. The quick brown fox jumps over the lazy dog.</p>
		<p class="body-small">Body small. The quick brown fox jumps over the lazy dog.</p>
		<p><a href="#typography">A text link</a></p>
	</LibrarySection>

	<LibrarySection
		title="Button"
		type="Component"
		description="A link or a button, depending on whether it has a `url`. Accepts attachments directly."
		props={buttonProps}
	>
		<div class="row">
			{#each sizes as size (size)}
				<Button text="Solid {size}" {size} />
				<Button text="Outline {size}" {size} type="outline" />
			{/each}
		</div>
		<div class="row">
			<Button text="Underline" type="underline" />
			<Button text="Text" type="text" />
			<Button text="Link" url="/" />
			<Button text="New tab" url="https://example.com" newTab type="outline" />
			<Button text="Disabled" disabled />
		</div>
		<div class="row">
			<Button text="Icon end" iconEnd="chevron-right" />
			<Button text="Icon start" iconStart="copy" type="outline" />
			<Button textDescription="Close" iconStart="x" type="outline" />
		</div>
	</LibrarySection>

	<LibrarySection
		title="CTA Group"
		type="Component"
		description="A primary and an optional secondary button side by side."
		props={ctaGroupProps}
	>
		<CtaGroup primary={{ text: 'Primary', url: '/' }} secondary={{ text: 'Secondary', url: '/' }} />
	</LibrarySection>

	<LibrarySection
		title="Eyebrow"
		type="Component"
		description="The small label above a title, with an optional icon."
		props={eyebrowProps}
	>
		<div class="row">
			<Eyebrow text="Text only" />
			<Eyebrow text="With icon" icon="check" />
		</div>
	</LibrarySection>

	<LibrarySection
		title="Icon"
		type="Component"
		description="Draws an SVG from `static/icons` in the current text color, so it follows themes and hover states."
		props={iconProps}
	>
		<ul class="row icons">
			{#each icons as name (name)}
				<li>
					<Icon {name} size="lg" />
					<code>{name}</code>
				</li>
			{/each}
		</ul>
	</LibrarySection>

	<LibrarySection
		title="Logo"
		type="Component"
		description="An image, text, or both, optionally linked."
		props={logoProps}
	>
		<div class="row">
			<Logo src="/images/logo.svg" text="Tinted with text" tint />
			<Logo text="Text only" />
			<Logo src="/images/logo.svg" alt="Sample Business" tint />
		</div>
	</LibrarySection>

	<LibrarySection
		title="Menu Links"
		type="Component"
		description="A list of links with dropdowns: popovers in a row, accordions in a column. The header and footer use it."
		props={menuLinksProps}
	>
		<h3 class="plain">Row</h3>
		<MenuLinks links={sampleLinks} label="Sample row" />
		<h3 class="plain">Column</h3>
		<MenuLinks links={sampleLinks} label="Sample column" direction="column" />
	</LibrarySection>

	<LibrarySection
		title="Section Copy"
		type="Component"
		description="The eyebrow, title, description and buttons that open most sections. Spacing comes from `--space-eyebrow-title`, `--space-title-paragraph` and `--space-paragraph-cta-group`."
		props={sectionCopyProps}
	>
		<h3 class="plain">Show and hide</h3>
		<div class="row">
			<label><input type="checkbox" bind:checked={show.eyebrow} /> Eyebrow</label>
			<label><input type="checkbox" bind:checked={show.title} /> Title</label>
			<label><input type="checkbox" bind:checked={show.description} /> Description</label>
			<label><input type="checkbox" bind:checked={show.cta} /> Buttons</label>
		</div>
		<div class="copy-demo">
			<SectionCopy
				{...sampleCopy}
				level={3}
				showEyebrow={show.eyebrow}
				showTitle={show.title}
				showDescription={show.description}
				showCta={show.cta}
			/>
		</div>

		<h3 class="plain">Centered</h3>
		<div class="copy-demo">
			<SectionCopy {...sampleCopy} level={3} align="center" />
		</div>

		<h3 class="plain">Row: description beside the title</h3>
		<div class="copy-demo">
			<SectionCopy {...sampleCopy} level={3} layout="row" />
		</div>

		<h3 class="plain">Row, lined up at the bottom</h3>
		<div class="copy-demo">
			<SectionCopy {...sampleCopy} level={3} layout="row" rowAlign="end" />
		</div>
	</LibrarySection>

	<LibrarySection
		title="Site Nav Button"
		type="Component"
		description="The button that opens the mobile navigation. Click the toggle to see the open state."
		props={siteNavButtonProps}
	>
		<div class="row">
			<Button
				text={navOpen ? 'Reset to closed' : 'Set all open'}
				type="outline"
				onclick={() => (navOpen = !navOpen)}
			/>
		</div>
		<div class="nav-buttons">
			{#each symbols as symbol (symbol)}
				{#each shapes as shape (shape)}
					<div class="nav-button-sample">
						<SiteNavButton {symbol} {shape} expanded={navOpen} />
						<code>{symbol} / {shape}</code>
					</div>
				{/each}
			{/each}
			<div class="nav-button-sample">
				<SiteNavButton symbol="burger" text="menu" expanded={navOpen} />
				<code>with text</code>
			</div>
			<div class="nav-button-sample">
				<SiteNavButton symbol="burger" type="button" expanded={navOpen} />
				<code>button style</code>
			</div>
		</div>
	</LibrarySection>

	<LibrarySection
		title="Smooth Scroll"
		type="Component"
		description="Smooth scrolling with Lenis. It takes no props: mount it once in the site layout. Add `data-lenis-prevent` to anything that must scroll natively, such as a modal. To remove it, delete the component, its tag in the layout, and run `bun remove lenis`."
	/>

	<LibrarySection
		title="Social Links"
		type="Component"
		description="A row of icon links to social profiles, each opening in a new tab."
		props={socialLinksProps}
	>
		<SocialLinks links={social.links} />
	</LibrarySection>

	<LibrarySection
		title="Tag"
		type="Component"
		description="A small pill for labels and status."
		props={tagProps}
	>
		<div class="row">
			<Tag text="Solid" />
			<Tag text="Outline" type="outline" />
			<Tag text="Glass" type="glass" />
			<Tag text="With icon" icon="bolt" type="outline" />
		</div>
	</LibrarySection>
</div>

<style lang="scss">
	/* LIBRARY: DELETE ME */
	.style-guide {
		display: flex;
		flex-direction: column;
		gap: 64px;
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--body-padding);
	}

	.plain {
		margin: 16px 0 0;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		padding: 0;
		list-style: none;
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 16px;
		width: 100%;
		padding: 0;
		list-style: none;
	}

	.swatch {
		display: block;
		height: 56px;
		margin-bottom: 8px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.nav-buttons {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 24px;
		width: 100%;
	}

	.nav-button-sample {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}

	.copy-demo {
		width: 100%;
		padding: 32px;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius);
	}

	.icons li {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
</style>
