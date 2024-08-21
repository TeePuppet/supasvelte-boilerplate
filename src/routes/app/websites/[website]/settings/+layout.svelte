<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const items = [
		{
			title: 'General',
			href: '#general'
		},
		{
			title: 'Branding',
			href: '#branding'
		},
		{
			title: 'Colors',
			href: '#colors'
		},
        {
			title: 'Social Media',
			href: '#social-media'
		},
		{
			title: 'Delete',
			href: '#delete'
		},
	];

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});

	console.log($page.url.pathname)
</script>

<Separator/>
<div class="hidden space-y-6 pt-6 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">
			Manage your account settings and set e-mail preferences.
		</p>
	</div>
	<!-- <Separator class="my-6" /> -->
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="-mx-4 lg:w-1/5">
			<nav class={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1')}>
                {#each items as item}
                    {@const isActive = $page.url.pathname === item.href}
            
                    <Button
                        href={item.href}
                        variant="ghost"
                        class={cn(!isActive && 'hover:underline', 'relative justify-start')}
                        data-sveltekit-noscroll
                    >
                        {#if isActive}
                            <div
                                class="absolute inset-0 rounded-md bg-muted"
                                in:send={{ key: 'active-sidebar-tab' }}
                                out:receive={{ key: 'active-sidebar-tab' }}
                            />
                        {/if}
                        <div class="relative">
                            {item.title}
                        </div>
                    </Button>
                {/each}
            </nav>
		</aside>
		<div class="flex-1">
			<slot />
		</div>
	</div>
</div>
