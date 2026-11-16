import type { Attachment } from 'svelte/attachments';
import { hasMouse, trackPointer } from '$lib/utils/pointer';

export type CursorFluidOptions = {
	/** Covers the whole screen and follows it, instead of covering this element. Meant for `<body>`. */
	fixed?: boolean;
	/** Any CSS color for the fluid, including `var(--color-accent)`. */
	color?: string;
	/** `rainbow` splits the light into thin, colored fringes like glass. `ink` is a single soft tint of `color`. */
	mode?: 'rainbow' | 'ink';
	/** How wide the colored fringes are in `rainbow` mode, in pixels. */
	spread?: number;
	/** How solid the fluid is where it is thickest (0-1). */
	opacity?: number;
	/** The size of the splash under the pointer, as a fraction of the screen's shorter side. */
	size?: number;
	/** How hard the pointer pushes the fluid. */
	force?: number;
	/** How strongly the fluid swirls. `0` leaves it smooth. */
	swirl?: number;
	/** How much color is left after one second. Lower disappears sooner (0-1). */
	fade?: number;
	/** How much speed is left after one second. Lower stops sooner (0-1). */
	drag?: number;
};

const VERTEX = `#version 300 es
precision highp float;
uniform vec2 texel;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
	vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
	vUv = p;
	vL = p - vec2(texel.x, 0.0);
	vR = p + vec2(texel.x, 0.0);
	vT = p + vec2(0.0, texel.y);
	vB = p - vec2(0.0, texel.y);
	gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`;

const SPLAT = `${HEAD}
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uValue;
uniform float uAspect;
uniform float uRadius;
void main() {
	vec2 p = vUv - uPoint;
	p.x *= uAspect;
	vec3 splat = exp(-dot(p, p) / uRadius) * uValue;
	fragColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`;

const ADVECT = `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uVelocityTexel;
uniform float uDt;
uniform float uDecay;
void main() {
	vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uVelocityTexel;
	fragColor = uDecay * texture(uSource, coord);
}`;

const DIVERGENCE = `${HEAD}
uniform sampler2D uVelocity;
void main() {
	float L = texture(uVelocity, vL).x;
	float R = texture(uVelocity, vR).x;
	float T = texture(uVelocity, vT).y;
	float B = texture(uVelocity, vB).y;
	vec2 C = texture(uVelocity, vUv).xy;
	if (vL.x < 0.0) L = -C.x;
	if (vR.x > 1.0) R = -C.x;
	if (vT.y > 1.0) T = -C.y;
	if (vB.y < 0.0) B = -C.y;
	fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const CURL = `${HEAD}
uniform sampler2D uVelocity;
void main() {
	float L = texture(uVelocity, vL).y;
	float R = texture(uVelocity, vR).y;
	float T = texture(uVelocity, vT).x;
	float B = texture(uVelocity, vB).x;
	fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

const VORTICITY = `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uSwirl;
uniform float uDt;
void main() {
	float L = texture(uCurl, vL).x;
	float R = texture(uCurl, vR).x;
	float T = texture(uCurl, vT).x;
	float B = texture(uCurl, vB).x;
	float C = texture(uCurl, vUv).x;
	vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
	force /= length(force) + 0.0001;
	force *= uSwirl * C;
	force.y *= -1.0;
	vec2 velocity = texture(uVelocity, vUv).xy + force * uDt;
	fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`;

const PRESSURE = `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
	float L = texture(uPressure, vL).x;
	float R = texture(uPressure, vR).x;
	float T = texture(uPressure, vT).x;
	float B = texture(uPressure, vB).x;
	float divergence = texture(uDivergence, vUv).x;
	fragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT = `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
	float L = texture(uPressure, vL).x;
	float R = texture(uPressure, vR).x;
	float T = texture(uPressure, vT).x;
	float B = texture(uPressure, vB).x;
	vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
	fragColor = vec4(velocity, 0.0, 1.0);
}`;

const CLEAR = `${HEAD}
uniform sampler2D uTexture;
uniform float uValue;
void main() {
	fragColor = uValue * texture(uTexture, vUv);
}`;

const DISPLAY = `${HEAD}
uniform sampler2D uDye;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uRainbow;
uniform float uSpread;
uniform vec2 uDyeTexel;

float shape(float density) {
	return 1.0 - exp(-density * 2.0);
}

void main() {
	float density = shape(texture(uDye, vUv).x);
	if (uRainbow < 0.5) {
		float alpha = smoothstep(0.0, 1.0, density) * uOpacity;
		fragColor = vec4(uColor * alpha, alpha);
		return;
	}
	vec2 offset = normalize(vec2(0.35, 1.0)) * uDyeTexel * uSpread;
	float r = shape(texture(uDye, vUv + offset).x);
	float b = shape(texture(uDye, vUv - offset).x);
	vec3 light = vec3(r, density, b);
	float alpha = max(max(r, b), density) * uOpacity;
	fragColor = vec4(light * uOpacity, alpha);
}`;

type Target = {
	texture: WebGLTexture;
	fbo: WebGLFramebuffer;
	width: number;
	height: number;
};
type Double = { read: Target; write: Target; swap: () => void };
type Value = number | number[] | Target;

const THEME_EVENTS = { attributes: true, attributeFilter: ['data-theme'] };

// Any CSS color to 0-1 red, green and blue, by letting the browser paint one pixel of it.
let swatch: CanvasRenderingContext2D | null | undefined;
function toRgb(color: string): [number, number, number] {
	swatch ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
	if (!swatch) return [1, 1, 1];
	swatch.clearRect(0, 0, 1, 1);
	swatch.fillStyle = '#fff';
	swatch.fillStyle = color;
	swatch.fillRect(0, 0, 1, 1);
	const [r, g, b] = swatch.getImageData(0, 0, 1, 1).data;
	return [r / 255, g / 255, b / 255];
}

const SIM_SIZE = 128;
const DYE_SIZE = 512;
const PRESSURE_ITERATIONS = 16;
const IDLE_SECONDS = 4;

/**
 * A faint, liquid cloud that follows the mouse, like ink dropped in water: the pointer stirs a small fluid
 * simulation on the GPU, leaves a soft tint behind that swirls along and fades quickly. It sits behind the element's
 * content, follows the site's theme for its color, only runs while the pointer is moving over an element on screen,
 * and does nothing with reduced motion or without a mouse.
 */
export function cursorFluid({
	fixed = false,
	color = 'var(--color-accent)',
	mode = 'rainbow',
	spread = 4,
	opacity = 0.5,
	size = 0.03,
	force = 2000,
	swirl = 4,
	fade = 0.03,
	drag = 0.05
}: CursorFluidOptions = {}): Attachment<HTMLElement> {
	return (host) => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || !hasMouse()) return;

		const canvas = document.createElement('canvas');
		const gl = canvas.getContext('webgl2', {
			alpha: true,
			premultipliedAlpha: true,
			antialias: false
		});
		if (
			!gl ||
			!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))
		) {
			return;
		}

		canvas.setAttribute('aria-hidden', 'true');
		Object.assign(canvas.style, {
			position: fixed ? 'fixed' : 'absolute',
			inset: '0',
			width: '100%',
			height: '100%',
			zIndex: '-1',
			pointerEvents: 'none'
		});

		// The canvas sits behind the element's content but above its own background, which needs a stacking
		// context to hold it, and a position to be placed against.
		const previous = { position: host.style.position, isolation: host.style.isolation };
		if (!fixed) {
			if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
			host.style.isolation = 'isolate';
		}
		host.prepend(canvas);

		const vertex = gl.createShader(gl.VERTEX_SHADER)!;
		gl.shaderSource(vertex, VERTEX);
		gl.compileShader(vertex);

		let failed = false;
		const pass = (source: string) => {
			const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
			gl.shaderSource(fragment, source);
			gl.compileShader(fragment);
			const program = gl.createProgram()!;
			gl.attachShader(program, vertex);
			gl.attachShader(program, fragment);
			gl.linkProgram(program);
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) failed = true;
			const locations = new Map<string, WebGLUniformLocation | null>();
			const at = (name: string) => {
				if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
				return locations.get(name)!;
			};
			return { program, at };
		};

		const splat = pass(SPLAT);
		const advect = pass(ADVECT);
		const divergence = pass(DIVERGENCE);
		const curl = pass(CURL);
		const vorticity = pass(VORTICITY);
		const pressurePass = pass(PRESSURE);
		const gradient = pass(GRADIENT);
		const clear = pass(CLEAR);
		const display = pass(DISPLAY);
		if (failed) {
			canvas.remove();
			host.style.position = previous.position;
			host.style.isolation = previous.isolation;
			return;
		}

		const draw = (
			{ program, at }: ReturnType<typeof pass>,
			uniforms: Record<string, Value>,
			target: Target | null
		) => {
			gl.useProgram(program);
			const w = target ? target.width : canvas.width;
			const h = target ? target.height : canvas.height;
			gl.uniform2f(at('texel'), 1 / w, 1 / h);
			let unit = 0;
			for (const [name, value] of Object.entries(uniforms)) {
				if (typeof value === 'number') gl.uniform1f(at(name), value);
				else if (Array.isArray(value)) {
					if (value.length === 2) gl.uniform2f(at(name), value[0], value[1]);
					else gl.uniform3f(at(name), value[0], value[1], value[2]);
				} else {
					gl.activeTexture(gl.TEXTURE0 + unit);
					gl.bindTexture(gl.TEXTURE_2D, value.texture);
					gl.uniform1i(at(name), unit++);
				}
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
			gl.viewport(0, 0, w, h);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};

		const target = (width: number, height: number): Target => {
			const texture = gl.createTexture()!;
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
			const fbo = gl.createFramebuffer()!;
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
			gl.viewport(0, 0, width, height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			return { texture, fbo, width, height };
		};
		const double = (width: number, height: number): Double => {
			const pair: Double = {
				read: target(width, height),
				write: target(width, height),
				swap: () => ([pair.read, pair.write] = [pair.write, pair.read])
			};
			return pair;
		};
		const free = (t: Target) => {
			gl.deleteTexture(t.texture);
			gl.deleteFramebuffer(t.fbo);
		};

		let velocity: Double | undefined;
		let dye: Double | undefined;
		let pressure: Double | undefined;
		let divergenceTarget: Target | undefined;
		let curlTarget: Target | undefined;

		const resolution = (base: number, aspect: number): [number, number] =>
			aspect >= 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)];

		const build = () => {
			[
				velocity?.read,
				velocity?.write,
				dye?.read,
				dye?.write,
				pressure?.read,
				pressure?.write,
				divergenceTarget,
				curlTarget
			]
				.filter((t): t is Target => !!t)
				.forEach(free);
			const aspect = canvas.width / canvas.height;
			const [sw, sh] = resolution(SIM_SIZE, aspect);
			const [dw, dh] = resolution(DYE_SIZE, aspect);
			velocity = double(sw, sh);
			pressure = double(sw, sh);
			dye = double(dw, dh);
			divergenceTarget = target(sw, sh);
			curlTarget = target(sw, sh);
		};

		const addSplat = (x: number, y: number, dx: number, dy: number, strength: number) => {
			const aspect = canvas.width / canvas.height;
			const radius = size * size;
			draw(
				splat,
				{
					uTarget: velocity!.read,
					uPoint: [x, y],
					uValue: [dx * force, dy * force, 0],
					uAspect: aspect,
					uRadius: radius
				},
				velocity!.write
			);
			velocity!.swap();
			draw(
				splat,
				{
					uTarget: dye!.read,
					uPoint: [x, y],
					uValue: [strength, 0, 0],
					uAspect: aspect,
					uRadius: radius
				},
				dye!.write
			);
			dye!.swap();
		};

		const step = (dt: number) => {
			const v = velocity!;
			const p = pressure!;
			draw(curl, { uVelocity: v.read }, curlTarget!);
			draw(vorticity, { uVelocity: v.read, uCurl: curlTarget!, uSwirl: swirl, uDt: dt }, v.write);
			v.swap();
			draw(divergence, { uVelocity: v.read }, divergenceTarget!);
			draw(clear, { uTexture: p.read, uValue: 0.8 }, p.write);
			p.swap();
			for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
				draw(pressurePass, { uPressure: p.read, uDivergence: divergenceTarget! }, p.write);
				p.swap();
			}
			draw(gradient, { uPressure: p.read, uVelocity: v.read }, v.write);
			v.swap();
			draw(
				advect,
				{
					uVelocity: v.read,
					uSource: v.read,
					uVelocityTexel: [1 / v.read.width, 1 / v.read.height],
					uDt: dt,
					uDecay: Math.pow(drag, dt)
				},
				v.write
			);
			v.swap();
			draw(
				advect,
				{
					uVelocity: v.read,
					uSource: dye!.read,
					uVelocityTexel: [1 / v.read.width, 1 / v.read.height],
					uDt: dt,
					uDecay: Math.pow(fade, dt)
				},
				dye!.write
			);
			dye!.swap();
		};

		const paintColor = () => {
			canvas.style.color = color;
			rgb = toRgb(getComputedStyle(canvas).color);
		};

		const render = () => {
			draw(
				display,
				{
					uDye: dye!.read,
					uColor: rgb,
					uOpacity: opacity,
					uRainbow: mode === 'rainbow' ? 1 : 0,
					uSpread: spread,
					uDyeTexel: [1 / dye!.read.width, 1 / dye!.read.height]
				},
				null
			);
		};

		let rgb: [number, number, number] = [1, 1, 1];
		let frame = 0;
		let last = 0;
		let idle = 0;
		let visible = fixed;
		let hasLast = false;
		const previousPoint = { x: 0, y: 0 };
		const point = { x: 0, y: 0, moved: false };

		const tick = (now: number) => {
			frame = 0;
			const dt = Math.min((now - last) / 1000, 1 / 30);
			last = now;

			if (point.moved) {
				point.moved = false;
				idle = 0;
				if (hasLast) {
					const dx = point.x - previousPoint.x;
					const dy = point.y - previousPoint.y;
					const aspect = canvas.width / canvas.height;
					const distance = Math.hypot(dx * aspect, dy);
					const speed = Math.min(distance * 12, 1);
					const steps = Math.min(Math.max(Math.ceil(distance / (size * 0.5)), 1), 16);
					for (let i = 1; i <= steps; i++) {
						const t = i / steps;
						addSplat(previousPoint.x + dx * t, previousPoint.y + dy * t, dx, dy, speed / steps);
					}
				}
				previousPoint.x = point.x;
				previousPoint.y = point.y;
				hasLast = true;
			} else {
				idle += dt;
			}

			step(dt);
			render();
			if (idle < IDLE_SECONDS && visible && !document.hidden) frame = requestAnimationFrame(tick);
			else {
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				gl.clear(gl.COLOR_BUFFER_BIT);
			}
		};

		const wake = () => {
			if (frame || !visible || document.hidden) return;
			last = performance.now();
			frame = requestAnimationFrame(tick);
		};

		const resize = () => {
			const ratio = Math.min(devicePixelRatio || 1, 1.5);
			const w = Math.round(canvas.clientWidth * ratio);
			const h = Math.round(canvas.clientHeight * ratio);
			if (!w || !h || (w === canvas.width && h === canvas.height)) return;
			canvas.width = w;
			canvas.height = h;
			build();
		};

		const unsubscribe = trackPointer((event) => {
			const rect = canvas.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width;
			const y = 1 - (event.clientY - rect.top) / rect.height;
			if (x < 0 || x > 1 || y < 0 || y > 1) {
				hasLast = false;
				return;
			}
			point.x = x;
			point.y = y;
			point.moved = true;
			wake();
		});

		paintColor();
		const resizer = new ResizeObserver(resize);
		resizer.observe(host);
		resize();

		const themeWatcher = new MutationObserver(paintColor);
		themeWatcher.observe(document.documentElement, THEME_EVENTS);

		const observer = new IntersectionObserver(([entry]) => {
			if (!fixed) visible = entry.isIntersecting;
			if (!visible) hasLast = false;
			wake();
		});
		observer.observe(host);
		document.addEventListener('visibilitychange', wake);

		return () => {
			cancelAnimationFrame(frame);
			unsubscribe();
			resizer.disconnect();
			themeWatcher.disconnect();
			observer.disconnect();
			document.removeEventListener('visibilitychange', wake);
			canvas.remove();
			gl.getExtension('WEBGL_lose_context')?.loseContext();
			host.style.position = previous.position;
			host.style.isolation = previous.isolation;
		};
	};
}
