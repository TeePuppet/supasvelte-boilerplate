<script>
	import Button from "$lib/components/ui/button/button.svelte";
import PageNavigation from "../components/PageNavigation.svelte";
	import PageTitle from "../components/PageTitle.svelte";
	import * as Drawer from "$lib/components/ui/drawer";
	import { Portal } from "$lib/components/ui/dialog";
	import Input from "$lib/components/ui/input/input.svelte";
	import PageNav from '$lib/components/PageNav.svelte';
	import Label from "$lib/components/ui/label/label.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";

const pageNavItems = [
{
	label: "Designs",
	path: "/app/shirts/",
},
{
	label: "Trending",
	path: "/app/shirts/trending",
},
{
	label: "Upload Queue",
	path: "/app/shirts/upload"
},
{
	label: "Accounts",
	path: "/app/shirts/accounts"
}
]
	// @ts-ignore
	$: ({ supabase, user } = data);


	export let data
	const shirts = data.shirts
	console.log('data is', shirts)
	

const fetchUrl = async () => {
  const response = await fetch('https://sil.app.n8n.cloud/webhook/053c5823-013b-43c0-9040-37fb8dc59e14');
  return response;
};

// @ts-ignore
const markAsDone = async (id) => {
	const schema = supabase.schema('shirts');
  // @ts-ignore
  const { data, error } = await schema
    .from('shirts')
    .update({ draft: true })
    .eq('id', id)

  if (error) {
    console.error('Error updating shirt status:', error);
  } else {
    console.log('Shirt status updated successfully');
  }
}


</script>



<PageNav items={pageNavItems} selected="/app/shirts/"/>

<div class="grid grid-cols-1 gap-4 mt-6">


	{#each shirts as shirt }
	<Drawer.Root>
		<div class="relative">
		<Drawer.Trigger>
			<div class="relative border-2 rounded-lg text-left overflow-hidden">
				<img src="https://placehold.co/400x400"/>
				<div class="absolute top-2 left-2 px-2 py-1 flex flex-col gap-2 z-10 bg-black/10 rounded">
					<h2 class="text-sm font-medium">{shirt.keyword}</h2>
				</div>
			</div>
		</Drawer.Trigger>
			<Button class="absolute top-2 right-2" size="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></Button>
			<Button class="absolute bottom-3 right-2 bg-green-600" size="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg></Button></div>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/40" />
			<Drawer.Content class=" flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px]">
				<div class="max-w-md w-full mx-auto flex flex-col gap-4 overflow-auto p-4 rounded-t-[10px]">
					<img src="https://placehold.co/400x400"/>
					<Label>Title</Label>
					<Input value={shirt.listing_title}/>
					<Label>Description</Label>
					<Textarea value={shirt.listing_desc}/>
					<Input value={shirt.design_text}/>
					<Input value={shirt.desc}/>
					
				</div>
				<Drawer.Footer>
					<Button>Upload</Button>
					<Button variant="secondary">Cancel</Button>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
		
	{/each}
</div>
