<script>
	import { Button } from "$lib/components/ui/button";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import * as Select from "$lib/components/ui/select";

	import PageTitle from "../../../../components/PageTitle.svelte";
    export let data;

    $: ({ website } = data);

    $: newPost = {
        slug: '',
        page_title: '',
        meta_description: '',
        website: website.repo,
        // created_at: '', // completed automatically
        category: '',
        subcategory: '',
        published_at: '',
        modified_at: ','
    }

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

<h2 class="text-lg font-medium">Add new post</h2>
<div class="grid grid-cols-7 gap-8">
    <section id="post" class="col-span-5 border px-6 py-6 rounded">
        <div>
            <Label>Post title</Label>
            <Input placeholder="Page title"/>
        </div>
        <div>
            <Label>Description</Label>
            <Textarea placeholder="Meta description"/>
        </div>
    
        <div>
            <Label>Content</Label>
            <Textarea placeholder="Article"/>
        </div>
    </section>
    <section class="col-span-2 border px-6 py-6 rounded">
        <div>
            <Label>Page title</Label>
            <Input placeholder="Page title"/>
        </div>
        <div>
            <Label>Slug</Label>
            <Input placeholder="Slug"/>
        </div>
        <div>
            <Label>Meta Description</Label>
            <Textarea placeholder="Meta description"/>
        </div>
        <div>
            <Label>Website</Label>
            <Textarea placeholder="Meta description"/>
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




