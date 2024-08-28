<script lang="ts">
    	import Button from '$lib/components/ui/button/button.svelte';
import Input from '$lib/components/ui/input/input.svelte';
import PageNav from '$lib/components/PageNav.svelte';
        import PageTitle from '../../components/PageTitle.svelte';
	// @ts-ignore
	$: ({ supabase, user } = data);


	export let data
	const uploads = data.upload
	console.log('data is', uploads)
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
</script>

<PageNav items={pageNavItems} selected="/app/shirts/upload"/>

<section class="grid grid-cols-7 gap-4 mt-4">
    <div class="col-span-5 border rounded">

    </div>
    <div class="flex flex-col col-span-2 border rounded p-4 gap-3">
        <h3 class="text-sm font-medium">Title</h3>
        <Input placeholder="title"/>
        <h3 class="text-sm font-medium">Main Keyword</h3>
        <Input placeholder="Keyword"/>
        <h3 class="text-sm font-bold">Tags</h3>
        <Input placeholder="Tags"/>

        <Input placeholder="File"/>
        <Button>Upload</Button>
    </div>
</section>