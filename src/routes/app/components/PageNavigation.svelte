<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import { get } from 'svelte/store';


    export let websiteId:string
    export let selected:string = "/"

    let items = [
        {
            label: "Dashboard",
            path: "/"
        },
    {
        label: "Posts",
        path: "/posts",
    },
    {
        label: "Categories",
        path: "/categories"
    },
    {
        label: "Deployments",
        path: "/deployments"
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


