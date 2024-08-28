<script>
	import Button from "$lib/components/ui/button/button.svelte";
import PageNavigation from "../components/PageNavigation.svelte";
	import PageTitle from "../components/PageTitle.svelte";
	import * as Drawer from "$lib/components/ui/drawer";
	import { Portal } from "$lib/components/ui/dialog";
	import Input from "$lib/components/ui/input/input.svelte";
	import PageNav from '$lib/components/PageNav.svelte';

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
		<Drawer.Trigger>
			<div class="border-2 rounded-lg text-left overflow-hidden">
				<img src="https://placehold.co/400x400"/>
				<div class="p-4 flex flex-col gap-2">
					<h2 class="text-sm font-medium">{shirt.listing_title}</h2>
					<p class="text-muted-foreground text-sm"><span class="text-foreground font-medium">{shirt.keyword}</span>{#each shirt.tags as tag}
						<span>, {tag}</span>
					{/each} </p>
				</div>
			</div>
		</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/40" />
			<Drawer.Content class=" flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px]">
				<div class="max-w-md w-full mx-auto flex flex-col gap-4 overflow-auto p-4 rounded-t-[10px]">
					<Input value={shirt.listing_title}/>
					<Input value={shirt.listing_desc}/>
					<Input value={shirt.design_text}/>
					<Input value={shirt.desc}/>
					
				</div>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
		
	{/each}
</div>
