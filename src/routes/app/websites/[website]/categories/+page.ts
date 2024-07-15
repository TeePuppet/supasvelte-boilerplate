import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client';
import { getProjectData } from '$lib/websites/vercel';

export const load = async ({ params }) => {
	const { website } = params;

	try {
		const { data, error: fetchError } = await supabase
			.from('categories')
			.select('*')

		if (fetchError) {
			throw error(404, `Website ${website} not found`);
		}
		const projectData = await getProjectData(website);
        // console.log(projectData)
		// console.log('Project Data:', projectData);
		// console.log(projectData)
		return { props: { website: website, projectData, categories:data } };
	} catch (err: unknown) {
		throw error(500, (err as Error).message);
	}
};