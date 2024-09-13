<script lang="ts">
    import PageNav from '$lib/components/PageNav.svelte';
    import Artwork from '$lib/components/shirts/Artwork.svelte';
    import Spinner from '$lib/components/Spinner.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import { Scroll } from 'lucide-svelte';
    import { analyzeTopRankingPatterns, type ShirtData, type Analysis } from '$lib/utils/shirts/analyzeKeyword';
    import { onMount } from 'svelte';
    import { selectedKeywordStore } from '$lib/utils/shirts/stores';
	import Canvas from '$lib/components/shirts/helpers/Canvas.svelte';
	// import BackgroundRemover from '$lib/components/shirts/helpers/BackgroundRemover.svelte';


    interface KeywordData {
        keyword: string;
        number_of_items: number;
        search_volume: number;
        related_tag: string[];
        also_searched: string[];
        teepublic_shirts: ShirtData[];
    }

    export let data: { keyword: KeywordData };

    onMount(() => {
        selectedKeywordStore.set(data.keyword);
    });

    $: keyword = $selectedKeywordStore || {};
    $: isKeywordLoaded = !!keyword.keyword;


</script>

<PageNav variant="secondary">
    <div slot="secondary" class="flex justify-start gap-2">
        {#if isKeywordLoaded}
            <Button variant="secondary" class="capitalize">{keyword.keyword}</Button>
            <Button
                variant="secondary"
                class="capitalize"
                href={`https://www.teepublic.com/t-shirts?query=${keyword.keyword}`}
                target="_blank"
            >
                {keyword.number_of_items} Items
            </Button>
            <Button
                variant="secondary"
                class="capitalize"
                href={`https://www.google.ro/search?q=${keyword.keyword}`}
                target="_blank"
            >
                {keyword.search_volume} Searches
            </Button>
        {:else}
            <Spinner />
        {/if}
    </div>
</PageNav>

<section class="relative grid md:grid-cols-5 grid-cols-1 gap-1 px-4">
    <Canvas imageUrl="https://fal.media/files/elephant/esAQWWgJ4zfKwFsSnDjQH.png"/>

    <!-- <Artwork/> -->

    <!-- <BackgroundRemover 
  imageUrl="https://fal.media/files/koala/KfaA1CGT8Hd8gwIepjYfT.png"
  tolerance={180}
  expand={2}
  feather={1}
/> -->
    
    <!-- <div class="flex flex-col gap-2 col-span-2">
            <Input placeholder="Design Title" bind:value={design.title} />
            <Input placeholder="Keyword" bind:value={design.main_tag} />
            <Textarea placeholder="Tags" bind:value={design.secondary_tags} />
            <Textarea placeholder="Description" bind:value={design.description} />

            <h2 class="text-xl font-bold mb-4">Analysis and Recommendations</h2>
            <ul class="list-disc pl-5">
                {#each topRankingAnalysis.recommendations as recommendation}
                    <li>{recommendation}</li>
                {/each}
            </ul>
    </div> -->
   
</section>