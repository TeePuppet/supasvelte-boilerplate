<script>
	import Button from "$lib/components/ui/button/button.svelte";
import PageNavigation from "../components/PageNavigation.svelte";
	import PageTitle from "../components/PageTitle.svelte";

	$: ({ supabase, user } = data);

	export let data
	const shirts = data.shirts
	console.log('data is', shirts)
	const pageNavItems = [
    {
        label: "Designs",
        path: "/",
    },
    {
        label: "Upload Queue",
        path: "/upload"
    },
	{
        label: "Accounts",
        path: "/accounts"
    }
	]

const fetchUrl = async () => {
  const response = await fetch('https://sil.app.n8n.cloud/webhook/053c5823-013b-43c0-9040-37fb8dc59e14');
  return response;
};

const markAsDone = async (id) => {
	const schema = supabase.schema('shirts');
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
<PageTitle title="Shirts">
</PageTitle>

<div class="flex justify-between items-center">
	<PageNavigation  items={pageNavItems} selected="/"/>
	<Button on:click={fetchUrl}>Generate Ideas</Button>
</div>

<div class="grid grid-cols-1 gap-4 mt-6">
	{#each shirts as shirt }
		<div class="flex flex-col border p-4 rounded gap-2">
			<h3 class="text-sm font-medium">Title</h3>
			<p class="text-sm text-muted-foreground">{shirt.listing_title}</p>
			<h3 class="text-sm font-medium">Desc</h3>
			<p class="text-sm text-muted-foreground">{shirt.listing_desc}</p>
			<h3 class="text-sm font-medium">Main Tag</h3>
			<p class="text-sm text-muted-foreground">{shirt.keyword}</p>
			<h3 class="text-sm font-medium">Tags</h3>
			<p class="text-sm text-muted-foreground">{shirt.tags}</p>
			<h3 class="text-sm font-medium">Prompt</h3>
			<p class="text-sm text-muted-foreground">{shirt.design_desc}</p>
			<Button
				on:click={() => markAsDone(shirt.id)}
				variant="default"
			>
				Done
			</Button>
		</div>
	{/each}
</div>
