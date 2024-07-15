<script context="module" lang="ts">
	import { supabase } from '$lib/supabase/client';
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button';
	import PageTitle from '../components/PageTitle.svelte';
	// import { createSchema } from '$lib/websites/data';
	let websiteData: any[] | null = [];

	let { data: websites } = await supabase.from('websites').select('*');
	websiteData = websites;
	console.log(websiteData);
</script>

<PageTitle title="Websites">
	<Button href="/app/websites/add">Add Website</Button>
    <!-- <Button on:click={()=> createSchema('test_Schema')}>Create Schema</Button> -->
</PageTitle>

<div class="grid grid-cols-3 gap-4">
    {#if websiteData}
        {#each websiteData as website}
            <a href={`/app/websites/${website.repo}`}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">
                            <span>{website.name}</span>

                        </Card.Title>
                        <Card.Description>Card Description</Card.Description>
                    </Card.Header>
                </Card.Root>
            </a>
        {/each}
    {/if}
</div>
