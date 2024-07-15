<!-- src/routes/login/+page.svelte -->
<script>
    import { supabase } from '$lib/supabase/client';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '$lib/components/ui/card';
  
    let email = '';
    let password = '';
    let error = null;
  
    async function handleLogin() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('Error:', error.message);
        return;
      }
  
      goto('/app');
    }
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Card class="w-full max-w-md">
      <CardContent class="pt-6">
        <form on:submit|preventDefault={handleLogin} class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input type="email" id="email" bind:value={email} required />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input type="password" id="password" bind:value={password} required />
          </div>
          <Button type="submit" class="w-full">Log in</Button>
        </form>
      </CardContent>
      {#if error}
        <CardFooter>
          <p class="text-red-500">{error}</p>
        </CardFooter>
      {/if}
    </Card>
  </div>