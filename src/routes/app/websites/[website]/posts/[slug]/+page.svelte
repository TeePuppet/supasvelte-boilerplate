<script>
// @ts-nocheck

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import PageTitle from '../../../../components/PageTitle.svelte';
	import * as Select from '$lib/components/ui/select';

	// @ts-ignore
	export let data;
	$: ({ website, post } = data);
	// @ts-ignore
	$: editPost = post && {
		slug: post.slug || '',
		page_title: post.page_title || '',
		meta_description: post.meta_description || '',
		website: post.website || '',
		created_at: post.created_at || '',
		category: post.category || '',
		subcategory: post.subcategory || '',
		published_at: post.published_at || '',
		modified_at: post.modified_at || ''
	};
	$: console.log('Edit Post', post);
</script>

<PageTitle title={website.name}>
	<div>
		<Button size="sm" variant="ghost" href={`/app/websites/${website.repo}/settings`}
			>Settings</Button
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

<div class="flex justify-between items-center">
    <h2 class="text-lg font-medium">{editPost.page_title}</h2>
    <div>
        <Button>Save</Button>
        <Button>Publish</Button>
    </div>
</div>

<div class="grid grid-cols-7 gap-8">
	<section id="post" class="col-span-5 rounded border px-6 py-6">
		<div>
			<Label>Post title</Label>
			<Input placeholder="Page title" />
		</div>
		<div>
			<Label>Description</Label>
			<Textarea placeholder="Meta description" />
		</div>

		<div>
			<Label>Content</Label>
			<Textarea placeholder="Article" />
		</div>
	</section>
	<section class="col-span-2 rounded border px-6 py-6">
		<div>
			<Label>Page title</Label>
			<Input placeholder="Page title" bind:value={editPost.page_title} />
		</div>
		<div>
			<Label>Slug</Label>
			<Input placeholder="Slug" bind:value={editPost.slug} />
		</div>
		<div>
			<Label>Meta Description</Label>
			<Textarea placeholder="Meta description" bind:value={editPost.meta_description} />
		</div>
		<div>
			<Label>Website</Label>
			<Textarea placeholder="Meta description" bind:value={editPost.website} />
		</div>
		<div>
			<Label>Subcategory</Label>
			<Select.Root>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Theme" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="light">Light</Select.Item>
					<Select.Item value="dark">Dark</Select.Item>
					<Select.Item value="system">System</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</section>
</div>
