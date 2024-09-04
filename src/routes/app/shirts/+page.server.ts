import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:shirts');

    try {
        const schema = supabase.schema('shirts');

        const { data: shirts, error } = await schema
        .from('shirts')
        .select('*')
        .eq('status', 'DRAFT')

        if (error) {
            console.error('Error fetching websites:', error);
            return { shirts: [] };
        }
        
        return { shirts: shirts ?? [] };
    } catch (e) {
        console.error('Unexpected error:', e);
        return { shirts: [] };
    }
};


