import { createSiteFromTemplate } from "./github";

export const createWebsite = async () => {
    const git = await createSiteFromTemplate(repo);
    const config = await updateConfig(repo, website);
    const { data, error } = await supabase
            .from('websites')
            .insert({ name: websiteName, repo: repo });
        if (error) {
            console.error('Error adding website to database:', error);
        } else {
            console.log('Website added to database:', data);
        }
    await createBucket(repo);
    await deployWebsite(repo);
    goto(`/app/websites/${repo}`);
}