<script>
import * as Card from '$lib/components/ui/card';
import { Button } from "$lib/components/ui/button";
import { Badge } from "$lib/components/ui/badge";
	import PageNavigation from "../../../components/PageNavigation.svelte";
    export let data;

const { website, projectData } = data.props;
console.log(data)
const numberOfPosts = 231
const posts = [
    {title: "post 1"},
    {title: "post 2"}
]
</script>
<PageNavigation websiteId={website.repo} selected="/posts"/>


<Card.Root class="mt-6">
    <Card.Header>
        <Card.Title class="flex justify-between items-center"><span class="flex justify-start items-baseline gap-2">Posts <Badge size="sm" variant="outline">{numberOfPosts}</Badge></span>
        <Button size="sm" href="">Add Post</Button></Card.Title>
    </Card.Header>
    <Card.Content class="pt-6 text-center">
      
        {#each posts as post}
        <p>
            {post.title}
        </p>
        {/each}
    </Card.Content>
</Card.Root>
