import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:keywords');

    try {
        const schema = supabase.schema('shirts');

        const { data: keywords, error } = await schema
            .from('keywords')
            .select('*')
            .filter('search_volume', 'gt', 0)
            .filter('number_of_items', 'lt', 1800)

        if (error) {
            console.error('Error fetching websites:', error);
            return { keywords: [] };
        }
        return { keywords: keywords ?? [] };
    } catch (e) {
        console.error('Unexpected error:', e);
        return { keywords: [] };
    }
};