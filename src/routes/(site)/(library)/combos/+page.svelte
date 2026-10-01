<!-- LIBRARY: DELETE ME. Documentation page; remove with the rest of the library (see CLAUDE.md). -->
<script lang="ts">
	import Icon from '$lib/components/icon.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { mouseTooltip } from '$lib/attachments/mouse-tooltip';
	import { mouseTooltipProps, tooltipProps } from '$lib/library/component-props';
	import LibrarySection from '$lib/library/library-section.svelte';
	import HeroSimple from '$lib/sections/hero-simple.svelte';
	import { navEntry } from '$lib/utils/nav';

	const nav = navEntry('/combos');
</script>

<HeroSimple
	eyebrowText={nav.group}
	eyebrowIcon={nav.icon}
	title="Combos"
	description="One feature that comes in more than one form: a ready-made component, an attachment for any element, or both working together."
/>

<div class="combos">
	<LibrarySection
		title="Tooltip"
		type="Combo"
		description="A tooltip can be added in two ways, each with different pros and cons."
	>
		<LibrarySection
			level={3}
			title="Tooltip Component"
			tag="Stationary"
			description="`tooltip.svelte` opens on hover or keyboard focus, closes with Escape, and links its message to the trigger for screen readers."
			props={tooltipProps}
		>
			<div class="row">
				<Tooltip
					message="Sample message for tooltip 1. This is using the default props, but uses size sm."
					size="sm"
					place="top-right"
					placeSm="top-right"
				/>
				<Tooltip
					message="Tooltip 2 message. This uses the text prop for the trigger. It also positions the message bubble to the right of the trigger."
					text="Use text to trigger"
					place="right"
					placeSm="bottom-right"
					includePoint
				/>
			</div>
			<p>
				Does this work inline?
				<Tooltip
					message="Sample message for tooltip 3. This is the lengthy text example. Crazy how much text we can have here. Will it still work through? That is the right question to ask in cases like this. Hopefully we can cover all the edge cases to make this component solid and reusable for future projects. This uses size lg and place bottom-right."
					text="Trigger the tooltip here"
					size="lg"
					place="bottom-right"
					placeSm="bottom"
					includePoint
				/>
				then some text afterward.
			</p>
		</LibrarySection>

		<LibrarySection
			level={3}
			title="Tooltip Attachment"
			tag="Follows the mouse"
			description="`mouseTooltip` turns any element into a trigger. The bubble follows the mouse and moves to the other side of it near the edges of the screen. On keyboard focus or click it sits under the element until the mouse moves, and it hides while scrolling. It does not need the custom cursor."
			props={mouseTooltipProps}
			propsLabel="options"
		>
			<p>
				Tooltip attachment
				<button
					type="button"
					class="inline"
					{@attach mouseTooltip({
						message:
							'Recommended to use with keyboard accessible elements, so a button is the right trigger.',
						minWidth: 212,
						tilt: true
					})}
				>
					used with inline text
				</button>
				. The bubble is
				<button
					type="button"
					class="inline"
					{@attach mouseTooltip({
						message: 'This helps make sure the bubble stays in view. Pretty sweet!',
						minWidth: 250
					})}
				>
					edge aware
				</button>
				meaning it moves itself if it is too close to the edge of the screen.
			</p>
			<button
				type="button"
				class="icon-trigger"
				aria-label="More information"
				{@attach mouseTooltip({
					message:
						'What happens when you have a really long description? It wraps inside the bubble and stays readable.',
					minWidth: 250
				})}
			>
				<Icon name="info-circle" size="lg" />
			</button>
		</LibrarySection>
	</LibrarySection>
</div>

<style lang="scss">
	/* LIBRARY: DELETE ME */
	.combos {
		display: flex;
		flex-direction: column;
		gap: 64px;
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--body-padding);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 32px;
	}

	.inline,
	.icon-trigger {
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
	}

	.icon-trigger {
		font-size: 20px;
	}
</style>
