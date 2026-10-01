import type { Attachment } from 'svelte/attachments';
import { cursor, type CursorClaim } from '$lib/utils/cursor.svelte';
import type { VelocityTiltOptions } from '$lib/utils/velocity-tilt';

export type CursorContentOptions = {
	/** Text shown inside the cursor. */
	message?: string;
	/** An icon name from `static/icons`, or `true` for the cursor's default icon. */
	icon?: string | true;
	iconSize?: 'sm' | 'md' | 'lg';
	iconColor?: string;
	/** A second icon the cursor swaps to each time the element is clicked, e.g. play and pause. */
	iconSwap?: string;
	/** A named look from `<MouseCursor variants>`. */
	variant?: string;
	/** Tilt the cursor by how fast the mouse moves while over this element. */
	tilt?: boolean | VelocityTiltOptions;
};

export function cursorContent({
	message,
	icon,
	iconSize,
	iconColor,
	iconSwap,
	variant,
	tilt
}: CursorContentOptions = {}): Attachment<HTMLElement> {
	return (el) => {
		const owner = Symbol('cursor-content');
		let swapped = false;
		let claimed = false;

		const claim = (): CursorClaim => ({
			variant,
			content: { message, icon: swapped && iconSwap ? iconSwap : icon, iconSize, iconColor },
			tilt: tilt === true ? {} : tilt || undefined
		});

		const onEnter = (event: PointerEvent) => {
			if (event.pointerType !== 'mouse') return;
			claimed = true;
			cursor.claim(owner, claim());
		};

		const onLeave = () => {
			claimed = false;
			cursor.release(owner);
		};

		const onClick = () => {
			if (!iconSwap) return;
			swapped = !swapped;
			if (claimed) cursor.claim(owner, claim());
		};

		el.addEventListener('pointerenter', onEnter);
		el.addEventListener('pointerleave', onLeave);
		el.addEventListener('click', onClick);

		return () => {
			el.removeEventListener('pointerenter', onEnter);
			el.removeEventListener('pointerleave', onLeave);
			el.removeEventListener('click', onClick);
			cursor.release(owner);
		};
	};
}
