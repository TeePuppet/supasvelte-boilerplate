<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PageNav from '$lib/components/PageNav.svelte';
	import PageTitle from '../../components/PageTitle.svelte';
	import { ArrowUpDown } from 'lucide-svelte';

	interface KeywordItem {
		keyword: string;
		number_of_items: number;
		search_volume: number;
	}

	export let data: { keywords: KeywordItem[] };
    
	$: keywords = data.keywords;
	let sortedKeywords: KeywordItem[] = [];
	let sortField: keyof Pick<KeywordItem, 'number_of_items' | 'search_volume'> = 'number_of_items';
	let isAscending = true;

	const pageNavItems = [
		{ label: "Designs", path: "/app/shirts/" },
		{ label: "Trending", path: "/app/shirts/trending" },
		{ label: "Upload", path: "/app/shirts/upload" },
		{ label: "Accounts", path: "/app/shirts/accounts" }
	];

	function sortKeywords(field: typeof sortField) {
		if (sortField === field) {
			isAscending = !isAscending;
		} else {
			sortField = field;
			isAscending = true;
		}

		sortedKeywords = [...keywords].sort((a, b) => {
			const aValue = a[sortField];
			const bValue = b[sortField];
			return isAscending ? aValue - bValue : bValue - aValue;
		});
	}

	onMount(() => {
		// Apply initial sort
		sortKeywords('number_of_items');
	});
</script>

<PageNav items={pageNavItems} selected="/app/shirts/trending"/>

<div class="mt-6 grid grid-cols-1 gap-2 w-full">
	<div class="flex justify-end mb-2 space-x-2">
		<Button on:click={() => sortKeywords('number_of_items')} variant="outline" size="sm">
			<ArrowUpDown class="mr-2 h-4 w-4" />
			Sort by Items {sortField === 'number_of_items' ? (isAscending ? '(Asc)' : '(Desc)') : ''}
		</Button>
		<Button on:click={() => sortKeywords('search_volume')} variant="outline" size="sm">
			<ArrowUpDown class="mr-2 h-4 w-4" />
			Sort by Searches {sortField === 'search_volume' ? (isAscending ? '(Asc)' : '(Desc)') : ''}
		</Button>
	</div>

	{#if sortedKeywords.length > 0}
		{#each sortedKeywords as item}
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