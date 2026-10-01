import type { gsap as Gsap } from 'gsap';

type PluginName = 'scramble' | 'scrollTrigger' | 'splitText';

const loaders: Record<PluginName, () => Promise<object>> = {
	scramble: () => import('gsap/ScrambleTextPlugin').then((module) => module.ScrambleTextPlugin),
	scrollTrigger: () => import('gsap/ScrollTrigger').then((module) => module.ScrollTrigger),
	splitText: () => import('gsap/SplitText').then((module) => module.SplitText)
};

let core: Promise<typeof Gsap> | undefined;
const registering = new Map<PluginName, Promise<void>>();

/**
 * Loads GSAP and any plugins you name, once. Pages that never call this never download GSAP, so
 * call it from an attachment (not at module scope) and keep plugin lists as short as possible.
 */
export async function loadGsap(...plugins: PluginName[]) {
	core ??= import('gsap').then((module) => module.gsap);
	const gsap = await core;

	await Promise.all(
		plugins.map((name) => {
			let pending = registering.get(name);
			if (!pending) {
				pending = loaders[name]().then((plugin) => gsap.registerPlugin(plugin));
				registering.set(name, pending);
			}
			return pending;
		})
	);
	return gsap;
}
