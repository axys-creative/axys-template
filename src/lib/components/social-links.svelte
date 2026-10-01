<script module lang="ts">
	export type SocialLink = { title: string; url: string; icon: string };
</script>

<script lang="ts">
	import Icon from './icon.svelte';

	let { links, label = 'Social media' }: { links: SocialLink[]; label?: string } = $props();
</script>

{#if links.length}
	<ul class="social-links" aria-label={label}>
		{#each links as { title, url, icon } (url)}
			<li>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="{title} (opens in a new tab)"
				>
					<Icon name={icon} size="lg" />
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	@use 'base/mixins';

	.social-links {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		padding: 0;
		list-style: none;

		@include mixins.max-md {
			gap: 12px;
		}
	}

	a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		color: var(--color-accent-text);

		@include mixins.mq-motion-allow {
			transition: 0.25s ease;
		}

		@include mixins.desktop-hover {
			color: var(--color-text);
			scale: 1.1;
		}
	}
</style>
