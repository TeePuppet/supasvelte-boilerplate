// import { selectedKeywordStore } from '$lib/utils/shirts/stores';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { keyword } = params;

	try {
		const schema = supabase.schema('shirts');

		const { data, error } = await schema
			.from('keywords')
			.select('*')
			.eq('keyword', keyword)
			.single();

		if (error) {
			console.error('Error fetching keyword:', error);
			return { keyword: null };
		}
		return { keyword: data };
	} catch (e) {
		console.error('Unexpected error:', e);
		// selectedKeywordStore.set(null);
		return { keyword: null };
	}
};