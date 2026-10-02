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
	['iconCircle', 'A boolean. Draws a ring around the end icon on hover. Defaults to `false`.'],
	[
		'iconEndAttach',
		'An attachment for the end icon alone, such as `magnet({ x: 1, y: 1 })`, so only the icon follows the mouse.'
	],
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
	[
		'name',
		'A string, the icon file name in `static/icons` without `.svg`, or a path starting with `/` to any single-color image (e.g. a CMS upload). Required.'
	],
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
		'An array of `{ title, url, icon }`. The icon is a name from `static/icons` or an image path such as `/uploads/social-x.svg`. Required.'
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

export const alertProps = props(
	['title', 'A string. Required.'],
	['message', 'A string under the title.'],
	['type', '`success | info | warning | error`. Sets the icon and color. Defaults to `info`.'],
	[
		'links',
		'An array of up to two Button props (`{ text, url, newTab }`), shown as underline links under the message.'
	],
	[
		'autoClose',
		'A number, milliseconds before the alert closes itself. `0` keeps it until it is closed. Hovering or focusing an alert holds the countdown. Defaults to `0`.'
	],
	[
		'timer',
		'A boolean. Shows a line that runs out as the alert closes. Needs `autoClose`. Defaults to `false`.'
	],
	[
		'leftBorder',
		'A boolean. A thick border in the alert color down the left edge. Defaults to `false`.'
	]
);

export const formProps = props(
	['variant', '`underline | outline`. The look of every field. Defaults to `underline`.'],
	[
		'feedback',
		'A boolean. Shows alerts on submit instead of going to another page. Defaults to `false`.'
	],
	[
		'name',
		'A string, the Netlify form name. Defaults to `form-feedback` with `feedback`, otherwise `form-redirect`.'
	],
	[
		'action',
		'A string, the page to go to after submitting. Not used with `feedback`. Defaults to `/form-submit`.'
	],
	['showPhone', 'A boolean. Adds a phone field, digits only. Defaults to `false`.'],
	['showAddress', 'A boolean. Adds city, state and zip fields. Defaults to `false`.'],
	[
		'showMessage',
		'A boolean. Adds a message textarea with a 250 character limit. Defaults to `false`.'
	],
	['showDiscovery', 'A boolean. Adds a "how did you hear about us" textarea. Defaults to `false`.'],
	['maxCountDiscovery', 'A number, the character limit of the discovery textarea.'],
	['showRecaptcha', "A boolean. Adds Netlify's reCAPTCHA widget. Defaults to `false`."],
	[
		'submitText',
		'A string, the button label. Defaults to `Send message` with `feedback`, otherwise `Submit`.'
	],
	['submitLabel', "A string, the button's accessible name."],
	['successTitle', 'A string, the success alert title. Only used with `feedback`.'],
	['successMessage', 'A string, the success alert message. Only used with `feedback`.'],
	['errorTitle', 'A string, the error alert title. Only used with `feedback`.'],
	['errorMessage', 'A string, the error alert message. Only used with `feedback`.'],
	[
		'duplicateMessage',
		'A string, the warning shown when an email that was already used submits again. Only used with `feedback`.'
	],
	['class', 'A string of extra classes.']
);

export const formFieldProps = props(
	['name', "A string, the field's name, sent with the form. Required."],
	[
		'label',
		'A string. It rests inside the field and moves above it once the field is used. Required.'
	],
	[
		'type',
		'`text | email | tel | number | password | search | url | date | time | textarea | select`. Defaults to `text`. A `tel` field keeps digits only.'
	],
	[
		'variant',
		'`underline | outline`. A line under the field, or a full border. Defaults to `underline`.'
	],
	['required', 'A boolean. Defaults to `true`; screen readers are told when a field is required.'],
	['disabled', 'A boolean.'],
	['hint', 'A string of helper text under the field.'],
	['error', 'A string of error text under the field. It also marks the field invalid.'],
	['maxLength', 'A number. Limits a textarea and shows how many characters are left.'],
	[
		'options',
		'An array for a `select`: strings, `{ value, label, disabled }`, or `{ group, options }` for an `optgroup`.'
	],
	['datalist', 'An array of strings, native suggestions for a text field.'],
	['autocomplete', 'A string, the browser autofill hint such as `email`.'],
	['inputmode', '`text | numeric | tel | email`. Which keyboard a phone shows.'],
	['value', 'A string, bindable.'],
	['class', 'A string of extra classes. Fields in a flex row share the width.']
);

export const formChoiceProps = props(
	['name', 'A string, sent with the form. Required.'],
	['label', 'A string. Required.'],
	['type', '`checkbox | radio | switch`. Defaults to `checkbox`.'],
	['value', 'A string, what is sent when it is on. A radio needs one. Defaults to `on`.'],
	['checked', 'A boolean, bindable, for a checkbox or switch.'],
	['group', 'A string, bindable. For radios sharing a `name`: the selected `value`.'],
	['disabled', 'A boolean.'],
	['required', 'A boolean.']
);

export const formGroupProps = props(
	['legend', 'A string, the name of the group for screen readers, shown above it. Required.'],
	['direction', '`column | row`. How the choices sit. Defaults to `column`.'],
	['disabled', 'A boolean. Disables everything inside.'],
	['children', 'A snippet with the choices inside. Required.']
);

export const formControlProps = props(
	['type', '`range | color | file | progress | meter`. Required.'],
	['label', 'A string. Required.'],
	['name', 'A string, sent with the form.'],
	[
		'value',
		'A number or string, bindable. For `progress` and `meter` a number from `min` to `max`.'
	],
	['min', 'A number. Defaults to `0`.'],
	['max', 'A number. Defaults to `100`.'],
	['step', 'A number, for a range.'],
	['multiple', 'A boolean, for a file input.'],
	['accept', 'A string of file types, for a file input.'],
	['disabled', 'A boolean.']
);

export const accordionProps = props(
	[
		'items',
		'An array of `{ title, content }`. `content` is trusted HTML, so it can hold links. Required.'
	],
	[
		'icon',
		'An icon name from `static/icons`, shown at the end of each title and flipped when open.'
	],
	[
		'plus',
		'A boolean. A plus sign that turns into a minus, instead of an icon. Defaults to `false`.'
	],
	['singleOpen', 'A boolean. Only one item open at a time. Defaults to `false`.'],
	[
		'toggleAll',
		'A boolean. Shows a button that opens or closes every item; it reads "Close All" once all are open and goes back to "Open All" only when all are closed. Ignored with `singleOpen`. Defaults to `false`.'
	],
	[
		'toggleAllTextOpen',
		'A string, the button label while any item is closed. Defaults to `Open All`.'
	],
	['toggleAllTextClose', 'A string, the button label once all are open. Defaults to `Close All`.']
);

export const accordionTableProps = props(
	[
		'columns',
		'An array of `{ key, label, type, width }`. `key` is the field read off each item, `label` the header text, `type` is `image` to show an `{ src, alt }` image (anything else is text), and `width` is any CSS grid track size (`1fr` by default). Required.'
	],
	[
		'items',
		'An array of objects with a field per column `key`, plus `content`, trusted HTML shown when the row is open. A row can also have `images` (an array of `{ src, alt }` shown in a Carousel under the content), its own `slidesPerView`, and a `cta` (Button props) under the carousel. Required.'
	],
	[
		'icon',
		'An icon name from `static/icons`, shown along the right edge of each row and flipped when open.'
	],
	['singleOpen', 'A boolean. Only one row open at a time. Defaults to `false`.'],
	[
		'sticky',
		'A boolean. Pins the header row while scrolling through the rows. Defaults to `false`.'
	],
	[
		'contentColumn',
		'A number, the 1-indexed column the opened content lines up with. Defaults to `2`.'
	]
);

export const counterProps = props(
	['digit', 'A number to count to. Required.'],
	['comma', 'A boolean. Separate thousands with commas. Defaults to `false`.'],
	['prefix', 'A string before the number, such as `$`.'],
	['suffix', 'A string after the number, such as `M`.'],
	['label', 'A string describing what the number measures.'],
	[
		'spokenLabel',
		'A string for screen readers. Defaults to the final number and the label, since the counting itself is hidden from them.'
	],
	['duration', 'A number, milliseconds to count. Not used with `ticker`. Defaults to `2400`.'],
	[
		'once',
		'A boolean. Only counts the first time it scrolls into view, instead of every time. Defaults to `false`.'
	],
	['ticker', 'A boolean. Rolls each digit up a column instead of counting. Defaults to `false`.'],
	['class', 'A string of extra classes.']
);

export const carouselProps = props(
	[
		'slides',
		'An array of `{ img, alt, title, desc }`. Every field is optional; `alt` falls back to the title. Required.'
	],
	['label', 'A string, the accessible name of the carousel. Defaults to `Carousel`.'],
	['pagination', '`arrows | dots | none`. Defaults to `arrows`.'],
	[
		'progress',
		'A boolean. Shows a non-interactive line that fills as the carousel advances, beside the pagination or alone with `pagination: none`. Defaults to `false`.'
	],
	[
		'cta',
		'An object of Button props, shown at the left of the footer, with the pagination moved to the right.'
	],
	[
		'loop',
		'A boolean. An endless loop: slides are repeated (hidden from assistive tech) and the position quietly resets once scrolling settles. Defaults to `false`.'
	],
	[
		'slidesPerView',
		'A number, how many slides show at once from the `md` breakpoint up. It is always one below. Defaults to `1`.'
	],
	[
		'autoplay',
		'An object `{ enabled, interval }`, with `interval` in milliseconds (`4000` by default). Pauses on hover and focus, and is off with reduced motion.'
	],
	[
		'class',
		'A string of extra classes. Style it with `--gap`, `--dot-size`, `--progress-width` and `--progress-height`.'
	]
);

export const cardGnomonProps = props(
	[
		'cutouts',
		'An array of `{ from, text }`, one per notch. `from` is a corner (`top-left`, `top-right`, `bottom-left`, `bottom-right`) or the middle of a side (`top`, `right`, `bottom`, `left`); `text` is shown inside that notch, sized to fill it. Any number can be combined. Defaults to one `top-right` notch with no text.'
	],
	[
		'depth',
		'A number, 0-100. How far every cutout reaches into the card, as a % of its side. Shared by all cutouts. If two cutouts would overlap on an edge, `depth` and `length` shrink together so they never collide. Defaults to `12`.'
	],
	[
		'length',
		'A number, 0-100. How far every cutout runs along its edge, as a % of the card side. Defaults to `32`.'
	],
	[
		'radius',
		'A number, 0-50. The corner curve as a % of the card side, applied to every corner including each notch. It is clamped so it never exceeds half the shortest edge. Defaults to `8`.'
	],
	[
		'angle',
		'A number, 45-90 degrees. Tilts each notch from a square step (`90`) toward a single diagonal. Keep it around 75-85 for a crisp diagonal with rounded ends; much lower and a large `radius` rounds the notch into one blob. Defaults to `90`.'
	],
	['borderWidth', 'A number in px, the stroke width. Defaults to `2`.'],
	[
		'img',
		'An object `{ src, alt, eager }` for the image that fills the card. `eager` loads it right away instead of lazily.'
	],
	['children', 'A snippet for anything else the card holds, shown over the image.'],
	[
		'class',
		'A string of extra classes. Set `--card-size` to change the width (`25vw`, or `50vw` on small screens).'
	]
);

export const postCardProps = props(
	[
		'post',
		'An object: `slug`, `title`, `description`, `author`, `date` (`YYYY-MM-DD`), `tag`, `coverImage` and `coverAlt`. Links to `/blog/{slug}`. Required.'
	],
	[
		'featured',
		'A boolean. Lays the card out wide with the image beside the text. Defaults to `false`.'
	]
);

export const blogArticleHeroProps = props(
	['title', 'A string, the post title (the page `h1`). Required.'],
	['description', 'A string shown under the title.'],
	['author', 'A string.'],
	['date', 'A string, `YYYY-MM-DD`. Required.'],
	['tag', 'A string shown as a tag before the date.'],
	['coverImage', 'A string, the image path. It drifts slightly as the page scrolls.'],
	['coverAlt', 'A string, the image description. Leave empty if it is decorative.']
);

export const blogArticleBodyProps = props([
	'html',
	'A string of trusted HTML, rendered from the post Markdown by `renderMarkdown`. Required.'
]);

export const heroSimpleProps = props(
	[
		'...SectionCopy props',
		'Takes every prop of Section Copy (see the Style Guide): `eyebrowText`, `eyebrowIcon`, `title`, `description`, `cta`, `layout`, `align`, the `show*` flags and the rest.'
	],
	[
		'compact',
		'A boolean. A shorter hero (40% of the screen instead of 80%), e.g. above a list. Defaults to `false`.'
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
