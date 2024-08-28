<script lang="ts">
	import PageNav from '$lib/components/PageNav.svelte';

    const pageNavItems = [
    {
        label: "Designs",
        path: "/app/shirts/",
    },
	{
        label: "Trending",
        path: "/app/shirts/trending",
    },
    {
        label: "Upload Queue",
        path: "/app/shirts/upload"
    },
	{
        label: "Accounts",
        path: "/app/shirts/accounts"
    }
	]
    
</script>

<PageNav items={pageNavItems} selected="/app/shirts/accounts"/>