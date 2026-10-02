<!-- LIBRARY: DELETE ME. Documentation page; remove with the rest of the library (see CLAUDE.md). -->
<script lang="ts">
	import ImageColumns from '$lib/components/image-columns.svelte';
	import ImageFan from '$lib/components/image-fan.svelte';
	import ImageCircle from '$lib/components/image-circle.svelte';
	import ImageWave from '$lib/components/image-wave.svelte';
	import ImageComparison from '$lib/components/image-comparison.svelte';
	import Form from '$lib/components/form.svelte';
	import Counter from '$lib/components/counter.svelte';
	import Carousel from '$lib/components/carousel.svelte';
	import CardGnomon from '$lib/components/card-gnomon.svelte';
	import Accordion from '$lib/components/accordion.svelte';
	import AccordionTable from '$lib/components/accordion-table.svelte';
	import Button from '$lib/components/button.svelte';
	import PostCard from '$lib/components/post-card.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import VideoOverlay from '$lib/components/video-overlay.svelte';
	import {
		accordionProps,
		accordionTableProps,
		cardGnomonProps,
		carouselProps,
		counterProps,
		formProps,
		imageCircleProps,
		imageColumnsProps,
		imageFanProps,
		imageComparisonProps,
		imageWaveProps,
		mouseCursorProps,
		postCardProps,
		videoOverlayProps
	} from '$lib/library/component-props';
	import LibrarySection from '$lib/library/library-section.svelte';
	import HeroSimple from '$lib/sections/hero-simple.svelte';
	import { navEntry } from '$lib/utils/nav';

	const nav = navEntry('/components');
	let videoOpen = $state(false);

	const long =
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima numquam officiis ipsa obcaecati illo molestias aliquam molestiae praesentium provident eos? Excepturi veniam assumenda non corrupti similique aperiam rem enim dolores repellat.';
	const images = [
		'img-sample-1',
		'img-sample-2',
		'img-sample-3',
		'img-sample-4',
		'img-sample-5',
		'img-sample-6',
		'img-sample-7'
	];
	const photoSlides = (total: number) =>
		Array.from({ length: total }, (_, index) => ({
			title: `Title ${index + 1}`,
			desc: `Description ${index + 1}`,
			img: `/images/${images[index % images.length]}.jpg`
		}));
	const cardSlides = Array.from({ length: 4 }, (_, index) => ({
		title: `Title ${index + 1}`,
		desc: `Description ${index + 1}`
	}));
	const gallery = [
		'img-sample-1',
		'img-sample-2',
		'img-sample-3',
		'img-sample-4',
		'img-sample-5',
		'img-sample-6',
		'img-sample-7'
	];
	const galleryImages = (total: number) =>
		Array.from({ length: total }, (_, index) => ({
			src: `/images/${gallery[index % gallery.length]}.jpg`,
			alt: `Sample image ${index + 1}`
		}));
	const faq = [
		{
			title:
				'What happens if you have really long content? Does this still work with lengthy titles or does it just work with short ones?',
			content: `Content can hold <a href="https://axyscreative.com" target="_blank" rel="noopener noreferrer">a link</a>. ${long}`
		},
		{ title: 'What about long inner content?', content: `${long} ${long} ${long}` },
		{
			title: 'What features does this accordion have?',
			content:
				'It is accessible, works with any content length, and has a few options such as single open and an icon or plus sign.'
		}
	];
	const tableColumns = [
		{ key: 'photo', label: 'Photo', type: 'image' as const, width: '96px' },
		{ key: 'year', label: 'Year', width: '112px' },
		{ key: 'location', label: 'Location', width: '2fr' }
	];
	const places = [
		['img-sample-1', '2024', 'Salt Lake City, UT', long],
		[
			'img-sample-2',
			'2022',
			'Denver, CO',
			'A shorter description that sits directly beneath the year.'
		],
		['img-sample-3', '2019', 'Portland, OR', `${long} ${long}`],
		['img-sample-4', '2018', 'Phoenix, AZ', 'Lorem ipsum dolor sit amet.'],
		['img-sample-5', '2017', 'Las Vegas, NV', 'Lorem ipsum dolor sit amet.'],
		['img-sample-6', '2015', 'Santa Fe, NM', 'Lorem ipsum dolor sit amet.']
	].map(([image, year, location, content], index) => ({
		photo: { src: `/images/${image}.jpg`, alt: '' },
		year,
		location,
		content,
		...(index === 2 && {
			images: ['img-sample-7', 'img-sample-5', 'img-sample-6', 'img-sample-4'].map((name) => ({
				src: `/images/${name}.jpg`,
				alt: ''
			})),
			slidesPerView: 3,
			cta: { text: 'View gallery', url: '/', type: 'outline' as const }
		})
	}));
</script>

<HeroSimple
	eyebrowText={nav.group}
	eyebrowIcon={nav.icon}
	title="Components"
	description="Larger pieces of UI that bring their own behavior. The smaller building blocks live in the style guide."
/>

<div class="components">
	<LibrarySection
		title="Accordion"
		type="Component"
		description="Tucks away lengthy info, often an FAQ. Each title is a button that opens its panel, so it works with the keyboard and screen readers. The panel grows to any height with no measuring."
		props={accordionProps}
	>
		<h3 class="plain">Icon, one open at a time</h3>
		<Accordion items={faq} icon="chevron-down" singleOpen />
		<h3 class="plain">Plus sign with open all</h3>
		<Accordion items={faq} plus toggleAll />
	</LibrarySection>

	<LibrarySection
		title="Accordion Table"
		type="Component"
		description="A table-style accordion: a header row names the columns, and every row below is an accordion item whose cells line up with those headers. It uses plain elements, not a `<table>`, and collapses to stacked rows on small screens. Style it with `--gap`, `--img-size` and `--sticky-top` (the sticky offset, e.g. a fixed header's height)."
		props={accordionTableProps}
	>
		<AccordionTable
			columns={tableColumns}
			items={places.slice(0, 3)}
			icon="chevron-down"
			singleOpen
			contentColumn={3}
		/>
		<h3 class="plain">Sticky header, several rows open at once</h3>
		<AccordionTable
			columns={tableColumns}
			items={places}
			icon="chevron-down"
			sticky
			contentColumn={3}
		/>
	</LibrarySection>

	<LibrarySection
		title="Card Gnomon"
		type="Component"
		description="A square card with one or more rectangular notches cut from its corners or sides (a gnomon). The border is an SVG stroke, so its color can transition on hover, and the image is clipped to the exact same shape."
		props={cardGnomonProps}
	>
		<h3 class="plain">Default notch with an image and text</h3>
		<CardGnomon
			img={{ src: '/images/img-sample-1.jpg', alt: 'Sample card image' }}
			cutouts={[{ from: 'top-right', text: 'Sample 01' }]}
		/>
		<h3 class="plain">A deeper, longer cut with a tilted angle and content instead of an image</h3>
		<CardGnomon
			cutouts={[{ from: 'bottom-right', text: 'Keep angle near 90' }]}
			depth={12}
			length={48}
			angle={80}
			radius={4}
		>
			<p>This uses an angle of 80.</p>
		</CardGnomon>
		<h3 class="plain">A notch centered on a side</h3>
		<CardGnomon
			cutouts={[{ from: 'bottom', text: 'View more' }]}
			depth={10}
			length={32}
			angle={75}
			radius={2}
			img={{ src: '/images/img-sample-1.jpg', alt: 'Sample card image' }}
		/>
		<h3 class="plain">Two notches on opposite corners</h3>
		<CardGnomon
			cutouts={[
				{ from: 'top-right', text: 'Sample 01' },
				{ from: 'bottom-left', text: 'Sample 02' }
			]}
			depth={10}
			length={32}
			angle={80}
			radius={2}
			img={{ src: '/images/img-sample-1.jpg', alt: 'Sample card image' }}
		/>
	</LibrarySection>

	<LibrarySection
		title="Carousel"
		type="Component"
		description="A dependency-free carousel built on native CSS scroll-snap. Touch and trackpad scroll natively, the mouse can drag, and the arrow keys work when the track is focused."
		props={carouselProps}
	>
		<h3 class="plain">Arrows</h3>
		<Carousel label="Sample carousel with arrows" slides={photoSlides(6)} slidesPerView={3} />
		<h3 class="plain">Arrows, progress and loop</h3>
		<Carousel
			label="Sample looping carousel with progress"
			slides={photoSlides(5)}
			slidesPerView={3}
			progress
			loop
			autoplay={{ enabled: true }}
		/>
		<h3 class="plain">Dots and autoplay</h3>
		<div class="cards">
			<Carousel
				label="Sample carousel with dots"
				slides={cardSlides}
				pagination="dots"
				loop
				autoplay={{ enabled: true, interval: 3200 }}
			/>
		</div>
		<h3 class="plain">With a button</h3>
		<Carousel
			label="Sample carousel with a button"
			slides={photoSlides(4)}
			slidesPerView={2}
			cta={{ text: 'View gallery', url: '/', type: 'outline' }}
		/>
	</LibrarySection>

	<LibrarySection
		title="Counter"
		type="Component"
		description="Reflects a stat by counting up to it when it scrolls into view, then back to zero when it leaves (unless `once`). Screen readers get the final number, not the counting. With reduced motion the final number just shows. It needs no GSAP."
		props={counterProps}
	>
		<div class="counters">
			<Counter
				digit={12500}
				comma
				prefix="$"
				suffix="+"
				label="Donated to the poor"
				spokenLabel="Over 12,500 dollars donated to the poor"
				duration={5000}
			/>
			<Counter
				digit={3.2}
				suffix="M"
				label="Books donated"
				spokenLabel="3.2 million books donated"
			/>
			<Counter
				digit={3200}
				prefix="~"
				label="Hours served"
				spokenLabel="Roughly 3,200 hours served"
				duration={8400}
				once
			/>
			<Counter digit={1529718} comma prefix="$" label="'Ticker' style" ticker />
		</div>
	</LibrarySection>

	<LibrarySection
		title="Form"
		type="Component"
		description="A contact form with two behaviors. Forms need Netlify set up: a page with a form must be prerendered so Netlify can find it, and the form is only sent in production (locally the feedback form shows its alert and the redirect form goes to the next page, without sending). Fields are floating labels, a honeypot catches bots, and `showRecaptcha` adds Netlify's reCAPTCHA."
		props={formProps}
	>
		<LibrarySection
			level={3}
			title="With feedback"
			description="Shows an alert on submit: success, or a warning if the same email is used twice (remembered in this browser). Alerts stack in the bottom right."
		>
			<div class="form-demo">
				<Form feedback showMessage />
			</div>
		</LibrarySection>
		<LibrarySection
			level={3}
			title="With a redirect"
			description="Sends the visitor to another page after submitting, here the Form Submitted page. `showPhone`, `showAddress` and `showDiscovery` add more fields."
		>
			<div class="form-demo">
				<Form showPhone showAddress showDiscovery maxCountDiscovery={250} />
			</div>
		</LibrarySection>
	</LibrarySection>

	<LibrarySection
		title="Image Circle"
		type="Component"
		description="Cards spaced evenly around an exact circle, spinning slowly while each card turns against the ring to stay upright. It is decorative, so it has no hover response. It scales with its container, and is off with reduced motion."
		props={imageCircleProps}
	>
		<h3 class="plain">Upright cards</h3>
		<div class="circle-demo">
			<ImageCircle images={galleryImages(8)} itemWidth={20} />
		</div>
		<h3 class="plain">Bloom, spinning the other way</h3>
		<div class="circle-demo">
			<ImageCircle images={galleryImages(8)} itemWidth={20} bloom="top" direction="right" />
		</div>
	</LibrarySection>

	<LibrarySection
		title="Image Columns"
		type="Component"
		description="A grid of images with an uneven number per column. As the page scrolls, every column moves up until its bottom lines up with the shortest column, which never moves. It needs GSAP ScrollTrigger, loaded only when the component is used, and is still when motion is reduced."
		props={imageColumnsProps}
	>
		<h3 class="plain">Plain images</h3>
		<ImageColumns
			images={[
				{ ...galleryImages(14)[0], accent: 'New', caption: 'Caption 1' },
				{ ...galleryImages(14)[1], caption: 'Caption 2' },
				...galleryImages(14).slice(2)
			]}
			columns={[3, 4, 3, 4]}
			columnsMd={[5, 4, 5]}
			columnsSm={[8, 6]}
			start="top center"
			startOffset="64px"
		/>
		<h3 class="plain">As gnomon cards</h3>
		<ImageColumns
			images={[
				{ ...galleryImages(10)[0], caption: 'One' },
				{ ...galleryImages(10)[1], caption: 'Two' },
				...galleryImages(10).slice(2)
			]}
			columns={[2, 3, 2, 3]}
			columnsMd={[4, 3, 3]}
			columnsSm={[5, 5]}
			gnomon={{ depth: 12, length: 36, radius: 4, angle: 80 }}
		/>
	</LibrarySection>

	<LibrarySection
		title="Image Comparison"
		type="Component"
		description="Two images with a divider between them: the position of the divider decides how much of each shows. It works by dragging, by hovering, and with the keyboard (arrow keys, Home and End), and it announces its position to screen readers."
		props={imageComparisonProps}
	>
		<h3 class="plain">Drag</h3>
		<ImageComparison
			before={{ src: '/images/img-sample-5.jpg', alt: 'The fifth sample image' }}
			after={{ src: '/images/img-sample-6.jpg', alt: 'The sixth sample image' }}
			beforeLabel="Before"
			afterLabel="After"
		/>
		<h3 class="plain">Follows the mouse</h3>
		<ImageComparison
			mode="hover"
			position={30}
			aspectRatio="21 / 9"
			before={{ src: '/images/img-sample-6.jpg', alt: 'The sixth sample image' }}
			after={{ src: '/images/img-sample-5.jpg', alt: 'The fifth sample image' }}
		/>
	</LibrarySection>

	<LibrarySection
		title="Image Fan"
		type="Component"
		description="Images curve along an arc whose radius comes from the spread and the card spacing, so the whole fan scales with its container. Hovering a card parts its neighbours. It is still when motion is reduced."
		props={imageFanProps}
	>
		<h3 class="plain">Pyramid that opens as it scrolls in</h3>
		<ImageFan
			images={galleryImages(5)}
			arc={40}
			gap={0.8}
			chop={16}
			itemWidth={20}
			stack="pyramid"
			animateIn
		/>
		<h3 class="plain">Semicircle, a valley</h3>
		<ImageFan images={galleryImages(7)} arc={180} gap={0.7} direction="down" itemWidth={18} />
		<h3 class="plain">Closed ring that rises in</h3>
		<ImageFan images={galleryImages(8)} closed gap={0.9} itemWidth={16} animateIn />
	</LibrarySection>

	<LibrarySection
		title="Image Wave"
		type="Component"
		description="A row of image cards that pans slowly left and loops without a seam, while each card bobs a little behind the one before it, so the bob reads as a wave travelling along the row. The images repeat enough to fill the screen. It is off with reduced motion."
		props={imageWaveProps}
	>
		<h3 class="plain">Scrolling pushes it along</h3>
		<ImageWave images={galleryImages(8)} scrub={0.5} />
		<h3 class="plain">Reverses with the scroll direction</h3>
		<ImageWave images={galleryImages(8)} scrub={0.5} reverse />
	</LibrarySection>

	<LibrarySection
		title="Mouse Cursor"
		type="Component"
		description="A custom cursor that follows the mouse. Mount it once in a layout; attachments such as `cursorContent` and `cursorTarget` then change how it looks. It is hidden on touch devices and with reduced motion. See the Attachments page for live demos."
		props={mouseCursorProps}
	/>

	<LibrarySection
		title="Post Card"
		type="Component"
		description="A link card for one post in a list, with its cover image, tag, date, author and description. The first card of the Blog page is featured."
		props={postCardProps}
	>
		<PostCard
			post={{
				slug: 'a-short-post',
				title: 'A sample post',
				description: 'Cards are shown in a grid on the Blog page.',
				author: 'Author Here',
				date: '2026-02-02',
				tag: 'Update',
				coverImage: '/images/img-sample-1.jpg'
			}}
		/>
	</LibrarySection>

	<LibrarySection
		title="Theme Toggle"
		type="Component"
		description="Switches between system, light and dark, and remembers the choice. It takes no props; an inline script in `app.html` applies the saved theme before the page paints."
	>
		<ThemeToggle />
	</LibrarySection>

	<LibrarySection
		title="Video Overlay"
		type="Component"
		description="A modal video on the native `<dialog>`, so focus trapping, Escape to close and an inert background come for free. The video only loads once it is opened and is released after it closes. Open it from anything by setting `open`; focus returns to the trigger on close."
		props={videoOverlayProps}
	>
		<Button text="Toggle Video Overlay" onclick={() => (videoOpen = true)} />
		<VideoOverlay
			bind:open={videoOpen}
			title="Sample video"
			src="https://www.dropbox.com/scl/fi/6sh06eo6b3x84qo823qcq/sample-video-1.mp4?rlkey=0v6dqkra2wk7de0rz849ufm7o&st=0705ulra&raw=1"
			poster="/images/img-sample-1.jpg"
		/>
	</LibrarySection>
</div>

<style lang="scss">
	/* LIBRARY: DELETE ME */
	.components {
		display: flex;
		flex-direction: column;
		gap: 128px;
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--body-padding);
	}

	.counters {
		display: flex;
		flex-wrap: wrap;
		gap: 128px;
		align-items: flex-start;
	}

	.circle-demo {
		width: min(560px, 100%);
	}

	.form-demo {
		width: min(640px, 100%);
	}

	.cards {
		width: 100%;
	}

	.cards :global(.slide) {
		align-items: center;
		padding: 48px 24px;
		border-radius: var(--radius);
		background: var(--color-surface);
		text-align: center;
	}

	.plain {
		margin: 16px 0 0;
	}
</style>
