<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    import { onMount } from 'svelte';

    export let items = [
        {
            label: 'Shirts',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
            path: '/app/shirts'
        },
        {
            label: 'Websites',
            icon: `<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
                        width="18" height="18"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="7" height="7" x="3" y="3" rx="1" />
						<rect width="7" height="7" x="14" y="3" rx="1" />
						<rect width="7" height="7" x="14" y="14" rx="1" />
						<rect width="7" height="7" x="3" y="14" rx="1" />
					</svg>`,
            path: '/app/websites'
        }
    ]
    export let selected: string = items[0].path;

</script>

<div class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
    <div class="bg-muted border-muted-foreground rounded-lg flex gap-2 items-center justify-center p-2">
        {#each items as item}
            <Button 
                variant={selected === item.path ? 'default' : 'ghost'} 
                size="icon" 
                href={item.path}

            >
                {@html item.icon}
            </Button>
        {/each}
    </div>
</div>


