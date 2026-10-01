import type { Attachment } from 'svelte/attachments';
import underline from './scribble-underline.svg?url';
import './scribble.scss';

export type ScribbleType = 'underline';

export type ScribbleOptions = {
	type?: ScribbleType;
	/** URL of a custom SVG to use instead of the built-in one. */
	src?: string;
};

const sources: Record<ScribbleType, string> = { underline };

/** Draws a hand-drawn SVG scribble on any element. */
export function scribble({
	type = 'underline',
	src
}: ScribbleOptions = {}): Attachment<HTMLElement> {
	return (el) => {
		el.classList.add('scribble', `scribble--${type}`);
		el.style.setProperty('--scribble-src', `url("${src ?? sources[type]}")`);

		return () => {
			el.classList.remove('scribble', `scribble--${type}`);
			el.style.removeProperty('--scribble-src');
		};
	};
}
