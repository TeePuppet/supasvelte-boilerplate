<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PageNav from '$lib/components/PageNav.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ArrowUpDown } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select';
	import CheckeredBackground from '$lib/components/atoms/CheckeredBackground.svelte';

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
    $: selectedAccount = undefined
	const pageNavItems = [
		{ label: 'Designs', path: '/app/shirts/' },
		{ label: 'Trending', path: '/app/shirts/trending' },
		{ label: 'Upload', path: '/app/shirts/upload' },
		{ label: 'Accounts', path: '/app/shirts/accounts' }
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

<PageNav items={pageNavItems} selected="/app/shirts/trending" />

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
		</div>
		{#each sortedKeywords as item}
			<Drawer.Root>
				<Drawer.Trigger
					class="flex w-full items-center justify-between rounded border px-4 py-2 text-sm"
				>
					<h3 class="text-sm font-medium capitalize">{item.keyword}</h3>
					<div class="text-muted-foreground">
						No. items <span class="font-bold text-white">{item.number_of_items} </span>
						Searches <span class="font-bold text-white">{item.search_volume}</span>
					</div>
				</Drawer.Trigger>

				<Drawer.Portal>
					<Drawer.Overlay class="fixed inset-0 bg-black/40" />
					<Drawer.Content
						class="fixed bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px]"
					>
						<div class="mx-auto flex w-full flex-col gap-4 overflow-auto rounded-t-[10px] p-4">
							<a
								href={`https://www.teepublic.com/t-shirts?query=${encodeURIComponent(item.keyword)}`}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-between rounded border px-4 py-2 text-sm"
							>
								<h3 class="text-sm font-medium capitalize">{item.keyword}</h3>
								<div class="text-muted-foreground">
									No. items <span class="font-bold text-white">{item.number_of_items} </span>
									Searches <span class="font-bold text-white">{item.search_volume}</span>
								</div>
							</a>
                            
                            <CheckeredBackground>
                                <Button>Generate Design</Button>
                                <Button variant="secondary">Upload File</Button>
                            </CheckeredBackground>

						</div>
						<!-- <Drawer.Footer>
							<div
								class="mx-auto flex w-full max-w-full flex-col gap-4 rounded-t-[10px]"
							>
								<Select.Root>
									<Select.Trigger class="w-full">
										<Select.Value placeholder="Select account" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="light">Light</Select.Item>
										<Select.Item value="dark">Dark</Select.Item>
										<Select.Item value="system">System</Select.Item>
									</Select.Content>
								</Select.Root>
								<div class="flex w-full flex-1 gap-2">
									<Button variant="secondary">Cancel</Button>
									<Button class="flex-grow" disabled={!selectedAccount}>Upload</Button>
								</div>
							</div>
						</Drawer.Footer> -->
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		{/each}
	{:else}
		<p>No keywords available.</p>
	{/if}
</div>
