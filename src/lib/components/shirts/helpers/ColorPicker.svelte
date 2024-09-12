<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    // import { removeBackground } from '$lib/utils/shirts/removeBackground';
    import { generatedDesigns, type generatedDesign } from '$lib/utils/shirts/stores';

    export let design: generatedDesign;

    $: image = design.processed ? design.processed : design.url;

    let selectedColor: string = '#000000';
    let isPicking: boolean = false;
    let eyeDropper: any;
    let colorInput: HTMLInputElement;
    let isMobile: boolean = false;
    let isIOS: boolean = false;

    onMount(() => {
        if ('EyeDropper' in window) {
            eyeDropper = new (window as any).EyeDropper();
        }
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    });

    function startPicking() {
        if (eyeDropper && !isMobile) {
            isPicking = true;
            eyeDropper.open()
                .then((result: { sRGBHex: string }) => {
                    selectedColor = result.sRGBHex;
                    processImage();
                })
                .catch((error: any) => {
                    console.error('EyeDropper error:', error);
                })
                .finally(() => {
                    isPicking = false;
                });
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

    function getContrastColor(hexcolor: string) {
        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }

        // Convert to RGB value
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);

        // Get YIQ ratio
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // Check contrast
        return (yiq >= 128) ? 'black' : 'white';
    }
</script>

<div class="flex flex-col sm:flex-row items-center gap-4">
    <Button 
        class="disabled:cursor-not-allowed" 
        variant="default" 
        size="icon" 
        on:click={startPicking} 
        disabled={isPicking}
        style="background-color: {selectedColor}; color: {getContrastColor(selectedColor)};"
    >
        {#if isPicking}
            Picking...
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
        {/if}
    </Button>
    <input
        type="color"
        bind:this={colorInput}
        value={selectedColor}
        on:input={handleColorInput}
        class={isIOS ? "opacity-0 absolute" : "hidden"}
    />
    <!-- <span>Selected color: {selectedColor}</span> -->
</div>