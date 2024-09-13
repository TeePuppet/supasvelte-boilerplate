import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase }, url }) => {
    depends('supabase:db:keywords');

    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = 20; // You can adjust this value
    const offset = (page - 1) * pageSize;

    const sortField = url.searchParams.get('sort') || 'updated_at';
    const sortOrder = url.searchParams.get('order') || 'desc';

    try {
        const schema = supabase.schema('shirts');

        let query = schema
            .from('keywords')
            .select('*', { count: 'exact' })
            .filter('search_volume', 'gt', 0)
            .filter('number_of_items', 'lt', 1800);

        // Apply dynamic sorting
        if (['number_of_items', 'search_volume', 'updated_at'].includes(sortField)) {
            query = query.order(sortField, { ascending: sortOrder === 'asc' });
        } else {
            // Default sorting if an invalid sort field is provided
            query = query.order('updated_at', { ascending: false });
        }

        const { data: keywords, error, count } = await query
            .range(offset, offset + pageSize - 1);

        if (error) {
            console.error('Error fetching keywords:', error);
            return { keywords: [], totalPages: 0, currentPage: page };
        }

        const totalPages = Math.ceil((count || 0) / pageSize);

        return {
            keywords: keywords ?? [],
            totalPages,
            currentPage: page
        };
    } catch (e) {
        console.error('Unexpected error:', e);
        return { keywords: [], totalPages: 0, currentPage: page };
    }
};