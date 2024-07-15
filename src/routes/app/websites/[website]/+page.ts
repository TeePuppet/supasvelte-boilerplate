// import { error } from '@sveltejs/kit';
// import { supabase } from '$lib/supabase/client';
// import { getProjectData } from '$lib/websites/vercel';

// export const load = async ({ params }) => {
// 	const { website } = params;
//     console.log('website', website)
// 	try {
// 		const { data, error: fetchError } = await supabase
// 			.from('websites')
// 			.select('*')
// 			.eq('repo', website)
// 			.single();

// 		if (fetchError) {
// 			throw error(404, `Website ${website} not found`);
// 		}

// 		const projectData = await getProjectData(website);
// 		// console.log('Project Data:', projectData);

// 		return { props: { website: data, projectData } };
// 	} catch (err: unknown) {
// 		throw error(500, (err as Error).message);
// 	}
// };