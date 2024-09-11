<script>
	import Button from '../ui/button/button.svelte';

	export let color = 'transparent';
	export let image = undefined;
</script>

<div class="relative w-full overflow-hidden rounded-lg border-2">
	{#if color === 'transparent'}
		<div class={`checkered-pattern absolute inset-0 bg-white bg-opacity-25`}></div>
	{:else}
		<div class={`absolute inset-0`} style={`background-color: ${color}`}></div>
	{/if}

	<div class="relative z-10 aspect-square">
		{#if image}
			<img
				class={`block w-full rounded-lg object-cover object-center`}
				src={image}
				alt="Shirt design"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-black/80">
				<div class="flex flex-col gap-2">
					<slot></slot>
				</div>
			</div>
		{/if}
	</div>
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
