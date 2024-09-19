<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';
	import PageNav from '$lib/components/PageNav.svelte';
	import { ArrowUpDown } from 'lucide-svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	interface KeywordItem {
		keyword: string;
		related_tag: string[];
		number_of_items: number;
		search_volume: number;
		updated_at: string;
	}

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
			label: 'Accounts',
			path: '/app/shirts/accounts'
		}
	];

	function createKeywordsStore() {
		const { subscribe, set, update } = writable<KeywordItem[]>([]);

		return {
			subscribe,
			set,
			update,
			addKeywords: (newKeywords: KeywordItem[]) =>
				update((keywords) => [...keywords, ...newKeywords]),
			clear: () => set([])
		};
	}

	const keywordsStore = createKeywordsStore();

	export let data: {
		keywords?: KeywordItem[];
		totalPages?: number;
		currentPage?: number;
	} = {};

	let totalPages = 1;
	let currentPage = 1;
	let isLoading = false;
	let keywordsContainer: HTMLElement;

	$: sortField =
		($page.url.searchParams.get('sort') as keyof Pick<
			KeywordItem,
			'number_of_items' | 'search_volume' | 'updated_at'
		>) || 'updated_at';
	$: sortOrder = ($page.url.searchParams.get('order') as 'asc' | 'desc') || 'desc';

	$: {
		totalPages = data.totalPages ?? 1;
		currentPage = data.currentPage ?? 1;

		if (data.keywords && data.keywords.length > 0) {
			if (currentPage === 1) {
				keywordsStore.set(data.keywords);
			} else {
				keywordsStore.addKeywords(data.keywords);
			}
		}
		isLoading = false;
	}

	function getButtonClass(field: typeof sortField) {
		return `px-4 py-2 text-sm font-medium rounded-md border ${
			sortField === field
				? 'bg-gray-700 text-white border-gray-600'
				: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
		}`;
	}

	async function changeSort(field: typeof sortField) {
		isLoading = true;
		const newOrder = field === sortField && sortOrder === 'desc' ? 'asc' : 'desc';
		keywordsStore.clear();
		await goto(`?page=1&sort=${field}&order=${newOrder}`, { keepFocus: true });
		await invalidateAll();
	}

	async function loadMoreKeywords() {
		if (isLoading || currentPage >= totalPages) return;

		isLoading = true;
		const nextPage = currentPage + 1;
		await goto(`?page=${nextPage}&sort=${sortField}&order=${sortOrder}`, {
			keepFocus: true,
			noScroll: true
		});
		await invalidateAll();
	}

	let ticking = false;
	function handleScroll() {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				if (keywordsContainer) {
					const containerRect = keywordsContainer.getBoundingClientRect();
					const containerBottom = containerRect.bottom;
					const windowHeight = window.innerHeight;

					if (containerBottom - windowHeight < 500 && !isLoading && currentPage < totalPages) {
						loadMoreKeywords();
					}
				}
				ticking = false;
			});
			ticking = true;
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:window on:scroll={handleScroll} />

<PageNav items={pageNavItems} selected="/app/shirts/trending" />

<div class="mt-6 grid w-full grid-cols-1 gap-2 px-4">
	<div class="mb-2 flex justify-end space-x-2">
		<Button
			on:click={() => changeSort('number_of_items')}
			class={getButtonClass('number_of_items')}
		>
			<ArrowUpDown class="mr-2 inline h-4 w-4" />
			Items {sortField === 'number_of_items' ? (sortOrder === 'asc' ? '(Least)' : '(Most)') : ''}
		</Button>
		<Button on:click={() => changeSort('search_volume')} class={getButtonClass('search_volume')}>
			<ArrowUpDown class="mr-2 inline h-4 w-4" />
			Searches {sortField === 'search_volume' ? (sortOrder === 'asc' ? '(Least)' : '(Most)') : ''}
		</Button>
		<Button on:click={() => changeSort('updated_at')} class={getButtonClass('updated_at')}>
			<ArrowUpDown class="mr-2 inline h-4 w-4" />
			Date {sortField === 'updated_at' ? (sortOrder === 'asc' ? '(Oldest)' : '(Newest)') : ''}
		</Button>
	</div>
	{#if $keywordsStore.length > 0}
		<section class="grid grid-cols-1 gap-4">
			<div id="keywords" class="space-y-1" bind:this={keywordsContainer}>
				{#each $keywordsStore as item}
					<div
						class="flex w-full items-center justify-between rounded border px-4 py-2 text-sm hover:bg-gray-50/10"
					>
						<div class="flex items-center gap-2">
							<Button
								href={`https://www.teepublic.com/t-shirts?query=${item.keyword}`}
								target="_blank"
								size="sm"
								rel="noopener noreferrer"
								variant="ghost"
								class="capitalize">{item.keyword}</Button
							>
						</div>

						<div class="flex items-center gap-8">
							<div class="text-xs text-gray-500">
								No. items <span class="mr-2 font-bold text-white">{item.number_of_items} </span>
								Searches <span class="font-bold text-white">{item.search_volume}</span>
							</div>
							<Button size="icon" variant="secondary" href={`/app/shirts/trending/${item.keyword}`}
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg
								></Button
							>
						</div>
					</div>
				{/each}
			</div>
		</section>
		{#if isLoading}
			<div class="mt-4 flex justify-center">
				<Spinner />
			</div>
		{/if}
	{:else if !isLoading}
		<p class="text-center text-gray-500">No keywords available.</p>
	{/if}
</div>
