import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase }, params }) => {
	depends('supabase:db:categories');
	const website = params.website
	const { data: categories } = await supabase.from('categories').select('*').eq('website', website);

	return { categories: categories ?? [] };
};