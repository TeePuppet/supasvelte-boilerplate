<script>
    import * as Card from '$lib/components/ui/card';
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
	import PageNavigation from "../../../components/PageNavigation.svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    export let data;
    
const { website, projectData, categories } = data.props;
console.log(categories)
</script>
<PageNavigation websiteId={website} selected="/categories"/>

<Card.Root class="mt-6">
    <Card.Header>
        <Card.Title class="flex justify-between items-center"><span class="flex justify-start items-baseline gap-2">Categories</span>
        <Button size="sm" href="">Add Category</Button>
    </Card.Title>
    </Card.Header>
    <Card.Content class="pt-6 text-center">
      
        {#each categories as category}
        <p class="text-left border-b-2">
            {category.category_name}
        </p>
        {/each}
    </Card.Content>
</Card.Root>
