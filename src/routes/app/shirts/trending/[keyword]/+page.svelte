<script lang="ts">
	import PageNav from '$lib/components/PageNav.svelte';
	import { RefreshCcw, ImageOff, ClipboardCopy } from 'lucide-svelte';

	import Artwork from '$lib/components/shirts/Artwork.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Scroll } from 'lucide-svelte';
	import {
		analyzeTopRankingPatterns,
		type ShirtData,
		type Analysis
	} from '$lib/utils/shirts/analyzeKeyword';
	import { onMount } from 'svelte';
	import { selectedKeywordStore } from '$lib/utils/shirts/stores';
	import { getImageAnalysis, removeBackground } from '$lib/utils/shirts/removeBackground';
	import Label from '$lib/components/ui/label/label.svelte';
	import AutoScalingTextarea from '$lib/components/atoms/AutoScalingTextarea.svelte';

	$: images = [
		{
			url: 'https://fal.media/files/kangaroo/ZgmEsF4jJq_ksSWce_4Ik.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		},
		{
			url: 'https://fal.media/files/elephant/bDwNJGoKGigYHjjV7duGC.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		},
		{
			url: 'https://fal.media/files/zebra/OUSRHCWNXutp373TNfZw_.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		},
		{
			url: 'https://fal.media/files/monkey/Pxma7oE5Yrl9isybnS8aw.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		}
	];

	$: imageurl = 'https://fal.media/files/monkey/agBQ1ogJ0GmIaXvePxqJP.png';
	$: imageBg = 'pink';

	$: metadata = {
		artwork: 'https://fal.media/files/kangaroo/ZgmEsF4jJq_ksSWce_4Ik.png',
		title: 'Add title',
		main_tag: 'main tag',
		tags: ['tag1', 'tag2', 'tag3'],
		desc: 'this is a description',
		product_color: '#000000'
	};

	let isProcessing = false;
	let isTransparent = false;
	$: console.log(imageBg);

	// Remove Background & Set BG Color
	const removebg = async () => {
		isProcessing = true;
		try {
            //Upscale
			const bg = await getImageAnalysis(metadata.artwork);
			metadata.product_color = bg.dominantColor;

			metadata.artwork = await removeBackground(metadata.artwork);
		} catch (error) {
			console.error('Error processing image:', error);
			// You might want to show an error message to the user here
		} finally {
			isProcessing = false;
		}
	};

	export let data;

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

<section class="relative grid grid-cols-1 gap-6 px-4 md:grid-cols-2 pb-8">
	<section id="image" class="relative col-span-1 aspect-square ">
		{#if isProcessing}
			<div class="absolute top-0 flex h-full w-full items-center justify-center bg-black/80">
				<Spinner />
				<span class="ml-2">Processing...</span>
			</div>
		{/if}

		{#if images.length > 0}
        <div class="relative">
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				class="bg-checkered w-full rounded-md"
				style={`background-color: ${imageBg}`}
				src={metadata.artwork}
				alt="Processed image"
                draggable="false"
			/>
			<Button
            variant="secondary"
				size="icon"
				class="absolute right-2 bottom-2"
				disabled={isProcessing}
				on:click={() => removebg()}><ImageOff size={20}/></Button
			>
        </div>
            <div class="grid grid-cols-4 gap-2 mt-2">
                {#each images as image, i}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->

                    <img
                        class="rounded-md {metadata.artwork === image.url ? 'opacity-100' : 'opacity-40'}"
                        src={image.url}
                        on:click={() => metadata.artwork = image.url}
                        alt={metadata.title}
                        draggable="false"
                    />
                {/each}
            </div>
		{:else}
			<Button
				class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
				disabled={isProcessing}>Generate Image</Button
			>
		{/if}
	</section>

	<section id="metadata" class="border rounded-md p-4">
		<div class="flex items-start justify-between gap-2">
            <AutoScalingTextarea class="text-lg font-medium" placeholder="Title" bind:value={metadata.title} />
			<Button
				variant="ghost"
				size="icon"
				on:click={() => {
					navigator.clipboard.writeText(imageBg);
				}}
			>
				<ClipboardCopy size={16} />
			</Button>
		</div>
		<div class="flex items-center justify-between gap-2">
            <AutoScalingTextarea placeholder="Color" bind:value={metadata.product_color} />
			<Button
				variant="ghost"
				size="icon"
				style={`background-color: ${metadata.product_color}`}
				on:click={() => {
					navigator.clipboard.writeText(metadata.product_color);
				}}
			>
				<ClipboardCopy size={16} />
			</Button>
		</div>
		<div class="flex items-center justify-between gap-2">
            <AutoScalingTextarea placeholder="Main Tag" bind:value={metadata.main_tag} />
			<Button
				variant="ghost"
				size="icon"
				on:click={() => {
					navigator.clipboard.writeText(metadata.main_tag);
				}}
			>
				<ClipboardCopy size={16} />
			</Button>
		</div>
		<div class="flex items-center justify-between gap-2">
            <AutoScalingTextarea placeholder="Tags" bind:value={metadata.tags}/>
			<Button
				variant="ghost"
				size="icon"
				on:click={() => {
					navigator.clipboard.writeText(metadata.tags.toString());
				}}
			>
				<ClipboardCopy size={16} />
			</Button>
		</div>
		<div class="flex items-start justify-between gap-2">
            <AutoScalingTextarea placeholder="Description" bind:value={metadata.desc}/>
			<Button
				variant="ghost"
				size="icon"
				on:click={() => {
					navigator.clipboard.writeText(metadata.desc);
				}}
			>
				<ClipboardCopy size={16} />
			</Button>
		</div>
	</section>

    <Button>Save</Button>
</section>

<style>
	.bg-checkered {
		background-image: linear-gradient(45deg, black 25%, transparent 25%),
			linear-gradient(-45deg, black 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, black 25%),
			linear-gradient(-45deg, transparent 75%, black 25%);
		background-size: 20px 20px;
		background-position:
			0 0,
			0 10px,
			10px -10px,
			-10px 0;
	}
</style>
