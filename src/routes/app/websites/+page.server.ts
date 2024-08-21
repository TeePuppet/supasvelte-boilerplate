import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:websites');
	const { data: websites } = await supabase.from('websites').select('*')
	return { websites: websites ?? [] };
};