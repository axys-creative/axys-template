import { marked } from 'marked';

type Entry = { draft?: boolean; date: string };

/**
 * Turns a folder of JSON files (from `import.meta.glob`, eager) into a collection. The file name is
 * the slug and drafts are left out, newest first.
 */
export function collection<T extends Entry>(files: Record<string, { default: T }>) {
	const all = Object.entries(files)
		.map(([path, file]) => ({
			...file.default,
			slug: path
				.split('/')
				.pop()!
				.replace(/\.json$/, '')
		}))
		.filter((entry) => !entry.draft)
		.sort((a, b) => b.date.localeCompare(a.date));

	return {
		all,
		slugs: all.map((entry) => entry.slug),
		get: (slug: string) => all.find((entry) => entry.slug === slug)
	};
}

/** Markdown from the CMS to HTML. Only trusted editors write it, so it is not sanitized. */
export const renderMarkdown = (markdown: string) => marked.parse(markdown, { async: false });

/** Dates are stored as `YYYY-MM-DD` and always shown as that day, whatever the visitor's timezone. */
export const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' });
