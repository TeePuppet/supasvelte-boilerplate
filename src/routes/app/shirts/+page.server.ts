import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:websites');

    try {
        const schema = supabase.schema('shirts');
        console.log('schema', schema);

        const { data: websites, error } = await schema.from('trending').select('*');

        if (error) {
            console.error('Error fetching websites:', error);
            return { websites: [] };
        }

        console.log('Fetched websites:', websites);
        return { websites: websites ?? [] };
    } catch (e) {
        console.error('Unexpected error:', e);
        return { websites: [] };
    }
};