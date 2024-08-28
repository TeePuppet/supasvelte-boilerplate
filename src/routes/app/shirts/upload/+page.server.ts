import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:upload');

    try {
        const schema = supabase.schema('shirts');

        const { data: upload, error } = await schema
            .from('upload_queue')
            .select('*')

        if (error) {
            console.error('Error fetching websites:', error);
            return { upload: [] };
        }
        
        return { upload: upload ?? [] };
    } catch (e) {
        console.error('Unexpected error:', e);
        return { upload: [] };
    }
};