



export const createSiteFromTemplate = async (repo: string) => {
	//* Define data
	//* ****************
	const template = 'astro-site-template';
	const owner = 'TeePuppet';
	const url = `https://api.github.com/repos/${owner}/${template}/generate`;
	const headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_GIT_KEY}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};
	const body = {
		owner: 'TeePuppet',
		name: repo,
		description: `Repo for ${repo} from ${template} template`,
		include_all_branches: false,
		private: true
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body)
		});

		return await response.json();
	} catch (err) {
		console.error('Error in createSiteFromTemplate', err);
	}
};

export const updateConfigFile = async (websiteName: string, repo: string) => {
	const configURL = `https://api.github.com/repos/TeePuppet/${repo}/contents/site.config.json`;
	const headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_GIT_KEY}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};

	const configFile = await getConfigFile(repo);
	console.log(configFile);

	try {
		const currentContent = JSON.parse(atob(configFile.content));

		console.log(currentContent);
		// Update the values
		currentContent.repo = repo;
		currentContent.name = websiteName;

		const updatedContent = { ...currentContent, ...{ name: websiteName, repo: repo } };

		const body = {
			message: `${repo} website init`,
			content: btoa(JSON.stringify(updatedContent, null, 2)),
			sha: configFile.sha
		};

		const updateResponse = await fetch(configURL, {
			method: 'PUT',
			headers: headers,
			body: JSON.stringify(body)
		});

		return await updateResponse.json();
	} catch (err) {
		console.error('Error in updateConfigFile', err);
	}
};

export const deleteRepo = async (repo: string) => {
	try {
		const headers = {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_GIT_KEY}`,
			'X-GitHub-Api-Version': '2022-11-28'
		};
		const response = await fetch(repo, {
			method: 'DELETE',
			headers: headers
		});

		return response;
	} catch (err) {
		console.error(err);
	}
};

const getConfigFile = async (repo: string) => {
	let attempts = 0;
	let status = false;
	let fileData: any;

	const configURL = `https://api.github.com/repos/TeePuppet/${repo}/contents/site.config.json`;
	console.log('config url', configURL);
	const headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_GIT_KEY}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};

	while (attempts < 3 && !status) {
		const getFile = await fetch(configURL, { method: 'GET', headers });
		fileData = await getFile.json();
		console.log('file resp', fileData);
		status = fileData.status !== '404';
		console.log('Check Status is', status);
		if (!status) {
			console.log('File not found, waiting 2 seconds...');
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
		attempts++;
	}
	if (status) {
		console.log('File found!');
		return fileData;
	} else {
		console.log('File not found after 3 attempts. Delete repo');
		return false;
	}
};


export const updateConfig = async (repo:string, websiteName:string) => {
	const configURL = `https://api.github.com/repos/TeePuppet/${repo}/contents/site.config.json`;
	const headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_GIT_KEY}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};
    
	const configFile = await getFile(repo, 'site.config.json');
    const currentContent = JSON.parse(atob(configFile.content));

    // Update the values
    currentContent.repo = repo;
    currentContent.name = websiteName;

    const updatedContent = { ...currentContent, ...{ name: websiteName, repo: repo } };

    const updateResponse = await fetch(configURL, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
            message: `${repo} website init`,
            content: btoa(JSON.stringify(updatedContent, null, 2)),
            sha: configFile.sha
        })
    });

    return await updateResponse.json();

};

const getFile = async (repo: string, filePath:string) => {
	let attempts = 0;
	let status = false;
	let fileData: any;
    console.log(filePath)
	const configURL = `https://api.github.com/repos/TeePuppet/${repo}/contents/${filePath}`;
    console.log(configURL)
	const headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_GIT_KEY}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};

	while (attempts < 3 && !status) {
		const file = await fetch(configURL, { method: 'GET', headers });
		fileData = await file.json();
		status = fileData.status !== '404';
		if (!status) {
			console.log('File not found, waiting 2 seconds...');
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
		attempts++;
	}
	if (status) {
        console.log('File found')
		return fileData;
	} else {
        console.log(`File not found after ${attempts} attempts`)
		return false;
	}
};


export const getRepo = async (owner: string, repo: string) => {
    const configURL = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_GIT_KEY}`,
        'X-GitHub-Api-Version': '2022-11-28'
    };

    const response = await fetch(configURL, { method: 'GET', headers });
    const resp = await response.json()

    console.log(resp)
    return resp
};
