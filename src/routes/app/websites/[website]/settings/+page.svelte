<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { uploadFile } from '$lib/websites/data.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import Delete from './components/Delete.svelte';

	export let data;
	// let general:any
	$: ({ website, supabase, user } = data);

	$: console.log(user);
	// const projectData = data.projectData;
	// console.log(projectData)
	let general;
	$: settings = website;

	let websiteName: string = '';
	let repo: string = '';

	$: general = {
		name: website.name,
		repo: website.repo,
	};

	$: seo = {
		page_title: website.page_title,
		meta_description: website.meta_description,
		og_image: '',
		contact_email: ''
	}

	$: branding = {
		headerLogo: '',
		footerLogo: ''
	};

	$: fonts = {
		titles: 'https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,500;1,500&display=swap',
		body: 'https://fonts.googleapis.com/css2?family=Fira+Sans:ital@0;1&display=swap',
	}

	$: colors = {
		header: {
			headerBackground: '#006CE4',
			headerText: '#FFFFFF',
			menuBackgroundColor: '#013B94',
			mainCategoryColor: '#FFB700',
			secondaryCategoryColor: '#FFFFFF'
		},
		footer: {
			footerBackground: '#013B94',
			footerText: '#FFFFFF',
			footerHeading: '#FFFFFF'
		},
		body: {
			bodyBackground: '#000000',
			bodyText: '#181818',
			titles: '#000000',
			primary: '#FFB700',
		},
		
	};

	$: socialMedia = {
		instagram: settings.social_media.instagram,
		tiktok: settings.social_media.tiktok,
		facebook: settings.social_media.facebook,
		mail: settings.social_media.mail,
		whatsapp: settings.social_media.whatsapp,
		fbmessenger: settings.social_media.fbmessenger,
		linkedin: settings.social_media.linkedin,
		twitter: settings.social_media.twitter,
		youtube: settings.social_media.youtube,
		pinterest: settings.social_media.pinterest,
		reddit: settings.social_media.reddit,
		discord: settings.social_media.discord,
		telegram: settings.social_media.telegram
	};

	$: scripts = {
		googleAnalytics: '',
		headScripts: '',
		footerScripts: ''
	};
</script>

<div class="space-main">
	<Card.Root id="general" class="w-full">
		<Card.Header>
			<Card.Title>General</Card.Title>
		</Card.Header>
		<Card.Content class="space-card">
			<div class="space-input">
				<Label>Website name</Label>
				<Input placeholder="Website name" bind:value={general.name} />
			</div>
			<div class="space-input">
				<Label>Github repo name</Label>
				<Input disabled placeholder="repo_name" bind:value={general.repo} />
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root id="seo" class="w-full">
		<Card.Header>
			<Card.Title>General SEO</Card.Title>
		</Card.Header>
		<Card.Content class="space-card">
			<div class="space-input">
				<Label>Page title</Label>
				<Input placeholder="Page title" bind:value={seo.page_title} />
				<p class="text-sm text-muted-foreground">Title shown when shared or google result</p>
			</div>
			<div class="space-input">
				<Label>Meta Description</Label>
				<Textarea placeholder="Describe your website here." bind:value={seo.meta_description} />
				<p class="text-sm text-muted-foreground">
					Description shown when the homepage is shared or appears on google
				</p>
			</div>
			<div class="space-input">
				<Label>Contact email</Label>
				<Input placeholder="email@email.com" bind:value={seo.contact_email} />
				<p class="text-sm text-muted-foreground">
					Used on Legal (Terms & Conditions and Privacy) and Contact pages
				</p>
			</div>
			<div class="space-input">
				<Label>OG Image</Label>
				<Input type="file" placeholder="Upload" bind:value={seo.og_image} />
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root id="logo" class="w-full">
		<Card.Header>
			<Card.Title class="flex items-center justify-between"><span>Logo</span></Card.Title>
		</Card.Header>
		<Card.Content class="space-card">
			<div class="space-input">
				<Label>Nav Logo</Label>
				<Input type="file" placeholder="Upload" bind:value={branding.headerLogo} />
			</div>
			<div class="space-input">
				<Label>Footer Logo</Label>
				<Input type="file" placeholder="googele" bind:value={branding.footerLogo} />
			</div>
		</Card.Content>
	</Card.Root>


	<Card.Root id="fonts" class="w-full">
		<Card.Header>
			<Card.Title class="flex items-center justify-between">Fonts</Card.Title>
			<Card.CardDescription>
				<p>Customize the Google Fonts for various sections of your website.</p>
			</Card.CardDescription>
		</Card.Header>
		<Card.Content>
				<div class="space-input">
					<Label>Titles</Label>
					<Input placeholder="Google font URL" bind:value={scripts.googleAnalytics} />
				</div>
				<div class="space-input">
					<Label>Body</Label>
					<Input placeholder="Google font URL" bind:value={scripts.googleAnalytics} />
				</div>
		</Card.Content>
	</Card.Root>


	<Card.Root id="colors" class="w-full">
		<Card.Header>
			<Card.Title class="flex items-center justify-between">Colors</Card.Title>
			<Card.CardDescription>
				<p>Customize the color scheme for various sections of your website.</p>
			</Card.CardDescription>
		</Card.Header>
		<Card.Content>
			<div class="space-card mb-8">
				<h3 class="mb-3 font-medium">General</h3>
				<div class="space-input">
					<Label>Page background colour</Label>
					<Input placeholder="HEX value e.g. #FFFFFF" bind:value={colors.body.bodyBackground} />
				</div>
				<div class="space-input">
					<Label>Accent colour</Label>
					<Input placeholder="HEX value e.g. #FFFFFF" bind:value={colors.body.primary} />
				</div>
				<div class="space-input">
					<Label>Titles colour</Label>
					<Input placeholder="HEX value e.g. #FFFFFF" bind:value={colors.body.titles} />
				</div>
				<div class="space-input">
					<Label>Body text colour</Label>
					<Input placeholder="HEX value e.g. #FFFFFF" bind:value={colors.body.bodyText} />
				</div>
			</div>

			<div class="space-card mb-8">
				<h3 class="mb-3 font-medium">Header & Menu</h3>
				<div class="space-input">
					<Label>Header section background colour</Label>
					<Input placeholder="HEX value e.g. #FFFFFF" bind:value={scripts.googleAnalytics} />
				</div>
				<div class="space-input">
					<Label>Header text color</Label>
					<Input placeholder="HEX value e.g. #000000" bind:value={scripts.googleAnalytics} />
				</div>
				<div class="space-input">
					<Label>Menu background color</Label>
					<Input placeholder="HEX value e.g. #FFFFFF" bind:value={scripts.googleAnalytics} />
				</div>
				<div class="space-input">
					<Label>Category title colour</Label>
					<Input placeholder="HEX value e.g. #000000" bind:value={scripts.googleAnalytics} />
				</div>
				<div class="space-input">
					<Label>Subcategory title colour</Label>
					<Input placeholder="HEX value e.g. #000000" bind:value={scripts.googleAnalytics} />
				</div>
			</div>
			<div class="space-card">
				<h3 class="mb-3 font-medium">Footer</h3>
				<div class="space-input">
					<Label>Footer background color</Label>
					<Input placeholder="HEX value e.g. #000000" bind:value={scripts.googleAnalytics} />
				</div>
				<div class="space-input">
					<Label>Footer text colour</Label>
					<Input placeholder="HEX value e.g. #000000" bind:value={scripts.googleAnalytics} />
				</div>
				<div class="space-input">
					<Label>Footer title colour</Label>
					<Input placeholder="HEX value e.g. #000000" bind:value={scripts.googleAnalytics} />
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- * DONE * -->
	<Card.Root id="scripts" class="w-full">
		<Card.Header>
			<Card.Title>Scripts</Card.Title>
		</Card.Header>
		<Card.Content class="space-card">
			<div class="space-input">
				<Label>Google Analytics ID</Label>
				<Input placeholder="Google Analytics ID" bind:value={scripts.googleAnalytics} />
			</div>
			<div class="space-input">
				<Label>Head Script</Label>
				<Textarea placeholder="Scripts that go in the <head>" bind:value={scripts.headScripts} />
			</div>
			<div class="space-input">
				<Label>Footer Script</Label>
				<Textarea
					placeholder="Scripts that go at the end of the </body>"
					bind:value={scripts.footerScripts}
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- * DONE * -->
	<Card.Root id="social-media" class="w-full">
		<Card.Header>
			<Card.Title>Social Media</Card.Title>
		</Card.Header>
		<Card.Content class="space-card">
			<div class="space-input">
				<Label>Instagram</Label>
				<Input
					placeholder="e.g. https://www.instagram.com/YOURHANDLE/"
					bind:value={socialMedia.instagram}
				/>
			</div>

			<div class="space-input">
				<Label>TikTok</Label>
				<Input placeholder="TikTok URL" bind:value={socialMedia.tiktok} />
			</div>
			<div class="space-input">
				<Label>Facebook</Label>
				<Input placeholder="Facebook Account URL" bind:value={socialMedia.facebook} />
			</div>
			<div class="space-input">
				<Label>Mail</Label>
				<Input placeholder="mail@gmail.com" bind:value={socialMedia.mail} />
			</div>
			<div class="space-input">
				<Label>WhatsApp</Label>
				<Input placeholder="WhatsApp Phone Number" bind:value={socialMedia.whatsapp} />
			</div>
			<div class="space-input">
				<Label>FB Messenger</Label>
				<Input placeholder="FB Messenger URL" bind:value={socialMedia.fbmessenger} />
			</div>
			<div class="space-input">
				<Label>LinkedIn</Label>
				<Input placeholder="LinkedIn URL" bind:value={socialMedia.linkedin} />
			</div>
			<div class="space-input">
				<Label>twitter</Label>
				<Input placeholder="Twitter Account URL" bind:value={socialMedia.twitter} />
			</div>
			<div class="space-input">
				<Label>youtube</Label>
				<Input placeholder="Youtube URL" bind:value={socialMedia.youtube} />
			</div>
			<div class="space-input">
				<Label>pinterest</Label>
				<Input placeholder="Pinterest Account URL" bind:value={socialMedia.pinterest} />
			</div>
			<div class="space-input">
				<Label>Reddit</Label>
				<Input placeholder="Reddit Page URL" bind:value={socialMedia.reddit} />
			</div>
			<div class="space-input">
				<Label>Discord</Label>
				<Input placeholder="Discort Channel URL" bind:value={socialMedia.discord} />
			</div>
			<div class="space-input">
				<Label>Telegram</Label>
				<Input placeholder="Telegram Channel URL" bind:value={socialMedia.telegram} />
			</div>
		</Card.Content>
	</Card.Root>

	{#if user && user.email === 'silviu@silviu.co.uk'}
		<Delete {website} />
	{/if}
</div>
