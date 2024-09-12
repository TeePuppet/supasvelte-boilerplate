<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import {
      loadImage,
      parseColor,
      createTransparencyMask,
      expandMask,
      applyTransparencyAndFeathering,
      sampleCornersColor,
    } from '$lib/utils/shirts/removeBackground';
    
    export let imageUrl: string = '';
    export let tolerance: number = 180;
    export let expand: number = 2;
    export let feather: number = 1;
    
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let mask: Uint8Array;
    let imageData: ImageData;
    let originalImageData: Uint8ClampedArray;
    let isDrawing: boolean = false;
    let brushRadius: number = 10;
    let brushMode: 'remove' | 'restore' = 'restore';
    let cornerColor: string = '';
    
    const dispatch = createEventDispatcher<{
      error: { message: string };
    }>();
    
    onMount(() => {
      if (imageUrl) {
        processImage();
      }
    });
    
    async function processImage(): Promise<void> {
      try {
        console.log('Starting image processing');
        await removeBackground(imageUrl, tolerance, expand, feather);
        console.log('Image processing completed successfully');
      } catch (error) {
        console.error('Error processing image:', error);
        dispatch('error', { message: error instanceof Error ? error.message : String(error) });
      }
    }
    
    async function removeBackground(imageUrl: string, tolerance: number = 180, expand: number = 2, feather: number = 1): Promise<void> {
      console.log('Starting removeBackground with:', { imageUrl, tolerance, expand, feather });
      try {
        const img = await loadImage(imageUrl);
        console.log('Image loaded successfully');
        
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        originalImageData = new Uint8ClampedArray(imageData.data);
    
        cornerColor = sampleCornersColor(ctx, canvas.width, canvas.height);
        console.log('Most frequent corner color:', cornerColor);
    
        const [baseRed, baseGreen, baseBlue] = parseColor(cornerColor);
        mask = createTransparencyMask(imageData.data, imageData.width, imageData.height, baseRed, baseGreen, baseBlue, tolerance);
        
        if (expand > 0) {
          expandMask(mask, imageData.width, imageData.height, expand);
        }
        
        applyMaskToImage(feather);
      } catch (error) {
        console.error('Error in removeBackground:', error);
        throw error;
      }
    }
    
    function applyMaskToImage(feather: number): void {
      if (!ctx) return;
      const { data, width, height } = imageData;
      applyTransparencyAndFeathering(data, mask, width, height, feather, originalImageData);
      ctx.putImageData(imageData, 0, 0);
    }
    
    function startDrawing(e: MouseEvent): void {
      isDrawing = true;
      draw(e);
    }
    
    function draw(e: MouseEvent): void {
      if (!isDrawing || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      updateMask(x, y);
      
      // Visualize the brush
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fillStyle = brushMode === 'remove' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)';
      ctx.fill();
      ctx.restore();
    }
    
    function updateMask(x: number, y: number): void {
      const { width, height } = imageData;
      for (let dy = -brushRadius; dy <= brushRadius; dy++) {
        for (let dx = -brushRadius; dx <= brushRadius; dx++) {
          const nx = Math.floor(x + dx);
          const ny = Math.floor(y + dy);
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = ny * width + nx;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= brushRadius) {
              mask[index] = brushMode === 'remove' ? 1 : 0;
            }
          }
        }
      }
      applyMaskToImage(feather);
    }
    
    function stopDrawing(): void {
      isDrawing = false;
    }
    
    function setBrushMode(mode: 'remove' | 'restore'): void {
      brushMode = mode;
    }
    
    function updateBrushSize(event: Event): void {
      const target = event.target as HTMLInputElement;
      brushRadius = parseInt(target.value);
    }
    
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        stopDrawing();
      }
    }
    </script>
    
    <div class="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
      <canvas
        bind:this={canvas}
        on:mousedown={startDrawing}
        on:mousemove={draw}
        on:mouseup={stopDrawing}
        on:mouseout={stopDrawing}
        on:blur={stopDrawing}
        on:keydown={handleKeyDown}
        tabindex="0"
        class="border border-gray-300 max-w-full"
      ></canvas>
      <div class="mt-4 flex items-center space-x-4">
        <button
          on:click={() => setBrushMode('remove')}
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Remove
        </button>
        <button
          on:click={() => setBrushMode('restore')}
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Restore
        </button>
        <div class="flex items-center space-x-2">
          <input
            type="range"
            min="1"
            max="50"
            bind:value={brushRadius}
            on:input={updateBrushSize}
            class="w-32"
          />
          <span class="text-sm text-gray-600">{brushRadius}px</span>
        </div>
      </div>
      {#if cornerColor}
        <div class="mt-4 flex items-center space-x-2">
          <span class="text-sm text-gray-600">Detected background color:</span>
          <div class="w-6 h-6 border border-gray-300" style="background-color: {cornerColor};"></div>
          <span class="text-sm font-mono">{cornerColor}</span>
        </div>
      {/if}
    </div>