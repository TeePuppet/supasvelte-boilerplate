<script lang="ts">
	import PageNav from '$lib/components/PageNav.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Button from '$lib/components/ui/button/button.svelte';
    import Label from '$lib/components/ui/label/label.svelte'
    import Input from '$lib/components/ui/input/input.svelte'
        import Text from '$lib/components/ui/textarea/textarea.svelte'
	const pageNavItems = [
		{
			label: 'Designs',
			path: '/app/shirts/'
		},
		{
			label: 'Trending',
			path: '/app/shirts/trending'
		},
		{
			label: 'Upload',
			path: '/app/shirts/upload'
		},
		{
			label: 'Accounts',
			path: '/app/shirts/accounts'
		}
	];

	const accounts = [
		{
			email: 'testing@gmail.com',
			platform: 'TeePublic',
			status: 'Active',
			cookie: '',
			limitReached: false
		}
	];
</script>

<PageNav items={pageNavItems} selected="/app/shirts/accounts" />

<div class="grid grid-cols-1 gap-3 mt-6">
<Drawer.Root>
	<Drawer.Trigger class="block">
        <div class="border rounded-lg h-full flex items-center justify-center font-medium bg-muted text-muted-foreground py-4">
            Add Account
        </div>

	</Drawer.Trigger>

	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 bg-black/40" />
		<Drawer.Content
			class="fixed  bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px]"
		>
			<div
				class=" mx-auto flex w-full max-w-md flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
			>

            <Label>Account Name</Label>
            <Input placeholder="Account Name"/>

            <Label>Email Address</Label>
            <Input placeholder="Email"/>

            <Label>Cookie</Label>
            <Text placeholder="Cookie"/>
            
            <Label>Platform</Label>
            <Input placeholder="Platform"/>

            <Label>Status</Label>
            <Input placeholder="Status" disabled value="Active"/>
        
            <Drawer.Footer class="px-0 flex flex-grow flex-row justify-between items-center">
                    <Button variant="secondary">Cancel</Button>
                    <Button class="w-full">Add</Button>
			</Drawer.Footer>
        </div>

		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

{#each accounts as account}
	<Drawer.Root>
		<Drawer.Trigger class="block text-left">
			<div class="flex flex-col md:flex-row md:justify-between md:items-center rounded-lg border p-4">
				<h2 class="font-bold">{account.email} <span>{account.status}</span></h2>
				<p class="text-muted-foreground">{account.platform}</p>
			</div>
		</Drawer.Trigger>

		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/40" />
			<Drawer.Content
				class="fixed  bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px]"
			>
				<div
					class=" mx-auto flex w-full max-w-md flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
				></div>
				<Drawer.Footer>
					<div
						class="mx-auto flex w-full max-w-full flex-col gap-4 overflow-auto rounded-t-[10px] p-4"
					>
						<div class="flex">
							<Button>Upload</Button>
							<Button>Delete</Button>

							<Button variant="secondary">Cancel</Button>
						</div>
					</div>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{/each}
</div>