<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
    export let data;

    const { website, projectData } = data.props;

    const status = projectData.latestDeployments[0].readyState;

</script>
<div class={`mb-4 flex items-center justify-between`}>
	<div class="flex items-center gap-2 space-y-1">
		<Button variant="ghost" size="icon" on:click={() => window.history.back()}
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
				class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg
			></Button
		>
		<h2 class="font-semibold">{website.name}</h2>
		<Badge
			class={`${
				status === 'READY'
					? 'bg-green-500'
					: status === 'QUEUED'
						? 'bg-orange-500'
						: status === 'FAIL'
							? 'bg-red-500'
							: ''
			}`}
			href={`https://vercel.com/teepuppets-projects/${projectData.name}/${projectData.latestDeployments[0].id}`}
			target="_blank">{status}</Badge
		>
	</div>
	<div>
        <Button
        size="sm"
        variant="ghost"
        href={`/app/websites/${website.repo}/settings`}
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
        {#if status === 'READY'}
        <Button size="sm" href={`https://${website.vercel.domain}`} target="_blank">View page</Button>
    {:else}
        <Button size="sm" disabled>View page</Button>
    {/if}
	</div>
</div>

<slot/>