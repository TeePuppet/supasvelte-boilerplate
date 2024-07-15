import { goto } from '$app/navigation';
import { supabase } from '$lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export async function initializeAuth(setUser: (user: User | null) => void) {
  const { data: { session } } = await supabase.auth.getSession();
  setUser(session?.user ?? null);

  return supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      setUser(null);
      goto('/login');
    } else if (event === 'SIGNED_IN') {
      setUser(session.user);
      goto('/');
    }
  });
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function handleLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  } else {
    goto('/');
    return { success: true, data };
  }
}