import type { Attachment } from 'svelte/attachments';
import { textScroll } from '$lib/utils/text-scroll';
import './text-split.scss';

export type TextIntroOptions = {
	type?: 'chars' | 'words';
	/** Seconds each piece takes to slide in. */
	duration?: number;
	/** Seconds between each piece starting. */
	stagger?: number;
	/** A GSAP ease for the pieces. */
	ease?: string;
	/** Seconds the text takes to travel to its place. */
	travel?: number;
	/** A GSAP ease for the travel. */
	travelEase?: string;
	/** Seconds to wait before the travel starts. */
	hold?: number;
	/** Seconds to wait before anything starts, e.g. for a loader to lift. */
	delay?: number;
};

/**
 * Plays once when the element mounts: the text reveals piece by piece at the right edge of its section,
 * then travels left to where it really sits.
 */
export function textIntro({
	type = 'words',
	duration = 0.6,
	stagger = 0.08,
	ease = 'power3.out',
	travel = 1.2,
	travelEase = 'power3.inOut',
	hold = 0.15,
	delay = 0
}: TextIntroOptions = {}): Attachment<HTMLElement> {
	return (el) => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		el.style.visibility = 'hidden';

		const stop = textScroll(
			el,
			type,
			{},
			({ gsap, targets }) => {
				const section = el.closest('section') ?? document.body;
				const edge =
					section.getBoundingClientRect().right -
					parseFloat(getComputedStyle(section).paddingRight);
				const right = Math.max(...targets.map((piece) => piece.getBoundingClientRect().right));

				el.style.visibility = '';
				return gsap
					.timeline({ delay })
					.set(el, { x: Math.max(0, edge - right) })
					.fromTo(targets, { y: '100%' }, { y: '0%', duration, stagger, ease })
					.to(el, { x: 0, duration: travel, ease: travelEase }, `>+${hold}`);
			},
			true
		);

		return () => {
			stop();
			el.style.visibility = '';
		};
	};
}
