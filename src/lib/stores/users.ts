// src/lib/stores/userStore.ts
import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';

function createUserStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  return {
    subscribe,
    set,
    update,
    updateUserData: (newData: Partial<User>) => update(user => user ? { ...user, ...newData } : null)
  };
}

export const userStore = createUserStore();