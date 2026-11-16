import type { Attachment } from 'svelte/attachments';
import { hasMouse, trackPointer } from '$lib/utils/pointer';
import './text-flies.scss';

export type TextFliesOptions = {
	/** Size of each cell the flies roam in, as a fraction of the font size. */
	cell?: number;
	/** How big each fly is inside its cell (0-1). */
	radius?: number;
	/** How far the flies may roam past the letter edges, in cells. `0` keeps them inside. */
	grow?: number;
	/** How fast the flies move. */
	speed?: number;
	/** Flies near the pointer scatter away from it. */
	dodge?: boolean;
	/** How far the scatter reaches, as a fraction of the element's height. */
	dodgeSpread?: number;
};

const VERTEX = `#version 300 es
void main() {
	vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
	gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// A port of Blotter's Flies material: the text is a grid of cells, and each cell fully inside a letter holds one dot
// drifting on its own sine path.
const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uText;
uniform vec2 uResolution;
uniform float uTime;
uniform float uCell;
uniform float uRadius;
uniform float uSpeed;
uniform float uDodge;
uniform vec2 uDodgePosition;
uniform float uDodgeSpread;
out vec4 fragColor;

float random(vec2 st) {
	return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 random2(vec2 p) {
	return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

void main() {
	vec2 fragCoord = gl_FragCoord.xy;
	vec2 cellUv = fragCoord / uCell;
	vec2 iUv = floor(cellUv);
	vec2 fUv = fract(cellUv);
	float radius = min(uRadius * 0.8, 1.0);
	float minDist = 1.0;
	vec3 color = texture(uText, fragCoord / uResolution).rgb;

	for (int y = -1; y <= 1; y++) {
		for (int x = -1; x <= 1; x++) {
			vec2 neighbor = vec2(float(x), float(y));
			vec2 cellId = iUv + neighbor;
			vec2 center = (cellId + 0.5) * uCell;
			vec4 cellSample = texture(uText, center / uResolution);
			if (cellSample.a < 0.99) continue;
			color = cellSample.rgb;

			float away = 1.0 - smoothstep(0.0, uDodgeSpread, distance(uDodgePosition * uResolution, center) / uResolution.y);
			float weight = step(1.0, random(cellId)) + away * uDodge;

			vec2 point = 0.5 + 0.75 * sin(uTime * uSpeed + 6.2831 * random2(cellId));
			float dist = length(neighbor + point - fUv) + weight;
			minDist = min(minDist, dist);
		}
	}

	float edge = radius - 1.0 / uCell;
	float alpha = 1.0 - smoothstep(edge, radius, minDist);
	fragColor = vec4(color * alpha, alpha);
}`;

const UNIFORMS = [
	'uText',
	'uResolution',
	'uTime',
	'uCell',
	'uRadius',
	'uSpeed',
	'uDodge',
	'uDodgePosition',
	'uDodgeSpread'
] as const;

function compile(gl: WebGL2RenderingContext) {
	const program = gl.createProgram();

	for (const [type, source] of [
		[gl.VERTEX_SHADER, VERTEX],
		[gl.FRAGMENT_SHADER, FRAGMENT]
	] as const) {
		const shader = gl.createShader(type)!;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		gl.attachShader(program, shader);
	}

	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
	return program;
}

function paintText(
	ctx: CanvasRenderingContext2D,
	element: HTMLElement,
	pad: number,
	scale: number,
	cell: number,
	grow: number
) {
	const origin = element.getBoundingClientRect();
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
	const range = document.createRange();
	let fontSize = 16;

	ctx.textBaseline = 'alphabetic';

	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		const parent = node.parentElement;
		if (!parent || !node.textContent?.trim()) continue;

		const style = getComputedStyle(parent);
		const transform = style.textTransform;
		fontSize = parseFloat(style.fontSize);
		ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize * scale}px ${style.fontFamily}`;
		ctx.letterSpacing = `${(parseFloat(style.letterSpacing) || 0) * scale}px`;
		ctx.fillStyle = style.color;
		ctx.strokeStyle = style.color;
		ctx.lineJoin = 'round';
		ctx.lineWidth = grow * 2 * cell * fontSize * scale;
		const ascent = ctx.measureText('M').fontBoundingBoxAscent / scale;

		for (const match of node.textContent.matchAll(/\S+/g)) {
			range.setStart(node, match.index);
			range.setEnd(node, match.index + match[0].length);
			const rect = range.getBoundingClientRect();
			if (!rect.width) continue;

			let word = match[0];
			if (transform === 'uppercase') word = word.toUpperCase();
			else if (transform === 'lowercase') word = word.toLowerCase();

			const x = (rect.left - origin.left + pad) * scale;
			const y = (rect.top - origin.top + pad + ascent) * scale;
			ctx.fillText(word, x, y);
			if (grow) ctx.strokeText(word, x, y);
		}
	}

	return fontSize;
}

export function textFlies(options: TextFliesOptions = {}): Attachment<HTMLElement> {
	return (element) => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const {
			cell = 0.0125,
			radius = 0.5,
			grow = 0.5,
			speed = 2,
			dodge = false,
			dodgeSpread = 0.5
		} = options;

		const canvas = document.createElement('canvas');
		canvas.className = 'text-flies__canvas';
		canvas.setAttribute('aria-hidden', 'true');

		const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true });
		const program = gl && compile(gl);
		if (!gl || !program) return;

		const uniform = Object.fromEntries(
			UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)])
		) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation>;

		const texture = gl.createTexture();
		const text = document.createElement('canvas');
		const ctx = text.getContext('2d')!;
		const pad = 12;
		let scale = 1;
		let cellPx = 4;
		let visible = false;
		let frame = 0;
		let redrawing = 0;
		let pointerX = -10;
		let pointerY = -10;
		const start = performance.now();

		element.classList.add('text-flies');
		element.append(canvas);

		const draw = () => {
			scale = Math.min(devicePixelRatio || 1, 2);
			const width = element.offsetWidth + pad * 2;
			const height = element.offsetHeight + pad * 2;
			canvas.style.inset = `${-pad}px`;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			canvas.width = text.width = Math.round(width * scale);
			canvas.height = text.height = Math.round(height * scale);

			const fontSize = paintText(ctx, element, pad, scale, cell, grow);
			cellPx = Math.max(2, Math.floor(cell * fontSize * scale));

			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, text);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			render();
		};

		const render = () => {
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.useProgram(program);
			gl.uniform1i(uniform.uText, 0);
			gl.uniform2f(uniform.uResolution, canvas.width, canvas.height);
			gl.uniform1f(uniform.uTime, (performance.now() - start) / 1000);
			gl.uniform1f(uniform.uCell, cellPx);
			gl.uniform1f(uniform.uRadius, radius);
			gl.uniform1f(uniform.uSpeed, speed);
			gl.uniform1f(uniform.uDodge, dodge ? 1 : 0);
			gl.uniform2f(uniform.uDodgePosition, pointerX, pointerY);
			gl.uniform1f(uniform.uDodgeSpread, dodgeSpread);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};

		const tick = () => {
			render();
			frame = requestAnimationFrame(tick);
		};

		const setRunning = () => {
			cancelAnimationFrame(frame);
			if (visible && !document.hidden) frame = requestAnimationFrame(tick);
		};

		const redraw = () => {
			cancelAnimationFrame(redrawing);
			redrawing = requestAnimationFrame(draw);
		};

		const intersection = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			setRunning();
		});
		const resize = new ResizeObserver(redraw);
		const theme = new MutationObserver(redraw);

		intersection.observe(element);
		resize.observe(element);
		theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		document.addEventListener('visibilitychange', setRunning);
		document.fonts.ready.then(redraw);

		const stopPointer =
			dodge && hasMouse()
				? trackPointer((event) => {
						const rect = canvas.getBoundingClientRect();
						pointerX = (event.clientX - rect.left) / rect.width;
						pointerY = 1 - (event.clientY - rect.top) / rect.height;
					})
				: undefined;

		return () => {
			cancelAnimationFrame(frame);
			cancelAnimationFrame(redrawing);
			intersection.disconnect();
			resize.disconnect();
			theme.disconnect();
			stopPointer?.();
			document.removeEventListener('visibilitychange', setRunning);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
			canvas.remove();
			element.classList.remove('text-flies');
		};
	};
}
