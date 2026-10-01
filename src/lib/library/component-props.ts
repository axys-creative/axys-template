// LIBRARY: DELETE ME. Documentation text for the component and section docs; remove with the rest of the library.
import type { LibraryProp } from './library-section.svelte';

const props = (...pairs: [string, string][]): LibraryProp[] =>
	pairs.map(([name, description]) => ({ name, description }));

const tilt =
	'A boolean or tilt options (`max`, `reverse`, `velocityMax`, `inSpeed`, `outSpeed`, `idleMs`).';

export const buttonProps = props(
	['text', 'A string. Leave it out for an icon-only button and give it a `textDescription`.'],
	['textDescription', 'A string, the accessible name for screen readers.'],
	[
		'url',
		'A string. With a url the button is a link (`/page`, `#id`, `mailto:` or a full URL); without one it is a `<button>`.'
	],
	['newTab', 'A boolean. Opens in a new tab and tells screen readers it does.'],
	['type', '`solid | outline | underline | text`. Defaults to `solid`.'],
	['htmlType', '`button | submit | reset`. For the `<button>` version. Defaults to `button`.'],
	['size', '`sm | md | lg`. Defaults to `md`.'],
	['disabled', 'A boolean.'],
	['current', 'A boolean. Marks the link as the current page (`aria-current`).'],
	[
		'expanded',
		'A boolean, for buttons that open something (`aria-expanded`). The end icon flips when true.'
	],
	['controls', 'A string, the id of what the button opens (`aria-controls`).'],
	['iconStart', 'An icon name from `static/icons`, shown before the text.'],
	['iconEnd', 'An icon name from `static/icons`, shown after the text.'],
	['class', 'A string of extra classes.'],
	['onclick', 'A click handler for the `<button>` version.'],
	['...rest', 'Any other attribute, including attachments: `<Button {@attach magnet()} />`.']
);

export const ctaGroupProps = props(
	['primary', 'An object of Button props (without `type`). Shown as a solid button. Required.'],
	['secondary', 'An object of Button props (without `type`). Shown as an outline button.'],
	['justify', '`start | center`. Defaults to `start`.']
);

export const eyebrowProps = props(
	['text', 'A string. The small label above a title.'],
	['icon', 'An icon name from `static/icons`, shown before the text.'],
	['direction', '`row | column`. How the icon and text sit together. Defaults to `row`.']
);

export const iconProps = props(
	['name', 'A string, the icon file name in `static/icons` without `.svg`. Required.'],
	[
		'label',
		'A string. Gives the icon an accessible name. Without it the icon is hidden from screen readers.'
	],
	['size', '`sm | md | lg`. The icon is `1em` by default (`md`), so it scales with its text.'],
	['class', 'A string of extra classes.'],
	['...rest', 'Any other attribute for the `<span>`, such as `style`.']
);

export const logoProps = props(
	['src', 'A string, the path to the image.'],
	['text', 'A string shown beside the image.'],
	['alt', 'A string. The accessible name when there is no `text`.'],
	['url', 'A string. Wraps the logo in a link.'],
	[
		'tint',
		'A boolean. For single-color SVGs: draws the image in the text color so it follows light and dark themes.'
	]
);

export const menuLinksProps = props(
	[
		'links',
		'An array of Button props. Add a `links` array (also Button props) to an item to make it a dropdown. Required.'
	],
	['label', 'A string, the accessible name of the navigation. Required.'],
	['type', 'A Button `type` for every link. Defaults to `underline`.'],
	[
		'direction',
		'`row | column`. In a column, dropdowns open as accordions instead of popovers. Defaults to `row`.'
	],
	[
		'landmark',
		'A boolean. Render a `<nav>`. Turn off inside something that is already a `<nav>`. Defaults to `true`.'
	],
	['class', 'A string of extra classes.']
);

export const mouseCursorProps = props(
	['elastic', 'A boolean. Stretches and rotates the shape in the direction of movement.'],
	['tilt', tilt],
	[
		'variants',
		'An object of named looks, e.g. `{ menu: { size: 64 } }`. A look can set `size`, `opacity`, `background`, `border`, `color`, `transition` and `elastic`.'
	],
	[
		'defaultIcon',
		'An icon name used when an element asks for an icon without naming one. Defaults to `bolt`.'
	],
	[
		'duration',
		'A number, milliseconds the cursor takes to catch up with the mouse. Defaults to `333`.'
	],
	[
		'ease',
		'A function from catch-up progress (0 to 1) to distance travelled. Defaults to a front-loaded curve.'
	]
);

export const sectionCopyProps = props(
	['eyebrowText', 'A string for the eyebrow.'],
	['eyebrowIcon', 'An icon name for the eyebrow.'],
	['eyebrowDirection', '`row | column`. Defaults to `row`.'],
	['title', 'A string.'],
	[
		'level',
		'`1 | 2 | 3 | 4 | 5 | 6`. The heading level of the title. A page hero is `1`, other sections `2`. Defaults to `2`.'
	],
	[
		'titleStyle',
		'`h1 | h2 | h3 | h4 | h5 | h6`. Looks like another heading size without changing the level.'
	],
	['description', 'A string, or a snippet for rich content such as links.'],
	['cta', 'An object with a `primary` and optional `secondary` Button (see CTA Group).'],
	[
		'layout',
		'`column | row`. `row` puts the description beside the eyebrow and title and stacks below the md breakpoint. Defaults to `column`.'
	],
	['align', '`start | center`. Defaults to `start`.'],
	[
		'rowAlign',
		'`start | center | end`. How the two sides line up in a row layout. Defaults to `start`.'
	],
	['showEyebrow', 'A boolean. Defaults to `true`.'],
	['showTitle', 'A boolean. Defaults to `true`.'],
	['showDescription', 'A boolean. Defaults to `true`.'],
	['showCta', 'A boolean. Defaults to `true`.']
);

export const siteNavButtonProps = props(
	[
		'symbol',
		'`burger | chocolate | kebab`. Two lines, nine dots or three vertical dots. Defaults to `burger`.'
	],
	['shape', '`square | round`. Defaults to `square`.'],
	['type', '`icon | button`. `button` puts the symbol in a bordered box. Defaults to `icon`.'],
	['text', 'A string shown beside the symbol, e.g. `menu`.'],
	['expanded', 'A boolean. The open state; the burger turns into an X.'],
	['controls', 'A string, the id of the navigation it opens (`aria-controls`).'],
	['...rest', 'Any other button attribute, such as `onclick`.']
);

export const socialLinksProps = props(
	[
		'links',
		'An array of `{ title, url, icon }`. The icon is a name from `static/icons`. Required.'
	],
	['label', 'A string, the accessible name of the list. Defaults to `Social media`.']
);

export const tagProps = props(
	['text', 'A string. Required.'],
	['icon', 'An icon name from `static/icons`, shown before the text.'],
	['type', '`solid | outline | glass`. Defaults to `solid`.'],
	['class', 'A string of extra classes.']
);

export const tooltipProps = props(
	['message', 'A string, the text in the bubble. Required.'],
	['text', 'A string that triggers the tooltip. Without it an icon does.'],
	['icon', 'An icon name for the trigger. Defaults to `info-circle`.'],
	['size', '`xs | sm | md | lg`. The width of the bubble. Defaults to `md`.'],
	[
		'place',
		'`top | top-right | top-left | bottom | bottom-right | bottom-left | left | right`. Where the bubble sits on desktop. Defaults to `top`.'
	],
	[
		'placeSm',
		'The same options without `left` and `right`, used below the lg breakpoint. Defaults to `top`.'
	],
	['includePoint', 'A boolean. Adds a small pointer to the bubble.']
);

export const mouseTooltipProps = props(
	['message', 'A string, the text in the bubble. Required.'],
	['minWidth', 'A number, the minimum width of the bubble in px. Defaults to `280`.'],
	['tilt', tilt]
);

export const videoOverlayProps = props(
	['open', 'A boolean, bindable. `bind:open` to show or hide the video. Defaults to `false`.'],
	['src', 'A string, the video file. Self-hosted or CDN files are best. Required.'],
	['title', "A string, the dialog's accessible name. Defaults to `Video`."],
	['poster', 'A string, an image shown before the video plays.'],
	['captions', 'A string, the path to a `.vtt` captions file.'],
	['captionsLang', 'A string, the captions language. Defaults to `en`.']
);

export const heroSimpleProps = props(
	[
		'...SectionCopy props',
		'Takes every prop of Section Copy (see the Style Guide): `eyebrowText`, `eyebrowIcon`, `title`, `description`, `cta`, `layout`, `align`, the `show*` flags and the rest.'
	],
	['level', 'Defaults to `1`, since a hero is the page title.'],
	['align', 'Defaults to `center`.']
);

export const colorTokens = props(
	['--color-bg', 'The page background.'],
	['--color-surface', 'Cards, panels and other raised areas.'],
	['--color-text', 'Body text.'],
	['--color-text-muted', 'Supporting text such as descriptions.'],
	['--color-border', 'Borders and dividers.'],
	['--color-accent', 'The brand color for fills and borders.'],
	[
		'--color-accent-text',
		'The brand color when used as text. Darker in the light theme so it stays readable.'
	],
	['--color-secondary', 'A secondary brand color.'],
	['--color-tertiary', 'A tertiary brand color.'],
	['--color-error', 'Error messages.'],
	['--color-glass', 'The translucent tint behind glass surfaces such as the header.']
);

export const typographyTokens = props(
	['--font-heading', 'The heading font.'],
	['--font-body', 'The body font.'],
	['--font-mono', 'The mono-spaced font.'],
	[
		'.h1 to .h6',
		'Heading styles for any element, so the visual size and the heading level can differ.'
	],
	['.body, .body-large, .body-small', 'Body text sizes.']
);
