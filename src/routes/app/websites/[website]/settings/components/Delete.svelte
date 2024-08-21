<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
    import * as Card from '$lib/components/ui/card';

	export let website;

	$: deleteConfirmation = {
		first: '',
		second: ''
	};

    const deleteWebsite = async (repo:string) => {

        // Delete vercel using vercel project id
        // Delete storage
        // Delete subcategories
        // Delete posts
        // Delete settings
        // Delete website
    
        // Delete github

    console.log(repo,'website deleted')
}

</script>


<Card.Root id="delete" class="w-full  border-destructive">
    <Card.Header class="pb-2">
        <Card.Title>Delete Website
        </Card.Title>
    </Card.Header>
    <Card.Content class="space-card">
        
        
<div class="space-input">
	<Label class="text-destructive">Type the full repo name to delete the website</Label>
	<Input
		class="border-destructive focus-visible:outline-destructive"
		placeholder={`Type the repo name "${website.repo}"`}
		bind:value={deleteConfirmation.first}
	/>
	<p class="text-sm text-muted-foreground"></p>

	<Dialog.Root>
		<Dialog.Trigger disabled={deleteConfirmation.first !== website.repo}>
			<Button variant="destructive" disabled={deleteConfirmation.first !== website.repo}
				>Delete Website</Button
			></Dialog.Trigger
		>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="mb-3">Are you absolutely sure?</Dialog.Title>
				<Dialog.Description class="space-y-3">
					<p>
						This action cannot be undone. This will permanently delete the website and remove the
						data from our servers.
					</p>

					<Input
						class="border-destructive focus-visible:outline-destructive"
						placeholder="Type the repo name again"
						bind:value={deleteConfirmation.second}
					/>
					<Button
						on:click={() => deleteWebsite(website.repo)}
						variant="destructive"
						disabled={deleteConfirmation.second !== website.repo}>Delete Website</Button
					>
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
</div>

        
    </Card.Content>
</Card.Root>

