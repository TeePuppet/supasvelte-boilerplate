<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';

	import PageNav from '$lib/components/PageNav.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import CheckeredBackground from '$lib/components/atoms/CheckeredBackground.svelte';

	const pageNavItems = [
		{
			label: 'Designs',
			path: '/app/shirts/'
		},
		{
			label: 'Trending',
			path: '/app/shirts/trending'
		},
		{
			label: 'Upload',
			path: '/app/shirts/upload'
		},
		{
			label: 'Accounts',
			path: '/app/shirts/accounts'
		}
	];

	$: ({ supabase, user } = data);
	export let data;

	$: shirts = data.shirts || [];

	$: console.log('shirt is', shirts);

	$: newShirts = data.shirts;
	$: shirt = newShirts[0] || undefined;

	$: shirtImage = shirt.artwork || '';
	$: shirtColor = 'transparent';

	const publishDesign = async (
		id: number,
		artwork: string,
		title: string,
		main_tag: string,
		tags: string[],
		desc: string
	) => {
		const response = await fetch(
			'http://n8n.silviu.co.uk:5678/webhook/8b643479-c9bb-471e-a538-51f320182234',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					account_cookie: `_scid=9e4e7244-78d3-4607-f4cb-219e3fe0a475; FPID=FPID2.2.llrP%2FUKVeTQnN3diB9B97a%2BIVq7kXVBLWqCrTXSOkEU%3D.1702535399; rs_anonymous_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6Iklsd2laVFJqTURrek1XWXROak15TlMwMFptTTBMV0U0T1RJdFlqSXpNVEkwTVRNMk5URmhYQ0lpIiwiZXhwIjoiMjAyNS0wNi0yNFQwOTo1MzowMC4wNzdaIiwicHVyIjpudWxsfX0%3D--0bbae6f9e57ae8aa7115c9b426b3b3d15669cbe6; uploaderFunnel=single; __cf_bm=H4xAOTUS_jtTZxjPTdkY_XP9jwqZN8dvU8G.3x806Mw-1725431558-1.0.1.1-5GJJJqqXBudYGist4WLT4cSEEJV3L1zIyNhBixSOBoswGOSxrtU8b_tH9vLRbJo1PX5Rah0VkSLZTst2NeYqOQ; rs_user_id=IlwiOTQ0NDlhY2E5Y2VhMWYxMDQ0N2E0MDk3ZThlZjhiZmRiYTU1NTRmMVwiIg%3D%3D--c1edba4bed1b3ba5df2e0b4ea37dbb6c25a26db8; _session_id=4074632f0ab7ff9e112124b9037bb073; csrf_token=%2BK6cZzwrQA7%2FAI7qTfw%2B2qAkkQNZZComvju4pZHvvFX5QVg3eeUTm35uFQzlMCxq7XXDA92hbVCX4%2FmmxeHCeQ%3D%3D`,
					artwork_url: artwork,
					design_title: title,
					main_tag: main_tag,
					tags: tags,
					design_desc: desc
				})
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		console.log('Design published successfully');

		const schema = supabase.schema('shirts');

		// Update the shirt status to "UPLOADED"
		const { data, error } = await schema
			.from('shirts')
			.update({ status: 'UPLOADED' })
			.eq('id', id)
			.single();

		if (error) {
			console.error('Error updating shirt status:', error);
			throw error;
		}

		// Fetch updated list of shirts
		const { data: shirts, error: fetchError } = await schema
			.from('shirts')
			.select('*')
			.eq('status', 'DRAFT');

		console.log(shirts);
		if (fetchError) {
			console.error('Error fetching shirts:', fetchError);
			throw fetchError;
		}
		newShirts = shirts;

		return response;
	};

	const deleteDesign = async (id: number) => {
		try {
			// Delete the shirt
			const schema = supabase.schema('shirts');
			const { data, error } = await schema.from('shirts').delete().eq('id', id);

			if (error) {
				console.error('Error deleting shirt:', error);
				throw error;
			}

			console.log('Shirt deleted successfully');

			// Fetch updated list of shirts
			const { data: shirts, error: fetchError } = await schema
				.from('shirts')
				.select('*')
				.eq('status', 'DRAFT');

			console.log(shirts);
			if (fetchError) {
				console.error('Error fetching shirts:', fetchError);
				throw fetchError;
			}
			newShirts = shirts;
		} catch (err) {
			console.error('Unexpected error:', err);
			throw err;
		}
	};

	const removeBG = async (image: string) => {
		try {
			const response = await fetch('http://n8n.silviu.co.uk:5678/webhook/remove-bg', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					image: image
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const img = await response.json();
			console.log(img);
			shirtImage = img.image.url;

			console.log('Image changed');
		} catch (err) {
			console.error('Unexpected error:', err);
			throw err;
		}
	};

	const generateShirts = async () => {
		const response = await fetch(
			'http://n8n.silviu.co.uk:5678/webhook/053c5823-013b-43c0-9040-37fb8dc59e14',
			{
				method: 'GET'
			}
		);
	};
</script>

<PageNav items={pageNavItems} selected="/app/shirts/" />

{#if shirt}
	<div class="flex items-center justify-between rounded-lg border px-4 py-2">
		<h2>{newShirts.length} Designs Left</h2>
		<Button size="sm" on:click={generateShirts}>Generate More</Button>
	</div>
	<div class="mt-4 grid w-full grid-cols-1 gap-3 md:grid-cols-2">
		<div class="relative md:col-start-1 md:row-span-6">
			<CheckeredBackground color={shirtColor}>
				<img
					class={`block w-full rounded-lg object-cover object-center`}
					src={shirtImage}
					alt="Shirt design"
				/>
			</CheckeredBackground>
			<div>
				<Button size="sm" variant="outline" on:click={() => (shirtColor = 'Transparent')}
					>Transparent</Button
				>
				<Button size="sm" variant="outline" on:click={() => (shirtColor = '#FFFFFF')}>White</Button>
				<Button size="sm" variant="outline" on:click={() => (shirtColor = '#000000')}>Black</Button>

				<Button size="sm" variant="default" on:click={() => removeBG(shirt.artwork)}
					>Remove BG</Button
				>
			</div>
			<Drawer.Root>
				<Drawer.Trigger class="block">
					<Button variant="secondary" size="icon" class="absolute right-2 top-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-refresh-cw"
						>
							<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
							<path d="M21 3v5h-5" />
							<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
							<path d="M8 16H3v5" />
						</svg>
					</Button>
				</Drawer.Trigger>

				<Drawer.Portal>
					<Drawer.Overlay class="fixed inset-0 bg-black/40" />
					<Drawer.Content
						class="fixed bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px]"
					>
						<div
							class="mx-auto flex w-full max-w-md flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
						>
							<Label>Prompt</Label>
							<Textarea class="h-full min-h-[400px]" bind:value={shirt.prompt} />
						</div>
						<Drawer.Footer>
							<div
								class="mx-auto flex w-full max-w-full flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
							>
								<div class="flex w-full flex-1 gap-2">
									<Button variant="secondary">Cancel</Button>
									<Button class="flex-grow">Regenerate</Button>
								</div>
							</div>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</div>
		<div class="rounded-lg border p-4">
			<h2 class="text-lg font-medium md:col-start-2" contenteditable="true">{shirt.title}</h2>
			<p class="focus mb-3 outline-none md:col-start-2">
				<span
					class="focus rounded border border-muted-foreground bg-muted px-4 py-1 text-muted-foreground outline-none"
					contenteditable="true">{shirt.main_tag}</span
				>
			</p>

			<div class="flex items-center justify-between md:col-start-2">
				<h3 class="font-medium">Tags</h3>
				<Button variant="outline" size="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-refresh-cw"
					>
						<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
						<path d="M21 3v5h-5" />
						<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
						<path d="M8 16H3v5" />
					</svg>
				</Button>
			</div>

			<section class="rounded border p-4 md:col-start-2">
				<div class="flex flex-wrap gap-2">
					{#each shirt.tags as tag}
						<span
							class="focus whitespace-nowrap rounded border border-muted-foreground bg-muted px-4 py-1 text-muted-foreground outline-none"
							contenteditable="true">{tag}</span
						>
					{/each}
				</div>
			</section>

			<div class="flex items-center justify-between md:col-start-2">
				<h3 class="font-medium">Description</h3>
				<Button variant="outline" size="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-refresh-cw"
					>
						<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
						<path d="M21 3v5h-5" />
						<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
						<path d="M8 16H3v5" />
					</svg>
				</Button>
			</div>

			<section class="rounded border p-4 md:col-start-2">
				<p class="focus outline-none" contenteditable="true">{shirt.desc}</p>
			</section>
		</div>
		<section class=" md:col-span-2">
			<!-- Gradient blur background -->

			<!-- Content (buttons) -->
			<div class="relative z-10">
				<div class="flex gap-2">
					<Button variant="secondary" on:click={() => deleteDesign(shirt.id)}>Delete</Button>
					<Button
						class="flex-1"
						on:click={() =>
							publishDesign(
								shirt.id,
								shirt.artwork,
								shirt.title,
								shirt.main_tag,
								shirt.tags,
								shirt.desc
							)}>Upload</Button
					>
				</div>
			</div>
		</section>
	</div>
{:else}
	<div class="mt-24 flex h-full flex-col px-4">
		<Button on:click={generateShirts}>Generate Shirts</Button>
	</div>
{/if}
