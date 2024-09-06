<script lang="ts">
		import Button from '$lib/components/ui/button/button.svelte';
		import { userStore } from '$lib/stores/users';
</script>

<div class="flex flex-col gap-4 px-4 py-4">
	{#if $userStore}
		<p>Welcome, {$userStore.email}!</p>
	{/if}
	<div class="grid grid-cols-3 gap-4">
	<Button class="col-span-2" variant="outline" href="/app/websites">Websites</Button>
	<Button class="col-span-1" href="/app/shirts"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg></Button>
</div>
</div>
