<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';

	import PageNavigation from '../../components/PageNavigation.svelte';
	import PageTitle from '../../components/PageTitle.svelte';
	export let data;

	$: ({ website, supabase, user } = data);
	console.log(data)

	// const { website, projectData } = data.props;
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

<!-- <PageNavigation selected="/" /> -->

<Card.Root class="mt-6">
	<!-- <Card.Header>
        <Card.Title>Not a Priority</Card.Title>
    </Card.Header> -->
	<Card.Content class="pt-6 text-center">
		<p class="flex flex-col items-center justify-center gap-2 text-muted-foreground">
			<span
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-timer-off"
					><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path
						d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2"
					/><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg
				></span
			>
			<span class="font-medium">To be completed later</span>
		</p>
	</Card.Content>
</Card.Root>
