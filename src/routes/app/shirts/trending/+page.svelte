<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import PageNav from '$lib/components/PageNav.svelte';
	import PageTitle from '../../components/PageTitle.svelte';

	export let data;
    const keywords = data.keywords

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


<PageNav items={pageNavItems} selected="/app/shirts/trending"/>


<div class="mt-6 grid grid-cols-1 gap-2">
    {#if keywords && Array.isArray(keywords)}
        {#each keywords as item}
        <a href={`https://www.teepublic.com/t-shirts?query=${encodeURIComponent(item.keyword)}`} target="_blank" rel="noopener noreferrer" class="flex border px-4 py-2 rounded justify-between items-center text-sm">
            <h3 class="text-sm font-medium capitalize">{item.keyword}</h3>
            <div class="text-muted-foreground">
                No. items <span class="text-white font-bold">{item.number_of_items} </span>
                Searches <span class="text-white font-bold">{item.search_volume}</span>

            </div>
            
        </a>
           
        {/each}
    {:else}
        <p>No keywords available.</p>
    {/if}
</div>
