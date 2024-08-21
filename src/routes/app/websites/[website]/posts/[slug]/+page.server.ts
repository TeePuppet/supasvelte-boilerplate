import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase }, params }) => {
	depends('supabase:db:posts');
	const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single();

	return { post: post };
};