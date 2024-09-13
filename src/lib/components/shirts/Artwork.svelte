<script lang="ts">
	import { onMount } from 'svelte';
	import Spinner from '../Spinner.svelte';
	import Colors, { selectedColorStore } from './helpers/Colors.svelte';
	import { generateDesign } from '$lib/utils/shirts/generateDesign';
	import { generatedDesigns, selectedKeywordStore } from '$lib/utils/shirts/stores';
	import { removeBackground } from '$lib/utils/shirts/removeBackground';
	import type { ImageData as BGImageData } from '$lib/utils/shirts/removeBackground';

	interface ImageData extends BGImageData {
		processed?: string;
	}

	// Debug functions
	function debugLogCanvas(canvas: HTMLCanvasElement, label: string) {
		console.log(`${label} dimensions:`, canvas.width, 'x', canvas.height);
		console.log(`${label} data URL:`, canvas.toDataURL());
	}

	function debugLogCtx(ctx: CanvasRenderingContext2D, label: string) {
		console.log(`${label} composite operation:`, ctx.globalCompositeOperation);
		console.log(`${label} global alpha:`, ctx.globalAlpha);
		console.log(`${label} stroke style:`, ctx.strokeStyle);
	}

	// Initialize images (can be fetched or generated)
	let images: ImageData[] = [
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

	// Selected design state
	let selectedDesign: ImageData = images.length > 0 ? images[0] : ({} as ImageData);
	let isLoading = false;
	let isTransparent = true;
	let errorMessage: string | null = null; // To store error messages

	// Hidden canvas for mask processing
	let hiddenCanvas: HTMLCanvasElement;
	let hiddenCtx: CanvasRenderingContext2D;

	// Brush mode: 'add', 'remove', or 'none'
	type BrushMode = 'add' | 'remove' | 'none';
	let brushMode: BrushMode = 'none';

	// Brush properties
	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;
	const brushSize = 20; // Adjust brush size as needed
	let brushOpacity = 0.8; // Reduced opacity for smoother blending

	// Brush canvas references
	let brushCanvas: HTMLCanvasElement;
	let brushCtx: CanvasRenderingContext2D;

	// Brush outline canvas references
	let brushOutlineCanvas: HTMLCanvasElement;
	let brushOutlineCtx: CanvasRenderingContext2D;

	// Flag to determine if the code is running on the client
	let isClient = false;

	// Throttling mechanism using requestAnimationFrame
	let isApplyingBrush = false;

	// On component mount, create hidden canvas and set client flag
	onMount(() => {
		console.log('Component mounted');
		isClient = true;
		hiddenCanvas = document.createElement('canvas');
		hiddenCtx = hiddenCanvas.getContext('2d')!;
		console.log('Hidden canvas initialized');
	});

	// Update brush style when brushMode or brushOpacity changes
	$: if (brushCtx) {
		updateBrushStyle();
	}

	// Reactive statement for logging images
	$: console.log('Images generated:', images);

	// Function to handle design generation
	async function handleGenerateDesign() {
		if (isLoading) return;

		isLoading = true;
		errorMessage = null; // Reset error message
		try {
			console.log('Selected Keyword Store value:', $selectedKeywordStore);

			if (
				!$selectedKeywordStore ||
				!$selectedKeywordStore.keyword ||
				!$selectedKeywordStore.related_tag
			) {
				throw new Error('Selected keyword or related tags are not available');
			}

			const designs: ImageData[] | void = await generateDesign(
				$selectedKeywordStore.keyword,
				$selectedKeywordStore.related_tag
			);

			if (Array.isArray(designs) && designs.length > 0) {
				images = designs;
				selectedDesign = designs[0];
				console.log('Designs generated successfully');
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

	async function handleRemoveBackground() {
		if (isLoading || !selectedDesign) return;
		isLoading = true;
		errorMessage = null;

		try {
			console.log('Removing background for selected design:', selectedDesign.url);
			const result = await removeBackground(selectedDesign, hiddenCanvas, hiddenCtx);

			selectedDesign.processed = result.processedDataURL;

			images = images.map((img) => (img === selectedDesign ? selectedDesign : img));

			const maskImageData = hiddenCtx.createImageData(result.width, result.height);
			for (let i = 0; i < result.finalAlphaData.length; i++) {
				const alpha = result.finalAlphaData[i];
				maskImageData.data[i * 4] = 255;
				maskImageData.data[i * 4 + 1] = 255;
				maskImageData.data[i * 4 + 2] = 255;
				maskImageData.data[i * 4 + 3] = alpha;
			}
			hiddenCtx.putImageData(maskImageData, 0, 0);
			console.log('Background removed and mask updated successfully');
		} catch (error) {
			errorMessage = 'Failed to remove background. Please try a different image.';
		} finally {
			isLoading = false;
		}
	}

	// Drawing functions
	function startDrawing(event: MouseEvent | TouchEvent) {
		if (brushMode === 'none') return;
		isDrawing = true;
		const { x, y } = getCanvasCoordinates(event);
		lastX = x;
		lastY = y;
		brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
		draw(event);
	}

	function draw(event: MouseEvent | TouchEvent) {
		if (!isDrawing) return;
		event.preventDefault();
		const { x, y } = getCanvasCoordinates(event);
		brushCtx.beginPath();
		brushCtx.moveTo(lastX, lastY);
		brushCtx.lineTo(x, y);
		brushCtx.stroke();
		lastX = x;
		lastY = y;
		drawBrushOutline(x, y);

		if (!isApplyingBrush) {
			isApplyingBrush = true;
			requestAnimationFrame(() => {
				applyBrushStrokes();
				isApplyingBrush = false;
			});
		}
	}

	function stopDrawing() {
		if (!isDrawing) return;
		isDrawing = false;
		if (!isApplyingBrush) {
			isApplyingBrush = true;
			requestAnimationFrame(() => {
				applyBrushStrokes();
				isApplyingBrush = false;
			});
		}
	}

	function getCanvasCoordinates(event: MouseEvent | TouchEvent) {
		const rect = brushCanvas.getBoundingClientRect();
		let clientX: number, clientY: number;

		if (event instanceof MouseEvent) {
			clientX = event.clientX;
			clientY = event.clientY;
		} else {
			clientX = event.touches[0].clientX;
			clientY = event.touches[0].clientY;
		}

		const scaleX = brushCanvas.width / rect.width;
		const scaleY = brushCanvas.height / rect.height;
		const x = (clientX - rect.left) * scaleX;
		const y = (clientY - rect.top) * scaleY;
		return { x, y };
	}

	function drawBrushOutline(x: number, y: number) {
		brushOutlineCtx.clearRect(0, 0, brushOutlineCanvas.width, brushOutlineCanvas.height);
		brushOutlineCtx.beginPath();
		brushOutlineCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
		brushOutlineCtx.strokeStyle = 'white';
		brushOutlineCtx.lineWidth = 2;
		brushOutlineCtx.stroke();
		brushOutlineCtx.strokeStyle = 'black';
		brushOutlineCtx.lineWidth = 1;
		brushOutlineCtx.stroke();
	}

	function handleMouseMove(event: MouseEvent) {
		const { x, y } = getCanvasCoordinates(event);
		drawBrushOutline(x, y);
	}

	function applyBrushStrokes() {
		if (!selectedDesign) return;

		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = brushCanvas.width;
		tempCanvas.height = brushCanvas.height;
		const tempCtx = tempCanvas.getContext('2d')!;
		tempCtx.drawImage(brushCanvas, 0, 0);
		brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);

		hiddenCtx.globalCompositeOperation = brushMode === 'add' ? 'source-over' : 'destination-out';
		hiddenCtx.globalAlpha = brushOpacity;
		hiddenCtx.drawImage(tempCanvas, 0, 0);
		hiddenCtx.globalCompositeOperation = 'source-over';
		hiddenCtx.globalAlpha = 1;

		const imageCanvas = document.createElement('canvas');
		imageCanvas.width = hiddenCanvas.width;
		imageCanvas.height = hiddenCanvas.height;
		const imageCtx = imageCanvas.getContext('2d')!;
		const img = new Image();
		img.onload = () => {
			imageCtx.drawImage(img, 0, 0);
			imageCtx.globalCompositeOperation = 'destination-in';
			imageCtx.drawImage(hiddenCanvas, 0, 0);
			selectedDesign.processed = imageCanvas.toDataURL();
			selectedDesign = { ...selectedDesign };
		};
		img.src = selectedDesign.url;
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		if (!img.naturalWidth || !img.naturalHeight) return;

		hiddenCanvas.width = brushCanvas.width = brushOutlineCanvas.width = img.naturalWidth;
		hiddenCanvas.height = brushCanvas.height = brushOutlineCanvas.height = img.naturalHeight;
		hiddenCtx = hiddenCanvas.getContext('2d')!;
		brushCtx = brushCanvas.getContext('2d')!;
		brushOutlineCtx = brushOutlineCanvas.getContext('2d')!;
		hiddenCtx.drawImage(img, 0, 0);

		const imageData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
		const data = imageData.data;

		const maskImageData = hiddenCtx.createImageData(hiddenCanvas.width, hiddenCanvas.height);
		const maskData = maskImageData.data;

		for (let i = 0; i < data.length; i += 4) {
			maskData[i] = 255;
			maskData[i + 1] = 255;
			maskData[i + 2] = 255;
			maskData[i + 3] = data[i + 3];
		}

		hiddenCtx.putImageData(maskImageData, 0, 0);
		brushCtx.lineJoin = 'round';
		brushCtx.lineCap = 'round';
		brushCtx.lineWidth = brushSize;
		updateBrushStyle();
	}

	function updateBrushStyle() {
		if (brushCtx) {
			brushCtx.strokeStyle = brushMode === 'add' ? 'white' : 'black';
			brushCtx.globalAlpha = brushOpacity;
		}
	}
</script>

<div class="col-span-3">
	<section class="space-y-2">
		<!-- Display Error Message -->
		{#if errorMessage}
			<div class="error-message rounded bg-red-200 p-2 text-red-800">
				{errorMessage}
			</div>
		{/if}

		<div class="grid gap-1">
			<div class="relative w-full overflow-hidden rounded-lg border-2">
				{#if isTransparent}
					<div class="checkered-pattern absolute inset-0 bg-white bg-opacity-25"></div>
				{:else}
					<div
						class="absolute inset-0"
						style={`background-color: ${$selectedColorStore.hex}`}
					></div>
				{/if}

				<div class="relative z-10 aspect-square">
					{#if selectedDesign}
						<!-- Image Display with Brush Canvas -->
						<div class="relative">
							<img
								class="block w-full rounded-lg object-cover object-center"
								src={selectedDesign.processed ? selectedDesign.processed : selectedDesign.url}
								alt="Shirt design"
								draggable="false"
								on:load={handleImageLoad}
							/>
							{#if isLoading}
								<div
									class="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
								>
									<Spinner />
								</div>
							{/if}

							{#if selectedDesign.processed}
								<!-- Brush Canvas Overlay -->
								<canvas
									bind:this={brushCanvas}
									class="absolute inset-0 z-30 h-full w-full cursor-none"
									on:mousedown={startDrawing}
									on:mousemove={draw}
									on:mouseup={stopDrawing}
									on:mouseout={stopDrawing}
									on:touchstart={startDrawing}
									on:touchmove={draw}
									on:touchend={stopDrawing}
								></canvas>

								<!-- Brush Outline Canvas -->
								<canvas
									bind:this={brushOutlineCanvas}
									class="pointer-events-none absolute inset-0 z-40 h-full w-full"
									on:mousemove={handleMouseMove}
								></canvas>
							{/if}
						</div>
					{:else}
						<!-- Generate Design Button -->
						<div class="flex h-full w-full items-center justify-center bg-black/80">
							<div class="flex flex-col gap-2">
								<button
									class="z-20 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
									on:click={handleGenerateDesign}
									disabled={isLoading}
								>
									{#if isLoading}
										<Spinner />
										<span class="ml-2">Generating...</span>
									{:else}
										Generate Design
									{/if}
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if images.length > 0}
			<!-- Controls Section -->
			<div class="mt-4 flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
				<!-- Brush Mode Buttons -->
				<div class="flex flex-row items-center gap-2">
					<!-- Add Brush Button -->
					<button
						class={`rounded-full p-2 ${
							brushMode === 'add' ? 'bg-green-200' : 'bg-gray-200 hover:bg-gray-300'
						} focus:outline-none focus:ring-2 focus:ring-green-500`}
						on:click={() => {
							brushMode = 'add';
							console.log('Brush mode set to ADD');
						}}
						title="Add to Mask"
						aria-label="Add to Mask"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-plus-circle"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 8v8" />
							<path d="M8 12h8" />
						</svg>
					</button>

					<!-- Remove Brush Button -->
					<button
						class={`rounded-full p-2 ${
							brushMode === 'remove' ? 'bg-red-200' : 'bg-gray-200 hover:bg-gray-300'
						} focus:outline-none focus:ring-2 focus:ring-red-500`}
						on:click={() => {
							brushMode = 'remove';
							console.log('Brush mode set to REMOVE');
						}}
						title="Remove from Mask"
						aria-label="Remove from Mask"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-minus-circle"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M8 12h8" />
						</svg>
					</button>
				</div>

				<!-- Remove Background and Show/Hide Background Buttons -->
				<div class="flex flex-row items-center gap-2">
					<!-- Remove Background Button -->
					<button
						class={`rounded-lg px-2 py-1 ${
							isLoading || selectedDesign.processed !== undefined
								? 'cursor-not-allowed bg-gray-400'
								: 'bg-red-500 hover:bg-red-600'
						} text-white focus:outline-none focus:ring-2 focus:ring-red-400`}
						on:click={handleRemoveBackground}
						disabled={isLoading || selectedDesign.processed !== undefined}
						title="Remove Background"
						aria-label="Remove Background"
					>
						{#if isLoading && selectedDesign.processed === undefined}
							<Spinner />
						{:else if selectedDesign.processed}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-check"
							>
								<path d="M20 6L9 17l-5-5" />
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-trash-2"
							>
								<polyline points="3 6 5 6 21 6" />
								<path
									d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
								/>
								<line x1="10" y1="11" x2="10" y2="17" />
								<line x1="14" y1="11" x2="14" y2="17" />
							</svg>
						{/if}
					</button>

					<!-- Show/Hide Background Button -->
					<button
						class="rounded-lg bg-gray-200 px-2 py-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
						on:click={() => {
							isTransparent = !isTransparent;
							console.log(`Background transparency set to: ${isTransparent}`);
						}}
						aria-label={isTransparent ? 'Show Background' : 'Hide Background'}
					>
						{#if isTransparent}
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
								class="lucide lucide-eye"
							>
								<path
									d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
								/>
								<circle cx="12" cy="12" r="3" />
							</svg>
						{:else}
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
								class="lucide lucide-eye-off"
							>
								<path
									d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
								/>
								<path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
								<path
									d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
								/>
								<path d="m2 2 20 20" />
							</svg>
						{/if}
					</button>
				</div>

				<!-- Colors Component -->
				<div class="flex flex-row items-center gap-2 rounded-lg border bg-gray-200 p-2">
					<Colors />
				</div>
			</div>

			<!-- Thumbnail Images -->
			<div class="mt-4 grid grid-cols-6 gap-1">
				{#each images as image, i}
					<button
						on:click={() => {
							selectedDesign = images[i];
							console.log(`Selected Design ${i + 1}`);
						}}
						class="col-span-1 focus:outline-none"
						title={`Select Design ${i + 1}`}
					>
						<div class="relative">
							<img
								class="block aspect-square w-full rounded-lg border-2 object-cover object-center"
								src={image.processed ? image.processed : image.url}
								alt={`Shirt design ${i + 1}`}
								draggable="false"
								on:load={handleImageLoad}
							/>
							{#if isLoading && selectedDesign === image}
								<div
									class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
								>
									<Spinner />
								</div>
							{/if}
						</div>
					</button>
				{/each}

				<!-- Refresh Designs Button in Thumbnails -->
				<button
					class="col-start-6 flex items-center justify-center rounded-lg border bg-muted hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
					title="Refresh Designs"
					on:click={handleGenerateDesign}
				>
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
					>
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
						<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
						<path d="M16 16h5v5" />
					</svg>
				</button>
			</div>
		{/if}
	</section>
</div>

<style lang="postcss">
	.checkered-pattern {
		@apply bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0];
		background-image: linear-gradient(45deg, black 25%, transparent 25%),
			linear-gradient(-45deg, black 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, black 25%),
			linear-gradient(-45deg, transparent 75%, black 25%);
		background-repeat: repeat;
		background-size: 20px 20px;
	}

	.error-message {
		/* Customize the error message styling as needed */
		background-color: #fdecea;
		color: #b91c1c;
		border: 1px solid #f5c2c7;
		padding: 1rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
	}

	/* Optional: Style the spinner overlay for better visibility */
	.relative > .absolute {
		/* Ensure the spinner overlay covers the image completely */
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	/* Highlight selected brush mode */
	.bg-green-200 {
		background-color: #d1fae5; /* Light green background */
	}

	.bg-red-200 {
		background-color: #fecaca; /* Light red background */
	}

	/* Ensure brush canvas covers the image and captures pointer events */
	canvas {
		/* The cursor indicates drawing */
		cursor: crosshair;
	}

	/* Disable button styles when disabled */
	button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.absolute.right-2.top-2 {
			right: 0.5rem;
			top: 0.5rem;
		}
	}
</style>
