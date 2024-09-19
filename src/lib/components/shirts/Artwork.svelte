<script lang="ts">
		import { onMount } from 'svelte';
		import Spinner from '../Spinner.svelte';
		import Colors, { selectedColorStore } from './helpers/Colors.svelte';
		import { generateDesign } from '$lib/utils/shirts/generateDesign';
		import { selectedKeywordStore } from '$lib/utils/shirts/stores';
		import Button from '../ui/button/button.svelte';
	
		let images = [
		{
			url: 'https://fal.media/files/elephant/9pYa-uxpUj6fx2GNmDPJR.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		},
		{
			url: 'https://fal.media/files/tiger/JsvF-UcLR8XVG-YMLhQp1.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		},
		{
			url: 'https://fal.media/files/koala/LMnwfFW4MgHWoDOkE8jwQ.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		},
		{
			url: 'https://fal.media/files/penguin/4WY4beL-To0QFs4GN2QTC.png',
			width: 1024,
			height: 1024,
			content_type: 'image/jpeg'
		}
	];
	
	
	$: selectedDesign = images.length > 0 ? images[0] : ({});
	let isLoading = false;
	let isTransparent = true;
	let errorMessage: string | null = null;

	async function handleGenerateDesign() {
		if (isLoading) return;

		isLoading = true;
		errorMessage = null;
		try {
			if (!$selectedKeywordStore?.keyword || !$selectedKeywordStore?.related_tag) {
				throw new Error('Selected keyword or related tags are not available');
			}

			const designs: ImageData[] | void = await generateDesign(
				$selectedKeywordStore.keyword,
				$selectedKeywordStore.related_tag
			);

			if (Array.isArray(designs) && designs.length > 0) {
				images = designs;
				selectedDesign = designs[0];
			} else {
				throw new Error('No designs generated or invalid result');
			}
		} catch (error) {
			console.error('Error generating design:', error);
			errorMessage = 'Failed to generate design. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="col-span-3">
	<section class="space-y-2">
		{#if errorMessage}
			<div class="rounded bg-red-200 p-2 text-red-800">
				{errorMessage}
			</div>
		{/if}

		<div class="grid gap-1">
			<div class="relative w-full overflow-hidden rounded-lg border-2">
				{#if isTransparent}
					<div class="absolute inset-0 bg-white bg-opacity-25 bg-checkered"></div>
				{:else}
					<div class="absolute inset-0" style={`background-color: ${$selectedColorStore.hex}`}></div>
				{/if}

				<div class="relative z-10 aspect-square">
					{#if selectedDesign}
						<div class="relative">
							<img
								class="block w-full rounded-lg object-cover object-center"
								src={selectedDesign.processed ? selectedDesign.processed : selectedDesign.url}
								alt="Shirt design"
								draggable="false"
							/>
							{#if isLoading}
								<div class="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
									<Spinner />
								</div>
							{/if}
						</div>
					{:else}
						<div class="flex h-full w-full items-center justify-center bg-black/80">
							<Button on:click={handleGenerateDesign} disabled={isLoading} class="disabled:cursor-not-allowed disabled:opacity-60">
								{isLoading ? 'Generating...' : 'Generate Design'}
							</Button>
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if images.length > 0}
			<div class="mt-4 grid grid-cols-6 gap-1">
				{#each images as image, i}
					<button
						on:click={() => { selectedDesign = images[i]; }}
						class="col-span-1 focus:outline-none"
						title={`Select Design ${i + 1}`}
					>
						<img
							class="block aspect-square w-full rounded-lg border-2 object-cover object-center"
							src={image.processed ? image.processed : image.url}
							alt={`Shirt design ${i + 1}`}
							draggable="false"
						/>
					</button>
				{/each}
				<button
					class="col-start-6 flex items-center justify-center rounded-lg border bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
					title="Refresh Designs"
					on:click={handleGenerateDesign}
				>
					<!-- SVG for refresh icon -->
				</button>
			</div>
			<div class="flex flex-row items-center gap-2 rounded-lg border bg-gray-200 p-2">
				<Colors />
			</div>
			<div class="flex flex-row items-center gap-2">
				<button
					class="rounded-lg bg-gray-200 px-2 py-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
					on:click={() => { isTransparent = !isTransparent; }}
					aria-label={isTransparent ? 'Show Background' : 'Hide Background'}
				>
					<!-- SVG for eye/eye-off icon -->
				</button>
			</div>
		{:else}
			<Button on:click={handleGenerateDesign}>Generate</Button>
		{/if}
	</section>
</div>

<style lang="postcss">

</style>