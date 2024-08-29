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
	const shirts = data.shirts;
	console.log('data is', shirts);

	const fetchUrl = async () => {
		const response = await fetch(
			'https://sil.app.n8n.cloud/webhook/053c5823-013b-43c0-9040-37fb8dc59e14'
		);
		return response;
	};

	// @ts-ignore
	const markAsDone = async (id) => {
		const schema = supabase.schema('shirts');
		// @ts-ignore
		const { data, error } = await schema.from('shirts').update({ draft: true }).eq('id', id);

		if (error) {
			console.error('Error updating shirt status:', error);
		} else {
			console.log('Shirt status updated successfully');
		}
	};
</script>

<PageNav items={pageNavItems} selected="/app/shirts/" />

<div class="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 w-full">
	{#each shirts as shirt}
		<Drawer.Root>
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
						class="fixed bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px]"
					>
						<div
							class="mx-auto flex w-full max-w-md flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
						>	
						<div class="relative">
							<img src="https://placehold.co/400x400" />
							<Button>Refresh</Button>
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
		>
	{/each}
</div>
