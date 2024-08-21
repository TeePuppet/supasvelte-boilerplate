<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import PageTitle from "../../components/PageTitle.svelte";

    // export let data;
	// $: ({ website, supabase, user } = data);

	// $: console.log('website', website)
	// $: projectData = data.projectData;
	// // console.log(projectData)
    // $:  status = projectData.latestDeployments[0].readyState

</script>

<slot/>