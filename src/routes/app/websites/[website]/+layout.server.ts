import { error } from '@sveltejs/kit';
import { getDeployments, getProjectData } from '$lib/websites/vercel';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ depends, locals: { supabase }, params }) => {
	depends('supabase:db:websites');
	const websiteName = params.website; // Access the parameter using params.website
	try {
		const { data: websites } = await supabase
			.from('websites')
			.select('*')
			.eq('repo', websiteName)
			.single();
		
		// const projectData = await getProjectData(websiteName);
		return { website: websites ?? [] };
	} catch (err: unknown) {
		throw error(500, (err as Error).message);
	}
};