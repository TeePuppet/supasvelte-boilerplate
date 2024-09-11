<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	export let variant = "main"
	export let items = [
		{
			label: 'Item',
			path: '/app/shirts'
		}
	];
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
				const targetScroll =
					selectedButton.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;

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

<div class=" w-full z-20">

	{#if variant === "main"}
	<div class="no-scrollbar relative z-20 flex w-full gap-2 overflow-x-hidden py-4 pl-4">
		<Button variant="secondary" size="sm" href="/app/">
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
				class="lucide lucide-layout-grid"
				><rect width="7" height="7" x="3" y="3" rx="1" /><rect
					width="7"
					height="7"
					x="14"
					y="3"
					rx="1"
				/><rect width="7" height="7" x="14" y="14" rx="1" /><rect
					width="7"
					height="7"
					x="3"
					y="14"
					rx="1"
				/></svg
			>
		</Button>
		<div class="no-scrollbar flex gap-2 overflow-x-auto pr-4" bind:this={containerRef}>
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
	{:else if variant === "secondary"}
	<div class="no-scrollbar relative z-20 flex w-full gap-2 overflow-x-hidden py-4 pl-4">
		<Button variant="secondary" size="sm" on:click={() => history.back()}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
		</Button>
		<slot name="secondary"></slot>
	</div>
	{/if}
</div>
