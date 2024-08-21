<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import PageNavigation from '../../../components/PageNavigation.svelte';
	// import PostsTable from './PostsTable.svelte'
	import type { Posts } from '$lib/types';
	import { Input } from '$lib/components/ui/input';
	import PageTitle from '../../../components/PageTitle.svelte';

	export let data;

	$: ({ website, posts } = data);

	$: console.log(posts);

	// $: console.log(posts)
	// const numberOfPosts = 232;
	// const posts: Posts[] = [
	// 	{
	// 		slug: 'hello-world',
	// 		page_title: 'Hello World',
	// 		meta_description:
	// 			'An introductory post welcoming readers to the blog, setting the stage for future content and engagement.',
	// 		website: 'calatoreala.ro',
	// 		category: 'city-break',
	// 		subcategory: 'italia',
	// 		post_title: 'Welcome to Calatoreala.ro',
	// 		created_at: new Date('2024-07-14 14:20:16.687161+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'exploring-paris',
	// 		page_title: 'Exploring Paris',
	// 		meta_description: 'A detailed guide to the best attractions and hidden gems in Paris.',
	// 		website: 'calatoreala.ro',
	// 		category: 'city-break',
	// 		subcategory: 'france',
	// 		post_title: 'Discover the Magic of Paris',
	// 		created_at: new Date('2024-08-01 10:15:30.123456+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'adventures-in-tokyo',
	// 		page_title: 'Adventures in Tokyo',
	// 		meta_description: 'Experience the vibrant culture and modern marvels of Tokyo.',
	// 		website: 'calatoreala.ro',
	// 		category: 'city-break',
	// 		subcategory: 'japan',
	// 		post_title: 'Tokyo: A City of Contrasts',
	// 		created_at: new Date('2024-08-15 09:45:12.654321+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'sydney-sunshine',
	// 		page_title: 'Sydney Sunshine',
	// 		meta_description:
	// 			"A traveler's guide to enjoying the sunny beaches and iconic landmarks of Sydney.",
	// 		website: 'calatoreala.ro',
	// 		category: 'beach-vacation',
	// 		subcategory: 'australia',
	// 		post_title: 'Sydney: Sun, Sea, and Sights',
	// 		created_at: new Date('2024-09-05 12:30:45.789012+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'new-york-nights',
	// 		page_title: 'New York Nights',
	// 		meta_description: 'Exploring the nightlife and vibrant culture of New York City.',
	// 		website: 'calatoreala.ro',
	// 		category: 'city-break',
	// 		subcategory: 'usa',
	// 		post_title: 'The City That Never Sleeps',
	// 		created_at: new Date('2024-09-20 18:20:30.345678+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'rome-romance',
	// 		page_title: 'Rome Romance',
	// 		meta_description: 'A romantic getaway in the historic city of Rome.',
	// 		website: 'calatoreala.ro',
	// 		category: 'romantic-escape',
	// 		subcategory: 'italy',
	// 		post_title: 'Rome: Love and History',
	// 		created_at: new Date('2024-10-10 14:50:25.987654+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'london-landmarks',
	// 		page_title: 'London Landmarks',
	// 		meta_description: "A tour of London's most famous landmarks and attractions.",
	// 		website: 'calatoreala.ro',
	// 		category: 'city-break',
	// 		subcategory: 'uk',
	// 		post_title: 'London: A Journey Through Time',
	// 		created_at: new Date('2024-10-25 11:40:55.123987+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'barcelona-beauty',
	// 		page_title: 'Barcelona Beauty',
	// 		meta_description: 'Discover the architectural wonders and vibrant culture of Barcelona.',
	// 		website: 'calatoreala.ro',
	// 		category: 'city-break',
	// 		subcategory: 'spain',
	// 		post_title: 'Barcelona: Art and Soul',
	// 		created_at: new Date('2024-11-05 16:25:40.456321+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'cape-town-adventure',
	// 		page_title: 'Cape Town Adventure',
	// 		meta_description:
	// 			'An adventure-filled guide to the natural beauty and attractions of Cape Town.',
	// 		website: 'calatoreala.ro',
	// 		category: 'adventure',
	// 		subcategory: 'south-africa',
	// 		post_title: 'Cape Town: Nature and Thrills',
	// 		created_at: new Date('2024-11-20 08:15:20.789654+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'bali-bliss',
	// 		page_title: 'Bali Bliss',
	// 		meta_description: 'A serene escape to the tropical paradise of Bali.',
	// 		website: 'calatoreala.ro',
	// 		category: 'beach-vacation',
	// 		subcategory: 'indonesia',
	// 		post_title: 'Bali: Tranquility and Beauty',
	// 		created_at: new Date('2024-12-01 13:10:35.987321+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	},
	// 	{
	// 		slug: 'vienna-vibes',
	// 		page_title: 'Vienna Vibes',
	// 		meta_description: 'Exploring the rich cultural heritage and modern attractions of Vienna.',
	// 		website: 'calatoreala.ro',
	// 		category: 'city-break',
	// 		subcategory: 'austria',
	// 		post_title: 'Vienna: Elegance and Charm',
	// 		created_at: new Date('2024-12-15 17:05:50.654987+00'),
	// 		published_at: null,
	// 		modified_at: null
	// 	}
	// ];
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

<PageNavigation selected="/posts" />

<section class="my-4 flex flex-col rounded">
	<div class="flex items-center justify-between px-4 py-4">
		<div class="flex items-baseline justify-start gap-2">
			<h2 class="text-lg font-medium">Posts</h2>
		</div>
		<Button size="sm" href={`/app/websites/${website.repo}/posts/add`}>Add Post</Button>
	</div>

	<div
		class="flex w-full gap-2 rounded-t border-b px-4 py-2 text-xs font-medium text-muted-foreground"
	>
		<p class="w-[30%]">Title</p>
		<p class="flex-1">Category</p>
		<p class="flex-1">Published at</p>
		<p class="flex-1">Modified at</p>
		<p class="flex-1"></p>
	</div>
	{#each posts as post}
		<a
			href={`/app/websites/${website.repo}/posts/${post.slug}`}
			class="flex w-full items-center justify-between gap-2 border-b px-4 py-2 text-sm hover:bg-muted"
		>
			<h3 class="w-[30%] truncate font-medium" title={post.page_title}>{post.page_title}</h3>
			<p class="flex-1 capitalize text-muted-foreground">
				<span class="font-medium">{post.category}</span> / {post.subcategory}
			</p>
			<div class="flex-1">
				{#if post.published_at}
					<p>{post.published_at}</p>
				{:else}
					<p>Not Published</p>
				{/if}
			</div>
			<div class="flex-1">
				{#if post.modified_at}
					<p>{post.modified_at}</p>
				{:else}
					<p>Not Modified</p>
				{/if}
			</div>

			<div class="flex-1 text-right">
				<Button size="sm" variant="ghost">Edit</Button>
			</div>
		</a>
	{/each}
	<Button class="mt-4" size="sm" variant="outline" href="">Load More</Button>
</section>
