import type { Attachment } from 'svelte/attachments';
import './rich-text.scss';

type Behavior = () => Promise<Attachment<HTMLElement>>;

// One line per behavior an admin can ask for with a class. Delete a line, and its attachment file, to remove it.
const behaviors: Record<string, Behavior> = {
	scribble: async () => (await import('./scribble')).scribble({ curve: 'random' })
};

/** Runs the behaviors that `richText` marks with `data-rich-text` on the spans inside this element. Pass the text so it runs again when the text changes. */
export function richTextBehaviors(text?: string): Attachment<HTMLElement> {
	return (element) => {
		void text;
		let cancelled = false;
		const cleanups: (() => void)[] = [];

		element.querySelectorAll<HTMLElement>('[data-rich-text]').forEach(async (target) => {
			const load = behaviors[target.dataset.richText ?? ''];
			if (!load) return;
			const attach = await load();
			if (cancelled) return;
			const cleanup = attach(target);
			if (typeof cleanup === 'function') cleanups.push(cleanup);
		});

		return () => {
			cancelled = true;
			cleanups.forEach((cleanup) => cleanup());
		};
	};
}
