<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	
	// import { ScrollArea } from '$lib/components/ui/scroll-area';
	// import { logout } from '$lib/supabase/auth';
	import { cn } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	// import Logout from '$lib/components/Logout.svelte';

	let className: string | null | undefined = undefined;
	export { className as class };

	// $: handleLogout = async () => {
	// 					const result = await logout();
	// 					if (result?.errors) {
	// 						console.error(result.errors.message);
	// 					}
	// 				};

	export let data;
	$: ({ supabase } = data);

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		goto('/')
	};
	
</script>

<div class={cn('pb-0 h-full', className)}>
	<div class="space-y-4 py-4 flex flex-col justify-between h-full">
		<div>

		
		<div class="px-3 py-2">
			<h2 class="mb-2 px-4 text-lg font-semibold tracking-normal">Library</h2>
			<div class="space-y-1">
				<Button variant="secondary" class="w-full justify-start" href="/app/websites/">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2 h-4 w-4"
					>
						<rect width="7" height="7" x="3" y="3" rx="1" />
						<rect width="7" height="7" x="14" y="3" rx="1" />
						<rect width="7" height="7" x="14" y="14" rx="1" />
						<rect width="7" height="7" x="3" y="14" rx="1" />
					</svg>
					Websites
				</Button>
				<Button variant="ghost" class="w-full justify-start" disabled>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2 h-4 w-4"
						><path
							d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
						/><rect x="2" y="6" width="14" height="12" rx="2" /></svg
					>
					Videos
				</Button>
				<Button variant="ghost" class="w-full justify-start" href="/app/shirts">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2 h-4 w-4"
						><path
							d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
						/></svg
					>
					T-Shirts
				</Button>
			</div>
		</div>
		<div class="px-3 py-2">
			<h2 class="mb-2 px-4 text-lg font-semibold tracking-normal">Tools</h2>
			<div class="space-y-1">
				<Button variant="ghost" class="w-full justify-start" disabled>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2 h-4 w-4"
					>
						<path d="M21 15V6" />
						<path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
						<path d="M12 12H3" />
						<path d="M16 6H3" />
						<path d="M12 18H3" />
					</svg>
					AI Chat
				</Button>
				<Button variant="ghost" class="w-full justify-start" disabled>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2 h-4 w-4"
					>
						<circle cx="8" cy="18" r="4" />
						<path d="M12 18V2l7 4" />
					</svg>
					Article Helper
				</Button>
				<Button variant="ghost" class="w-full justify-start" disabled>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2 h-4 w-4"
					>
						<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
					Shirt Ideas
				</Button>
                
			</div>
		</div>
	</div>
		<div class="px-3 py-2 flex flex-col gap-2">
			<Button on:click={toggleMode} variant="ghost" class="w-full justify-start">
				<Sun class="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon
					class="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>

				<span class="">Theme</span>
			</Button>
			<Button size="sm" class="w-full" on:click={logout}>Logout</Button>
		</div>
        
	</div>
</div>
