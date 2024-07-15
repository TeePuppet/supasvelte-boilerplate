<script lang="ts">
    import { supabase } from '$lib/supabase/client';
	import PageTitle from "../../components/PageTitle.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
	import {createSiteFromTemplate, updateConfig, updateConfigFile } from "$lib/websites/github";
	import { goto } from '$app/navigation';
	import { deployWebsite } from '$lib/websites/vercel';
	import { createBucket } from '$lib/websites/data';

    let isLoading = false
    $: websiteName = '';
    let repo: string;
    $: repo = websiteName ? `pond-${websiteName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()}` : '';

 

    const createWebsite = async (website:string, repo:string) => {
        const git = await createSiteFromTemplate(repo);
        const config = await updateConfig(repo, website);
        const { data, error } = await supabase
                .from('websites')
                .insert({ name: websiteName, repo: repo });
            if (error) {
                console.error('Error adding website to database:', error);
            } else {
                console.log('Website added to database:', data);
            }
        await createBucket(repo);
        await deployWebsite(repo);
        goto(`/app/websites/${repo}`);

        // console.log('update file', updateFile)
    }
</script>

<div>
	<PageTitle title="Add Website">
    </PageTitle>

            <Card.Root>
                <Card.Header>
                    <Card.Title>Website data</Card.Title>
                </Card.Header>
                <Card.Content class="space-y-3">
                    <div class="space-y-1">
                        <Label>Website name</Label>
                        <Input placeholder="Website name" bind:value={websiteName} />
                    </div>
                    <div class="space-y-1">
                        <Label>Github repo name</Label>
                        <Input disabled placeholder="repo_name" bind:value={repo} />
                    </div>

                    <Button on:click={async () => {
                        isLoading = true;
                        await createWebsite(websiteName, repo);
                        isLoading = false;
                    }} disabled={isLoading}>
                        {#if isLoading}
                            Loading...
                        {:else}
                            Create Website
                        {/if}
                    </Button>
                </Card.Content>
            </Card.Root>
</div>





