<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
	import { Button } from '$lib/components/ui/button/index.js';
    import { uploadFile } from '$lib/websites/data.js'
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	export let data;
    // let general:any
	const { website, projectData } = data.props;

	const settings = website;

	let websiteName: string = '';
	let repo: string = '';

    $: general = {
        name: website.name,
        repo: website.repo,
        page_title: website.page_title,
        meta_description: website.meta_description,
        og_image: '',
        contact_details: ''
    }

    $: branding = {
        headerLogo: '',
        footerLogo: ''
    }

    $: colors = {
        header: {
            headerBackground: '' || '#FFFFFF',
            headerText:'',
            menuBackgroundColor:'' || '#000000',
            mainCategoryColor: '',
            secondaryCategoryColor: '',
        },
        footer: {
            footerBackground: '',
            footerText: '',
            footerHeading: '',
        },
        body: {
            bodyBackground: '',
            text: '',
            titles: ''
        },
        primary: '',
        secondary: '',
        tertiary: '',

    }

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
        googleAnalytics: ""
    }
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
            <div class="py-1"></div>
            <h3 class="text-lg font-semibold leading-none tracking">General SEO</h3>
            <p></p>
            <div class="space-input">
				<Label>Page title</Label>
				<Input placeholder="Page title" bind:value={general.page_title} />
                <p class="text-sm text-muted-foreground">Title shown when shared or google result</p>
			</div>
			<div class="space-input">
				<Label>Meta Description</Label>
				<Textarea placeholder="Describe your website here." bind:value={general.meta_description}/>
                <p class="text-sm text-muted-foreground">Description shown when the homepage is shared or appears on google</p>
			</div>
            <div class="space-input">
				<Label>Contact email</Label>
				<Input placeholder="email@email.com" bind:value={general.contact_details} />
                <p class="text-sm text-muted-foreground">Used on Legal (Terms & Conditions and Privacy) and Contact pages</p>
			</div>
            <div class="space-input">
				<Label>OG Image</Label>
				<Input type="file" placeholder="Upload" bind:value={general.og_image} />
			</div>
		</Card.Content>
        <Card.Footer>
            <Button class="w-full" variant="default" size="sm" on:click={() => uploadFile('track', 'uploads', 'test', general.og_image)}>Save</Button>
        </Card.Footer>
	</Card.Root>

    <h2 id="branding" class="text-xl font-semibold leading-none tracking-tight">Branding</h2>
    <p class="text-muted-foreground">The style of the website</p>
    <Card.Root id="logo" class="w-full">
		<Card.Header>
			<Card.Title class="flex items-center justify-between"><span>Logo</span>
            </Card.Title>
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

    <Card.Root id="colors" class="w-full">
		<Card.Header>
            <Card.Title class="flex items-center justify-between"><span>Colors</span>
                
                <Button variant="outline" size="sm">Generate Color Scheme</Button>
                    </Card.Title>
		</Card.Header>
		<Card.Content class="space-card">
            <div class="space-input">
				<Label>Header background</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>Header text color</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>Menu bg color</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>mainCategoryColor</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>secondaryCategoryColor</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>footerBackground</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>footerText</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>footerHeading</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>bodyBackground</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>headerText</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>accent</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>titles</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            <div class="space-input">
				<Label>body</Label>
				<Input placeholder="#Header BG" bind:value={scripts.googleAnalytics} />
			</div>
            

		</Card.Content>
	</Card.Root>

    <Card.Root id="general" class="w-full">
		<Card.Header>
			<Card.Title>Scripts</Card.Title>
		</Card.Header>
		<Card.Content class="space-card">
            <div class="space-input">
				<Label>Google Analytics ID</Label>
				<Input placeholder="googele" bind:value={scripts.googleAnalytics} />
			</div>
			<div class="space-input">
				<Label>Head Script</Label>
				<Textarea placeholder="Describe your website here." bind:value={general.meta_description}/>
			</div>
            <div class="space-input">
				<Label>Footer Script</Label>
				<Textarea placeholder="Describe your website here." bind:value={general.meta_description}/>
			</div>



		</Card.Content>
	</Card.Root>


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
				<Input placeholder="WhatsApp " bind:value={socialMedia.whatsapp} />
			</div>
			<div class="space-input">
				<Label>FB Messenger</Label>
				<Input placeholder="FB Messenger" bind:value={socialMedia.fbmessenger} />
			</div>
			<div class="space-input">
				<Label>LinkedIn</Label>
				<Input placeholder="LinkedIn" bind:value={socialMedia.linkedin} />
			</div>
			<div class="space-input">
				<Label>twitter</Label>
				<Input placeholder="twitter" bind:value={socialMedia.twitter} />
			</div>
			<div class="space-input">
				<Label>youtube</Label>
				<Input placeholder="youtube" bind:value={socialMedia.youtube} />
			</div>
			<div class="space-input">
				<Label>pinterest</Label>
				<Input placeholder="youtube" bind:value={socialMedia.pinterest} />
			</div>
			<div class="space-input">
				<Label>Reddit</Label>
				<Input placeholder="Reddit Page URL" bind:value={socialMedia.reddit} />
			</div>
			<div class="space-input">
				<Label>Discord</Label>
				<Input placeholder="youtube" bind:value={socialMedia.discord} />
			</div>
			<div class="space-input">
				<Label>Telegram</Label>
				<Input placeholder="youtube" bind:value={socialMedia.telegram} />
			</div>
		</Card.Content>
	</Card.Root>
</div>
