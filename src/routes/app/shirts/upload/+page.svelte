<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import PageNav from '$lib/components/PageNav.svelte';
    import PageTitle from '../../components/PageTitle.svelte';
    import Spinner from '$lib/components/Spinner.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

    interface Data {
        supabase: any;
        user: any;
        upload: any;
    }

    export let data: Data;

    $: ({ supabase, user } = data);
    const uploads = data.upload;

    const pageNavItems = [
        { label: "Designs", path: "/app/shirts/" },
        { label: "Trending", path: "/app/shirts/trending" },
        { label: "Upload", path: "/app/shirts/upload" },
        { label: "Accounts", path: "/app/shirts/accounts" }
    ];

    interface Design {
        id?: string;
        name?: string;
        // Add other properties as needed
    }

    let isCreatingDesign = false;
    let design: Design | null = null;
    let keyword = "";

    const createDesign = async (): Promise<Design> => {
        isCreatingDesign = true;
        try {
            // Simulating an async operation
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newDesign: Design = { id: '1', name: keyword }; // Using the keyword as the design name
            return newDesign;
        } catch (error) {
            console.error('Error creating design:', error);
            throw error;
        } finally {
            isCreatingDesign = false;
        }
    };

    const handleCreateDesign = async () => {
        if (!keyword.trim()) {
            alert("Please enter a keyword before creating a design.");
            return;
        }
        try {
            design = await createDesign();
        } catch (error) {
            console.error('Error handling design creation:', error);
            alert("Failed to create design. Please try again.");
        }
    };
</script>

<PageNav items={pageNavItems} selected="/app/shirts/upload"/>

<div class="flex flex-col border rounded p-4 gap-3">

    {#if design}   

    <h3 class="text-sm font-medium">Main Keyword</h3>
        <Input bind:value={keyword} placeholder="Keyword"/>
        
        <Button on:click={handleCreateDesign} disabled={isCreatingDesign}>
            {#if isCreatingDesign}
                <Spinner />
                <span class="ml-2">Creating...</span>
            {:else}
                Create Design
            {/if}
        </Button>
    {:else}
        <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium">Creating design for </h3>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="hover:underline hover:cursor-pointer" on:click={() => { design = null; keyword = ""; }}>Reset</div>
        </div>
        <div>
            <Input bind:value={keyword} placeholder="Listing title"/>
            <Input bind:value={keyword} placeholder="Main Tag"/>
            <Textarea placeholder="tags"/>
            <Textarea placeholder="description"/>
        </div>

        
        <!-- <p>Design ID: {design.id}</p> -->
        <!-- <p>Design Name: {design.name}</p> -->
        
    {/if}
</div>

<div class="border rounded">
</div>