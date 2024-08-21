<script>
    import * as Card from '$lib/components/ui/card';
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
	import PageNavigation from "../../../components/PageNavigation.svelte";
    import * as Sheet from "$lib/components/ui/sheet";
	import PageTitle from '../../../components/PageTitle.svelte';
    export let data;
    // console.log(data)
    $: ({ website, categories, user } = data);

// console.log(categories)
    // const categories = []
</script>
<PageTitle title={website.name}>
    <div>
        <Button size="sm" variant="ghost" href={`/app/websites/${website.repo}/settings`}>Settings</Button
            >
            <Button
                size="sm"
                variant="ghost"
                href={`https://github.com/TeePuppet/${website.github.repo}`}
                target="_blank">Github</Button
            >
            <Button
                size="sm"
                variant="ghost"
                href={`https://vercel.com/teepuppets-projects/${website.vercel.name}`}
                target="_blank">Vercel</Button
            >
    </div>
</PageTitle>

<PageNavigation selected="/categories"/>
<section class="my-4 flex flex-col rounded">
	<div class="flex items-center justify-between px-4 py-4">
		<div class="flex items-baseline justify-start gap-2">
			<h2 class="text-lg font-medium">Posts</h2>
		</div>
		<Button size="sm" href="">Add Post</Button>
	</div>

	<div
		class="flex w-full gap-2 rounded-t border-b px-4 py-2 text-xs font-medium text-muted-foreground"
	>
		<p class="w-[30%]">Title</p>
		<p class="flex-1">Post Count</p>
		<p class="flex-1">Published at</p>
		<p class="flex-1">Modified at</p>
		<p class="flex-1"></p>
	</div>
	{#each categories as category}
		<a
			href={`/app/websites/${website}/posts/${category.slug}`}
			class="flex w-full items-center justify-between gap-2 border-b px-4 py-2 text-sm hover:bg-muted"
		>
			<h3 class="w-[30%] truncate font-medium" title={category.category_name}>{category.category_name}</h3>
            <p>{category.post_count}</p>

			<div class="flex-1 text-right">
				<Button size="sm" variant="ghost">Edit</Button>
			</div>
		</a>
	{/each}
	<Button class="mt-4" size="sm" variant="outline" href="">Load More</Button>
</section>

