<script>
import * as Card from '$lib/components/ui/card';
import { Button } from "$lib/components/ui/button";
import { Badge } from "$lib/components/ui/badge";
	import PageNavigation from "../../../components/PageNavigation.svelte";
    export let data

const { website, projectData } = data.props;
const deployments = projectData.latestDeployments
console.log(projectData)
</script>
<PageNavigation websiteId={website.repo} selected="/deployments"/>


<Card.Root class="mt-6">
    <Card.Header>
        <Card.Title class="flex justify-between items-center"><span class="flex justify-start items-baseline gap-2">Deployments <Badge size="sm" variant="outline">{deployments.length}</Badge></span>
        <Button size="sm" href="">New Build</Button></Card.Title>
    </Card.Header>
    <Card.Content class="pt-6 text-center">
      
        {#each deployments as deployment}
        <p class="">
            {deployment.id}
        </p>
        {/each}
    </Card.Content>
</Card.Root>
