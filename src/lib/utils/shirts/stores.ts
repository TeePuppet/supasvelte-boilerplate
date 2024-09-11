import { writable } from 'svelte/store';

export type generatedDesign = {
	content_type: string;
	height: number;
	url: string;
	width: number;
	processed: string | undefined;
    mask: string | undefined;
};

export const selectedKeywordStore = writable<any>(null);
export const generatedDesigns = writable<generatedDesign[]>([]);
// export const processedImageStore = writable<string | null>(null);
export const selectedDesign = writable<any>(null);
export const designMetadata = writable<any>(null);
