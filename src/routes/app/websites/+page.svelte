<script lang="ts">
    import type { PageData } from './$types';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import PageTitle from '../components/PageTitle.svelte';

    export let data: PageData;

    $: ({ websites, supabase, user } = data);

</script>

<PageTitle title="Websites">
	<Button href="/app/websites/add">Add Website</Button>
    <!-- <Button on:click={()=> createSchema('test_Schema')}>Create Schema</Button> -->
</PageTitle>

<div class="grid grid-cols-3 gap-4">
    {#if websites}
        {#each websites as website}
            <a href={`/app/websites/${website.repo}/posts`}>
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
