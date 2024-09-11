<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PageNav from '$lib/components/PageNav.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ArrowUpDown, Loader2 } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select';
	import CheckeredBackground from '$lib/components/atoms/CheckeredBackground.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Spinner from '$lib/components/Spinner.svelte';

	interface KeywordItem {
		keyword: string;
		related_tag: string[];
		number_of_items: number;
		search_volume: number;
		updated_at: string;
	}

	interface GeneratedDesign {
		image_url: string;
		title: string;
		keyword: string;
		tags: string[];
		desc: string;
	}

	const pageNavItems = [
		{ label: 'Designs', path: '/app/shirts/' },
		{ label: 'Trending', path: '/app/shirts/trending' },
		{ label: 'Upload', path: '/app/shirts/upload' },
		{ label: 'Accounts', path: '/app/shirts/accounts' },
		{
			label: 'Trending New',
			path: '/app/shirts/trending-new'
		},
	];

	export let data: { keywords: KeywordItem[] };

	$: keywords = data.keywords;
	$: selectedkeyword = data.keywords[Math.floor(Math.random() * data.keywords.length)];

	let sortedKeywords: KeywordItem[] = [];
	let sortField: keyof Pick<KeywordItem, 'number_of_items' | 'search_volume' | 'updated_at'> =
		'number_of_items';
	let isAscending = true;

	$: selectedAccount = undefined;

	function sortKeywords(field: typeof sortField) {
		if (sortField === field) {
			isAscending = !isAscending;
		} else {
			sortField = field;
			isAscending = true;
		}

		sortedKeywords = [...keywords].sort((a, b) => {
			if (field === 'updated_at') {
				const aDate = new Date(a[field]);
				const bDate = new Date(b[field]);
				return isAscending ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
			} else {
				const aValue = a[field];
				const bValue = b[field];
				return isAscending ? aValue - bValue : bValue - aValue;
			}
		});
	}

	onMount(() => {
		sortKeywords('number_of_items');
	});

	$: generatedDesign = undefined;
	$: designStyle = undefined;
	let isLoading = false;

	async function generateDesign(
		keyword: string,
		related_tags: string[],
		style: string | undefined = undefined
	) {
		isLoading = true;
		try {
			const response = await fetch('http://n8n.silviu.co.uk:5678/webhook/shirt-from-keyword', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					keyword,
					related_tags,
					...(style !== undefined && { style })
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const designs = await response.json();
			generatedDesign = designs; // Assuming the API always returns an array with at least one item
		} catch (err) {
			console.error('Unexpected error:', err);
			throw err;
		} finally {
			isLoading = false;
		}
	}
</script>

<PageNav items={pageNavItems} selected="/app/shirts/trending-new" />

<div class="mt-6 grid w-full grid-cols-1 gap-2 px-4">
	{#if sortedKeywords.length > 0}
		<div class="mb-2 flex justify-end space-x-2">
			<Button on:click={() => sortKeywords('number_of_items')} variant="outline" size="sm">
				<ArrowUpDown class="mr-2 h-4 w-4" />
				Sort by Items {sortField === 'number_of_items' ? (isAscending ? '(Asc)' : '(Desc)') : ''}
			</Button>
			<Button on:click={() => sortKeywords('search_volume')} variant="outline" size="sm">
				<ArrowUpDown class="mr-2 h-4 w-4" />
				Sort by Searches {sortField === 'search_volume' ? (isAscending ? '(Asc)' : '(Desc)') : ''}
			</Button>
			<Button on:click={() => sortKeywords('updated_at')} variant="outline" size="sm">
				<ArrowUpDown class="mr-2 h-4 w-4" />
				Sort by Updated At {sortField === 'updated_at' ? (isAscending ? '(Asc)' : '(Desc)') : ''}
			</Button>
		</div>
		<!-- <Input class="mb-2" placeholder="Style" bind:value={designStyle} /> -->
		<section class="grid grid-cols-1 gap-2">
				{#each sortedKeywords as item}
					<a class="flex w-full items-center justify-start gap-2 rounded border px-4 py-2" href={`/app/shirts/trending/${item.keyword}`}>
						<h3 class="text-sm font-medium capitalize">{item.keyword}</h3>
						<div class="text-muted-foreground text-xs flex items-center gap-2">
							<p class="flex items-center gap-1 bg-muted px-2 py-1 rounded border">
								<!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg> -->
								<span class="font-medium">{item.number_of_items} </span>
							</p>
							<p class="flex items-center gap-1  bg-muted px-2 py-1 rounded border">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
								<span class="font-medium "> {item.search_volume}</span>
							</p>
							
						</div>
					</a>
				{/each}
		</section>
	{:else}
		<p>No keywords available.</p>
	{/if}
</div>
