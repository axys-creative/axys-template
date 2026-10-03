<script module lang="ts">
	export type AvatarCycleItem = {
		src: string;
		alt: string;
		title: string;
		caption: string;
	};

	export type AvatarCycleProps = {
		/** Three or more. Each is a picture with a title and caption. Odd counts look the most balanced. */
		items: AvatarCycleItem[];
		/** Milliseconds between turns. */
		interval?: number;
		/** Turns by itself. Pauses on hover and focus. */
		autoplay?: boolean;
		/** The most the middle avatar's width can be, in px. It shrinks to fit a narrow container. */
		size?: number;
		/** The width of the caption card in px. By default it is a little wider than the whole row of avatars. The card is wider than it is tall. */
		cardSize?: number;
		/** Any CSS color for the ring around each avatar. Match the background, and it looks as if each one cuts into its neighbors. */
		ringColor?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { onMount, tick } from 'svelte';

	const SHRINK = 0.2;
	const OVERLAP = 0.82;
	const CARD_MARGIN = 1.1;
	const VISIBLE_CARDS = 3;

	let {
		items,
		interval = 4000,
		autoplay = true,
		size = 120,
		cardSize,
		ringColor = 'var(--color-bg)',
		class: className
	}: AvatarCycleProps = $props();

	const count = $derived(items.length);
	const left = $derived(Math.floor(count / 2));
	const right = $derived(count - 1 - left);

	let active = $state(0);
	let jumping = $state<number[]>([]);
	let paused = $state(false);
	let visible = $state(true);
	let root = $state<HTMLElement>();
	let avatars: HTMLElement[] = [];

	// Each step away from the middle is smaller, and overlaps the one before it a little.
	const scaleAt = (steps: number) => Math.max(0.4, 1 - SHRINK * steps);
	const centerAt = (steps: number) => {
		let x = 0;
		for (let step = 1; step <= steps; step++) {
			x += (scaleAt(step - 1) / 2 + scaleAt(step) / 2) * OVERLAP;
		}
		return x;
	};

	// How far from the middle item i sits: negative to the left, positive to the right, wrapping around.
	const offsetOf = (index: number, from = active) => {
		const turn = (((index - from) % count) + count) % count;
		return turn <= right ? turn : turn - count;
	};

	// The row's width in avatar widths, and how far off center it is when the two sides are not equal.
	const leftReach = $derived(centerAt(left) + scaleAt(left) / 2);
	const rightReach = $derived(centerAt(right) + scaleAt(right) / 2);
	const total = $derived(leftReach + rightReach);
	const shift = $derived((rightReach - leftReach) / 2);

	const go = async (next: number) => {
		const target = ((next % count) + count) % count;
		if (target === active) return;
		const before = active;
		// An avatar that wraps from one end to the other reappears at the far side instead of sliding across.
		const wrapping = items
			.map((_, index) => index)
			.filter((index) => Math.abs(offsetOf(index, target) - offsetOf(index, before)) > 1);
		jumping = wrapping;
		active = target;
		await tick();
		wrapping.forEach((index) =>
			avatars[index]?.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 500,
				easing: 'ease-out'
			})
		);
		setTimeout(() => (jumping = []), 40);
	};

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
		observer.observe(root!);

		const timer = setInterval(() => {
			if (autoplay && !paused && visible && count > 1) go(active + 1);
		}, interval);

		return () => {
			observer.disconnect();
			clearInterval(timer);
		};
	});
</script>

<!-- Hovering or focusing the avatars holds the turning, so a caption can be read. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={root}
	class="avatar-cycle {className ?? ''}"
	style="--total: {total}; --size: {size}px; --card-margin: {CARD_MARGIN}; --ring: {ringColor}; --shift: {shift}{cardSize
		? `; --card: ${cardSize}px`
		: ''}"
	onpointerenter={() => (paused = true)}
	onpointerleave={() => (paused = false)}
	onfocusin={() => (paused = true)}
	onfocusout={() => (paused = false)}
>
	<div class="avatars">
		{#each items as item, index (index)}
			{@const steps = offsetOf(index)}
			{@const distance = Math.abs(steps)}
			<button
				bind:this={avatars[index]}
				type="button"
				class="avatar"
				class:jump={jumping.includes(index)}
				style="--x: {Math.sign(steps) * centerAt(distance)}; --s: {scaleAt(
					distance
				)}; z-index: {count - distance}"
				aria-label={item.title}
				aria-current={steps === 0 ? 'true' : undefined}
				onclick={() => go(index)}
			>
				<img src={item.src} alt={item.alt} draggable="false" />
			</button>
		{/each}
	</div>

	<div class="cards">
		{#each items as item, index (index)}
			{@const rank = (((index - active) % count) + count) % count}
			<div
				class="card"
				class:front={rank === 0}
				style="--rank: {Math.min(rank, VISIBLE_CARDS - 1)}; z-index: {count -
					rank}; opacity: {rank < VISIBLE_CARDS ? 1 : 0}"
				aria-hidden={rank === 0 ? undefined : 'true'}
				inert={rank !== 0}
			>
				<h3>{item.title}</h3>
				<p>{item.caption}</p>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	@use 'base/mixins';

	.avatar-cycle {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
		width: 100%;
		container-type: inline-size;
	}

	// The middle avatar's width, capped by `size` and shrunk if the row would not fit the container.
	.avatar-cycle {
		--glide: cubic-bezier(0.4, 0, 0.2, 1);
		--duration: 1s;
	}

	.avatars,
	.cards {
		--diameter: min(var(--size), calc(100cqw / var(--total)));
	}

	.avatars {
		position: relative;
		width: 100%;
		height: var(--diameter);
	}

	.avatar {
		position: absolute;
		top: 0;
		left: 50%;
		width: var(--diameter);
		height: var(--diameter);
		padding: 0;
		overflow: hidden;
		border: 2px solid var(--ring);
		border-radius: 50%;
		background: var(--color-surface);
		cursor: pointer;
		translate: calc(-50% + (var(--x) + var(--shift)) * var(--diameter)) 0;
		scale: var(--s);

		@include mixins.mq-motion-allow {
			transition:
				translate var(--duration) var(--glide),
				scale var(--duration) var(--glide),
				z-index var(--duration) var(--glide);
		}

		&.jump {
			transition: none;
		}

		&:focus-visible {
			outline: 2px solid var(--color-accent-text);
			outline-offset: 3px;
		}

		img {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			object-fit: cover;
			user-select: none;
			pointer-events: none;
		}
	}

	// The captions stack like a deck: the front card, with the tops of the next ones peeking out above it.
	.cards {
		position: relative;
		// A little wider than the row of avatars above it, whatever their count or size.
		width: min(100%, var(--card, calc(var(--total) * var(--diameter) * var(--card-margin))));
		aspect-ratio: 16 / 10;
		margin-block-start: 28px;
	}

	.card {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 24px;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 24px;
		background: var(--color-surface);
		transform-origin: center top;
		translate: 0 calc(var(--rank) * -14px);
		scale: calc(1 - var(--rank) * 0.06);

		@include mixins.mq-motion-allow {
			transition:
				translate var(--duration) var(--glide),
				scale var(--duration) var(--glide),
				opacity var(--duration) var(--glide);
		}

		h3 {
			font-size: 22px;
			line-height: 1.25;
		}

		p {
			color: var(--color-text-muted);
		}
	}
</style>
