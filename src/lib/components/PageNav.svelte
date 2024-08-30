<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    import { onMount } from 'svelte';

    export let items = [
        {
            label: 'Item',
            path: '/app/shirts'
        }
    ]
    export let selected: string = items[0].path;

    let containerRef: HTMLDivElement;
    let isScrolling = false;

    onMount(() => {
        scrollSelectedIntoView(true);
    });

    function easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function smoothScroll(element: HTMLElement, start: number, target: number, duration: number) {
        if (isScrolling) return;
        isScrolling = true;

        let startTime = performance.now();

        function step(currentTime: number) {
            let elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / duration, 1);
            let easedProgress = easeInOutQuad(progress);
            
            element.scrollLeft = start + (target - start) * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                isScrolling = false;
            }
        }

        requestAnimationFrame(step);
    }

    function scrollSelectedIntoView(immediate = false) {
        if (containerRef) {
            const selectedButton = containerRef.querySelector(`[href="${selected}"]`) as HTMLElement;
            if (selectedButton) {
                const containerRect = containerRef.getBoundingClientRect();
                const buttonRect = selectedButton.getBoundingClientRect();
                const targetScroll = selectedButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
                
                if (immediate) {
                    containerRef.scrollLeft = targetScroll;
                } else {
                    smoothScroll(containerRef, containerRef.scrollLeft, targetScroll, 300); // 300ms duration
                }
            }
        }
    }

    $: if (selected) {
        setTimeout(() => scrollSelectedIntoView(), 0);
    }
</script>

<div class="flex overflow-x-auto no-scrollbar gap-2 absolute top-0 z-20 pl-4 py-4 bg-gradient-to-b from-black via-black to-black/0">
	<Button variant="secondary" size="sm" href="/app/">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
	</Button>
    <div class="flex overflow-x-auto no-scrollbar gap-2 pr-4" bind:this={containerRef}>
    {#each items as item}
        <Button 
            variant={selected === item.path ? 'default' : 'secondary'} 
            size="sm" 
            href={item.path}
        >
            {item.label}
        </Button>
    {/each}
    </div>
</div>