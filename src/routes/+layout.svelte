<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { userStore } from '$lib/stores/users';
	import type { SupabaseClient, User, Session } from '@supabase/supabase-js';
  
	export let data: { supabase: SupabaseClient, session: Session | null };
  
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
  
	let userChannel: ReturnType<SupabaseClient['channel']> | null = null;
  
	function subscribeToUserData(userId: string) {
	  userChannel = supabase
		.channel(`public:users:id=eq.${userId}`)
		.on('postgres_changes', { 
		  event: 'UPDATE', 
		  schema: 'public', 
		  table: 'users', 
		  filter: `id=eq.${userId}` 
		}, (payload) => {
		  userStore.updateUserData(payload.new as Partial<User>);
		})
		.subscribe();
	}
  
	onMount(() => {
	  // Set initial user data
	  if (session?.user) {
		userStore.set(session.user);
		subscribeToUserData(session.user.id);
	  }
  
	  // Set up auth state change listener
	  const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
		if (newSession?.expires_at !== session?.expires_at) {
		  invalidate('supabase:auth')
		}
		if (event === 'SIGNED_IN' && newSession?.user) {
		  userStore.set(newSession.user);
		  subscribeToUserData(newSession.user.id);
		} else if (event === 'SIGNED_OUT') {
		  userStore.set(null);
		  if (userChannel) {
			userChannel.unsubscribe();
			userChannel = null;
		  }
		}
	  });
  
	  return () => {
		authListener.subscription.unsubscribe();
		if (userChannel) {
		  userChannel.unsubscribe();
		}
	  }
	});
  </script>
  
  <ModeWatcher />
  <slot />