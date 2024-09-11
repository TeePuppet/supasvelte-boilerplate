<script lang="ts">
	import { generateDesign } from '$lib/utils/shirts/generateDesign';
	import { generatedDesigns, selectedKeywordStore } from '$lib/utils/shirts/stores';
	import Spinner from '../Spinner.svelte';
	import Button from '../ui/button/button.svelte';
	import ColorPicker from './helpers/ColorPicker.svelte';
	import Colors, { selectedColorStore } from './helpers/Colors.svelte';

	let className: string | undefined = 'undefined';

	$: images = $generatedDesigns;
	$: selectedDesign = images.length > 0 ? images[0] : undefined;
	$: isLoading = false;

    $: console.log('images generated', images)
	$: isTransparent = true;
	async function handleGenerateDesign() {
		if (isLoading) return;

		isLoading = true;
		try {
			console.log('selectedKeywordStore value:', $selectedKeywordStore);

			if (
				!$selectedKeywordStore ||
				!$selectedKeywordStore.keyword ||
				!$selectedKeywordStore.related_tag
			) {
				throw new Error('Selected keyword or related tags are not available');
			}

			console.log(
				'Generating design with:',
				$selectedKeywordStore.keyword,
				$selectedKeywordStore.related_tag
			);
			const designs = await generateDesign($selectedKeywordStore.keyword, $selectedKeywordStore.related_tag);

            
		} catch (error) {
			console.error('Error generating design:', error);
			// Optionally, show an error message to the user
			alert('Failed to generate design. Please try again.');
		} finally {
			isLoading = false;
		}
	}
	export { className as class };
</script>

<div class={className}>
	<section class="space-y-2">
		<div class="grid gap-1">
			<div class="relative w-full overflow-hidden rounded-lg border-2">
				{#if isTransparent}
					<div class={`checkered-pattern absolute inset-0 bg-white bg-opacity-25`}></div>
				{:else}
					<div
						class={`absolute inset-0`}
						style={`background-color: ${$selectedColorStore.hex}`}
					></div>
				{/if}

				<div class="relative z-10 aspect-square">
					{#if selectedDesign}
						<div class="absolute right-2 top-2 flex flex-row items-center gap-1">
							<Button variant="secondary" size="icon"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg
								></Button
							>
							<Button variant="secondary" size="icon"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-minus"><path d="M5 12h14" /></svg
								></Button
							>
							<ColorPicker design={selectedDesign} />
						</div>
						<img
							class={`block w-full rounded-lg object-cover object-center`}
							src={selectedDesign.processed ? selectedDesign.processed : selectedDesign.url}
							alt="Shirt design"
						/>
					{:else}
						<div class="flex h-full w-full items-center justify-center bg-black/80">
							<div class="flex flex-col gap-2">
								<Button class="z-20" on:click={() => handleGenerateDesign()} disabled={isLoading}>
									{#if isLoading}
										<Spinner />
										<span class="ml-2">Generating...</span>
									{:else}
										Generate Design
									{/if}
								</Button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if images.length > 0}
			<div class="grid grid-cols-6 gap-1">
				{#each images as image, i}
					<button on:click={() => (selectedDesign = images[i])}>
						<img
							class={`block aspect-square w-full rounded-lg border-2 object-cover object-center`}
							src={image.processed ? image.processed : image.url}
							alt="Shirt design"
						/>
					</button>
				{/each}

				<button class={`col-start-6 flex items-center justify-center rounded-lg border bg-muted`}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-refresh-ccw"
						><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
							d="M3 3v5h5"
						/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path
							d="M16 16h5v5"
						/></svg
					>
				</button>
			</div>
		{/if}
		{#if selectedDesign}
			<div class="flex flex-row items-center gap-2">
				<Button
					class="rounded-lg bg-muted px-2"
					variant="ghost"
					size="icon"
					on:click={() => (isTransparent = !isTransparent)}
					>{#if isTransparent}<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-eye"
							><path
								d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
							/><circle cx="12" cy="12" r="3" /></svg
						>{:else}<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-eye-off"
							><path
								d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
							/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path
								d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
							/><path d="m2 2 20 20" /></svg
						>{/if}</Button
				>

				<div class="flex flex-row items-center gap-2 rounded-lg border bg-muted p-2">
					<Colors/>
				</div>
			</div>
		{/if}
	</section>
</div>

<style lang="postcss">
	.checkered-pattern {
		@apply bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0];
		background-image: linear-gradient(45deg, theme('colors.black') 25%, transparent 25%),
			linear-gradient(-45deg, theme('colors.black') 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, theme('colors.black') 5%),
			linear-gradient(-45deg, transparent 75%, theme('colors.black') 75%);
	}
</style>
