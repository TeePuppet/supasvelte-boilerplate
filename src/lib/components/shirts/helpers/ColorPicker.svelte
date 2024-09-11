<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { removeBackground } from '$lib/utils/shirts/removeBackground';
    import { generatedDesigns, type generatedDesign } from '$lib/utils/shirts/stores';

    export let design: generatedDesign;

    $: image = design.processed ? design.processed : design.url;

    let selectedColor: string = '#000000';
    let isPicking: boolean = false;
    let eyeDropper: any;
    let colorInput: HTMLInputElement;
    let isMobile: boolean = false;

    onMount(() => {
        if ('EyeDropper' in window) {
            eyeDropper = new (window as any).EyeDropper();
        }
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    });

    async function startPicking() {
        if (eyeDropper && !isMobile) {
            isPicking = true;
            try {
                const result = await eyeDropper.open();
                selectedColor = result.sRGBHex;
                await processImage();
            } catch (error) {
                console.error('EyeDropper error:', error);
            } finally {
                isPicking = false;
            }
        } else {
            colorInput.click();
        }
    }

    function handleColorInput(event: Event) {
        selectedColor = (event.target as HTMLInputElement).value;
        processImage();
    }

    async function processImage() {
        try {
            const processedImage = await removeBackground(image, selectedColor);
            
            console.log('processed', processedImage)
            // Update the design object
            const updatedDesign: generatedDesign = {
                ...design,
                processed: processedImage,
                mask: selectedColor
            };

            // Update the store
            generatedDesigns.update(designs => 
                designs.map(d => d === design ? updatedDesign : d)
            );

            // Console log the updated design
            console.log('Updated design after background removal:', updatedDesign);
        } catch (error) {
            console.error('Error processing image:', error);
            alert(`Error processing image: ${error}`);
        }
    }
</script>

<div class="flex flex-col sm:flex-row items-center gap-4">
    <Button class="disabled:cursor-not-allowed" variant="default" size="icon" on:click={startPicking} disabled={isPicking}>
        {#if isPicking}
            Picking...
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off">
                <line x1="2" x2="22" y1="2" y2="22"/>
                <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/>
                <line x1="13.5" x2="6" y1="13.5" y2="21"/>
                <line x1="18" x2="21" y1="12" y2="15"/>
                <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/>
                <path d="M21 15V5a2 2 0 0 0-2-2H9"/>
            </svg>
        {/if}
    </Button>
    <input
        type="color"
        bind:this={colorInput}
        value={selectedColor}
        on:input={handleColorInput}
        class={isMobile ? "" : "hidden"}
    />
    {#if isMobile}
        <span>Selected color: {selectedColor}</span>
    {/if}
</div>