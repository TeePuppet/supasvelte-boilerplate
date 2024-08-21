<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import { get } from 'svelte/store';


	const params = get(page).params;


    export let websiteId:string = params.website
    export let selected:string = "/posts"

    export let items = [
    {
        label: "Posts",
        path: "/posts",
    },
    {
        label: "Categories",
        path: "/categories"
    }
    ]

    
</script>

<Tabs.Root bind:value={selected} onValueChange={(value) => goto(`/app/websites/${websiteId}${value}`)}>
	<Tabs.List>
        {#each items as item}
            <Tabs.Trigger value={item.path}>{item.label}</Tabs.Trigger>
        {/each}
	</Tabs.List>
</Tabs.Root>


