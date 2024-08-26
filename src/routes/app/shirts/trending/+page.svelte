<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import PageNavigation from '../../components/PageNavigation.svelte';
	import PageTitle from '../../components/PageTitle.svelte';

	export let data;
    const keywords = data.keywords
	console.log(data);

	const pageNavItems = [
		{
			label: 'Designs',
			path: 'shirts/'
		},
		{
			label: 'Trending',
			path: 'shirts/trending'
		},
		{
			label: 'Upload Queue',
			path: 'shirts/upload'
		},
		{
			label: 'Accounts',
			path: 'shirts/accounts'
		}
	];
</script>

<PageTitle title="Shirts"></PageTitle>

<div class="flex items-center justify-between">
	<PageNavigation items={pageNavItems} selected="shirts/trending" />
</div>

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
