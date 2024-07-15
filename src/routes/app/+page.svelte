<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Separator } from '$lib/components/ui/separator';
</script>

<Separator class="my-4" />

<Tabs.Root value="all-posts" class="w-[400px]">
	<Tabs.List>
		<Tabs.Trigger value="all-posts">In Review</Tabs.Trigger>
        <Tabs.Trigger value="post-queue">Scheduled</Tabs.Trigger>
        <Tabs.Trigger value="posts">All Posts</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="all-posts">Make changes to your account here.</Tabs.Content>
	<Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>
