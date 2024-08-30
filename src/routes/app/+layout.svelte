<script lang="ts">
	// import Sun from 'lucide-svelte/icons/sun';
	// import Moon from 'lucide-svelte/icons/moon';
	import Sidebar from './components/Sidebar.svelte';
	// import { toggleMode } from 'mode-watcher';
	// import { Button } from '$lib/components/ui/button/index.js';
	// import { goto } from '$app/navigation';
	// import { redirect } from '@sveltejs/kit';
	// import Logout from "$lib/components/Logout.svelte";
	export let data

</script>

<main class="md:block h-full">
	<div class="h-full">
		<div class="bg-background h-full">
			<div class="h-full">
				
				<!-- <Sidebar class="hidden lg:block h-full fixed left-0 top-0 w-56 overflow-y-auto border-r" data={data}/> -->

				<div class="overflow-y-auto h-full max-w-5xl mx-auto">
					<div class="h-full">
						<slot />
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
