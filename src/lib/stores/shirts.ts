// src/lib/stores/shirtsStore.ts
import { writable } from 'svelte/store';

export interface Shirt {
    id: number;
    created_at: string; // TypeScript uses string for dates when interfacing with JSON
    design_text: string | null;
    prompt: string | null;
    main_tag: string | null;
    tags: string[] | null;
    title: string | null;
    desc: string | null;
    artwork: string | null;
    status: 'DRAFT' | 'UPLOADED' | string; // We know 'DRAFT' is a possible value, add others as needed
    account: string | null;
    background_color: string | null;
}
function createShirtsStore() {
    const { subscribe, set, update } = writable<Shirt[]>([]);

    return {
        subscribe,
        set,
        update,
        updateShirt: (updatedShirt: Partial<Shirt> & { id: number }) => update(shirts => 
            shirts.map(shirt => shirt.id === updatedShirt.id ? { ...shirt, ...updatedShirt } : shirt)
        ),
        addShirt: (newShirt: Shirt) => update(shirts => [...shirts, newShirt]),
        removeShirt: (id: number) => update(shirts => shirts.filter(shirt => shirt.id !== id)),
    };
}

export const shirtsStore = createShirtsStore();