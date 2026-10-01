import type { Attachment } from 'svelte/attachments';
import './glass.scss';

export type GlassOptions = {
	/** Blur radius in px. Browsers without refraction support only. */
	blur?: number;
	/** Saturation in percent. Browsers without refraction support only. */
	saturate?: number;
	/** Refraction strength in px. Chromium only. */
	scale?: number;
	/** `dark` for a darker tint over light content, or any CSS color. */
	tint?: 'dark' | (string & {});
};

// SVG filters only render through backdrop-filter in Chromium; everything else keeps the CSS blur.
const supportsRefraction = () =>
	!!(
		navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }
	).userAgentData?.brands.some(({ brand }) => brand === 'Chromium');

// A neutral gray field (no displacement) with a blurred, inset rounded rect cut out of it, so only
// the element's edge refracts. The exposed edge is an X/Y gradient (screen-blended red/green).
function displacementMap(width: number, height: number, radius: number) {
	const edgeInset = Math.max(4, Math.min(width, height) * 0.12);
	const edgeBlur = Math.max(3, Math.min(width, height) * 0.08);
	const innerWidth = Math.max(0, width - edgeInset * 2);
	const innerHeight = Math.max(0, height - edgeInset * 2);

	return `
		<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
			<style>.mix { mix-blend-mode: screen; }</style>
			<defs>
				<linearGradient id="Y" x1="0" x2="0" y1="8%" y2="92%">
					<stop offset="0%" stop-color="#0F0" />
					<stop offset="100%" stop-color="#000" />
				</linearGradient>
				<linearGradient id="X" x1="3%" x2="97%" y1="0" y2="0">
					<stop offset="0%" stop-color="#F00" />
					<stop offset="100%" stop-color="#000" />
				</linearGradient>
			</defs>
			<rect width="${width}" height="${height}" fill="#808080" />
			<g filter="blur(2px)">
				<rect width="${width}" height="${height}" fill="#000080" />
				<rect width="${width}" height="${height}" fill="url(#Y)" class="mix" />
				<rect width="${width}" height="${height}" fill="url(#X)" class="mix" />
				<rect x="${edgeInset}" y="${edgeInset}" width="${innerWidth}" height="${innerHeight}" rx="${radius}" ry="${radius}" fill="#808080" filter="blur(${edgeBlur}px)" />
			</g>
		</svg>
	`.trim();
}

// Three displacement passes at slightly different scales, one color channel each, give the edge a
// subtle chromatic fringe like real glass.
function refractionFilter(width: number, height: number, radius: number, scale: number) {
	const mapUri = `data:image/svg+xml,${encodeURIComponent(displacementMap(width, height, radius))}`;

	const filter = `
		<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
			<defs>
				<filter id="glass-displace" color-interpolation-filters="sRGB">
					<feImage x="0" y="0" width="${width}" height="${height}" href="${mapUri}" result="displacementMap" />
					<feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${scale}" xChannelSelector="R" yChannelSelector="G" />
					<feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="displacedR" />
					<feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${scale - 1}" xChannelSelector="R" yChannelSelector="G" />
					<feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="displacedG" />
					<feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${scale - 2}" xChannelSelector="R" yChannelSelector="G" />
					<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="displacedB" />
					<feBlend in="displacedR" in2="displacedG" mode="screen" />
					<feBlend in2="displacedB" mode="screen" />
				</filter>
			</defs>
		</svg>
	`.trim();

	return `blur(0.5px) url("data:image/svg+xml,${encodeURIComponent(filter)}#glass-displace")`;
}

export function glass({
	blur,
	saturate,
	scale = 40,
	tint
}: GlassOptions = {}): Attachment<HTMLElement> {
	return (el) => {
		el.classList.add('glass');
		if (blur !== undefined) el.style.setProperty('--glass-blur', `${blur}px`);
		if (saturate !== undefined) el.style.setProperty('--glass-saturate', `${saturate}%`);
		if (tint) el.style.setProperty('--glass-tint', tint === 'dark' ? 'rgb(0 0 0 / 0.25)' : tint);

		let observer: ResizeObserver | undefined;
		let timeout: ReturnType<typeof setTimeout> | undefined;

		if (supportsRefraction()) {
			const apply = () => {
				const { width, height } = el.getBoundingClientRect();
				if (!width || !height) return;

				const w = Math.round(width);
				const h = Math.round(height);
				const raw = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
				el.style.setProperty(
					'backdrop-filter',
					refractionFilter(w, h, Math.round(Math.min(raw, w / 2, h / 2)), scale)
				);
			};

			apply();
			observer = new ResizeObserver(() => {
				clearTimeout(timeout);
				timeout = setTimeout(apply, 150);
			});
			observer.observe(el);
		}

		return () => {
			clearTimeout(timeout);
			observer?.disconnect();
			el.classList.remove('glass');
			for (const name of ['--glass-blur', '--glass-saturate', '--glass-tint', 'backdrop-filter']) {
				el.style.removeProperty(name);
			}
		};
	};
}
