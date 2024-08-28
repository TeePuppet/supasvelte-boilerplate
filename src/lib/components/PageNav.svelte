<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    
    export let items = [
        {
            label: 'Item',
            path: '/app/shirts'
        }
        ]
    export let selected:string = items[0].path
</script>

<div class="flex overflow-x-auto no-scrollbar gap-2">
	<Button variant="secondary" size="sm" on:click={() => window.history.back()}
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
    {#each items as item}
        <Button variant={selected === item.path ? 'default' : 'secondary'} size="sm" href={item.path}>{item.label}</Button>
    {/each}
</div>
