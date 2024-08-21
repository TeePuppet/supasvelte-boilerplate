<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Spinner from '$lib/components/Spinner.svelte';
	import { enhance } from '$app/forms';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	function handleSubmit(event: Event) {
		loading = true;
		error = '';
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card class="w-[350px]">
		<CardContent class="pt-6">
			<form use:enhance on:submit={handleSubmit} method="POST" action="?/login">
				<div class="grid w-full items-center gap-4">
					<div class="flex flex-col space-y-1.5">
						<Label for="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							bind:value={email}
							placeholder="Your email"
							required
						/>
					</div>
					<div class="flex flex-col space-y-1.5">
						<Label for="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							bind:value={password}
							placeholder="Your password"
							required
						/>
					</div>
				</div>
					<Button class="w-full mt-1.5" type="submit" disabled={loading}>
						{#if loading}
							<Spinner />
						{:else}
							Login
						{/if}
					</Button>
			
			</form>
		</CardContent>
	</Card>

	{#if error}
		<p class="mt-2 text-red-500">{error}</p>
	{/if}
</div>