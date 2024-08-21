<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	export let title: string;
	let className = '';

	export { className as class };
</script>

<div class={`mb-4 flex items-center justify-between ${className} border-b pb-4`}>
	<div class="flex items-center gap-2 space-y-1">
		<Button variant="ghost" size="icon" on:click={() => window.history.back()}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg
			></Button
		>
		<h2 class="text-lg font-medium">{title}</h2>
	</div>
	<slot></slot>
</div>
