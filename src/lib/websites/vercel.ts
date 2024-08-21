import type { SupabaseClient } from '@supabase/supabase-js';
import { getRepo } from './github';

export const deployWebsite = async (supabse: SupabaseClient, repo: string) => {
	const project = await createVercelProject(repo);
	await updateWebsiteData(supabse, repo, {
		id: project.id,
		name: project.name,
		domain: `${project.name}.vercel.app`
	});
	const repoInfo = await getRepo('TeePuppet', repo);
	const deploy = await deployToVercel(repo, repoInfo.id);
	return true;
};

// export const setVercelDomain = async (domainName:string, projectID:string) => {
//     try {
//         const url = `https://api.vercel.com/v10/projects/${projectID}/domains`;
//         const headers = {
//             "Authorization": `Bearer ${import.meta.env.VITE_PUBLIC_VERCEL_KEY}`
//         }
//         const body = {
//             name: domainName,
//             // gitBranch: "SOME_STRING_VALUE",
//             // redirect: "foobar.com",
//             // redirectStatusCode: 307
//         }
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: headers,
//             body: JSON.stringify(body)
//         });
//         return await response.json()
//     } catch (err) {
//         console.error(err)
//     }
// }

const createVercelProject = async (repo: string) => {
	try {
		const url = 'https://api.vercel.com/v10/projects';
		const headers = {
			Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_VERCEL_KEY}`,
			'Content-Type': 'application/json'
		};
		const body = {
			name: repo,
			framework: 'astro',
			gitRepository: {
				repo: repo,
				type: 'github'
			}
			// environmentVariables: [
			//     {
			//       key: "VITE_PUBLIC_SUPABASE_URL",
			//       target: ["production"],
			//       type: "system",
			//       value: import.meta.env.VITE_PUBLIC_SUPABASE_URL
			//     },
			//     {
			//         key: "VITE_PUBLIC_SUPABASE_ANON_KEY",
			//         target: ["production"],
			//         type: "system",
			//         value: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
			//       },
			//   ]
		};
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body)
		});
		return await response.json();
	} catch (err) {
		console.error(err);
	}
};

const deployToVercel = async (repo: string, repoId: string) => {
	try {
		const url = 'https://api.vercel.com/v13/deployments?forceNew=0&skipAutoDetectionConfirmation=0';
		const headers = {
			Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_VERCEL_KEY}`,
			'Content-Type': 'application/json'
		};
		const body = {
			name: repo,
			gitSource: {
				ref: 'master',
				repoId: repoId,
				type: 'github'
			},
			project: repo
		};
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body)
		});
		const resp = await response.json();
		return resp;
	} catch (err) {
		console.error(err);
	}
};

export const getProjectData = async (repo: string) => {
	const req = await fetch(`https://api.vercel.com/v9/projects/${repo}`, {
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_VERCEL_KEY}`
		},
		method: 'get'
	});
	return await req.json();
};

export const getDeployments = async (projectId:string) => {
	const params = new URLSearchParams({
		app: 'docs',
		// from: '1612948664566',
		limit: '10',
		projectId: projectId,
		// rollbackCandidate: 'true',
		// since: '1540095775941',
		// slug: "SOME_STRING_VALUE",
		// state: "BUILDING,READY",
		// target: "production",
		// teamId: "SOME_STRING_VALUE",
		// to: "1612948664566",
		// until: "1540095775951",
		// users: "kr1PsOIzqEL5Xg6M4VZcZosf,K4amb7K9dAt5R2vBJWF32bmY"
	}).toString();
	try {
		const url = `https://api.vercel.com/v6/deployments?${params}`;
		const req = await fetch(url, {
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_VERCEL_KEY}`
			},
			method: 'get'
		});
		return await req.json();
	} catch (err) {
		console.error('Unexpected error:', err);
	}
};

// export const deleteVercelProject =async (vercelProjectId:string) => {
//     try {
//         console.log('Delete Vercel', vercelProjectId)
//         const deleteProject = await fetch (`https://api.vercel.com/v9/projects/${vercelProjectId}`, {
//             method: 'DELETE',
//             headers: {
//                 "Authorization": `Bearer ${import.meta.env.VITE_PUBLIC_VERCEL_KEY}`
//             }
//         })

//         return true
//     } catch (err) {
//         return false
//     }
// }

const updateWebsiteData = async (supabase: SupabaseClient, websiteId: string, dataToAdd: any) => {
	try {
		const { data, error } = await supabase
			.from('websites')
			.update({ vercel: dataToAdd })
			.eq('repo', websiteId); // This line updates the row where the 'name' column matches 'Existing Website'

		if (error) {
			console.error('Error updating website in database:', error);
		} else {
			console.log('Website updated in database:', data);
		}
	} catch (err) {
		console.error('Unexpected error:', err);
	}
};
