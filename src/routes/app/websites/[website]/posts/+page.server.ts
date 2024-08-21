import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase }, params }) => {
	depends('supabase:db:posts');
	const website = params.website
	const { data: posts } = await supabase.from('posts').select('*').eq('website', website);

	return { posts: posts ?? [] };
};