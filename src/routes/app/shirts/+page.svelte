<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import PageNavigation from '../components/PageNavigation.svelte';
	import PageTitle from '../components/PageTitle.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Portal } from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import PageNav from '$lib/components/PageNav.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

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
			label: 'Upload Queue',
			path: '/app/shirts/upload'
		},
		{
			label: 'Accounts',
			path: '/app/shirts/accounts'
		}
	];
	// @ts-ignore
	$: ({ supabase, user } = data);

	export let data;
	const shirt = data.shirts[0];
	console.log(shirt)

	const fetchUrl = async () => {
		const response = await fetch(
			'https://sil.app.n8n.cloud/webhook/053c5823-013b-43c0-9040-37fb8dc59e14'
		);
		return response;
	};

</script>

<PageNav items={pageNavItems} selected="/app/shirts/" />

<div class="mt-16 grid grid-cols-1 gap-3 md:grid-cols-3 w-full px-4">
	<h2 class="font-medium text-lg" contenteditable="true">{shirt.listing_title}</h2>
	<p contenteditable="true" class="focus outline-none mb-3"><span class="px-4 py-1 bg-muted text-muted-foreground rounded border border-muted-foreground focus outline-none" >{shirt.keyword}</span></p>
	<div class="relative">
		<img class="block w-full object-cover object-center rounded-lg" src="https://placehold.co/400x400" alt="Shirt design" />
		<Button variant="secondary" size="icon" class="absolute top-2 right-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></Button>
		<Button size="sm" class="absolute bottom-2 right-2">Remove Background</Button>
		<Button variant="secondary" size="icon" class="absolute top-2 left-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></Button>
	</div>

	<div class="flex justify-between items-center">
		<h3 class="font-medium">Tags</h3>
		<Button variant="outline" size="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></Button>
	</div>

	<section class="border p-4 rounded">

	<div class="flex flex-wrap gap-2">
		{#each shirt.tags as tag}
		<span class="px-4 py-1 bg-muted text-muted-foreground rounded border border-muted-foreground whitespace-nowrap focus outline-none" contenteditable="true">{tag}</span>
		{/each}
		
	</div>
	</section>

	<div class="flex justify-between items-center">
		<h3 class="font-medium">Description</h3>
		<Button variant="outline" size="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></Button>
	</div>
	<section class="border p-4 rounded"><p class="focus outline-none" contenteditable="true">{shirt.listing_desc}</p></section>

	<section class="fixed left-0 right-0 bottom-0">
		<!-- Gradient blur background -->
		<div 
		  class="absolute inset-0 overflow-hidden"
		  style="
			-webkit-mask-image: linear-gradient(to top, black, transparent);
			mask-image: linear-gradient(to top, black, transparent);
		  "
		>
		  <div class="absolute inset-0 backdrop-blur-md bg-gradient-to-t from-black via-black/50 to-transparent" />
		</div>
		
		<!-- Content (buttons) -->
		<div class="relative z-10">
		  <div class="flex gap-2 px-4 py-4">
			<Button variant="secondary">Delete</Button>
			<Button class="flex-1">Upload</Button>
		  </div>
		</div>
	  </section>
	  
		<!-- <Drawer.Root>
				<div class="relative">
				<Drawer.Trigger class="block">
					<div class="overflow-hidden rounded-lg text-left w-full aspect-square object-cover object-center">
						<img class="block w-full object-cover object-center" src="https://placehold.co/400x400" alt="Shirt design" />
						<div class="absolute left-2 top-2 z-10 flex flex-col gap-2 rounded bg-black/10 px-2">
							<h2 class="text-sm font-medium">{shirt.keyword}</h2>
						</div>
					</div>
				</Drawer.Trigger>
			</div>
				<Drawer.Portal>
					<Drawer.Overlay class="fixed inset-0 bg-black/40" />
					<Drawer.Content
						class="fixed  bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px]"
					>
						<div
							class=" mx-auto flex w-full max-w-md flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
						>	
						<div class="relative">
							<img class="rounded-lg overflow-hidden" src="https://placehold.co/400x400" />
							<Button class="absolute bottom-2 right-2">Refresh</Button>
						</div>
							
							<h2 contenteditable="true" class="font-medium">{shirt.listing_title}</h2>
							<p contenteditable="true" >{shirt.listing_desc}</p>
							<p contenteditable="true" >{shirt.keyword}</p>
							<div class="flex justify-between items-center">	
								<h3 class="text-sm font-semibold">Tags</h3>
								<Button variant="secondary" size="sm">Refresh</Button>
							</div>

							<p contenteditable="true" >{shirt.tags}</p>
						</div>
						<Drawer.Footer>
							<div
								class="mx-auto flex w-full max-w-full flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
							>
								<div class="flex">
									<Button>Upload</Button>
									<Button>Delete</Button>
									
									<Button variant="secondary">Cancel</Button>
								</div>
							</div>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root
		> -->

</div>
