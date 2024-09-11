import { designMetadata, generatedDesigns } from '$lib/utils/shirts/stores';

export async function generateDesign(
    keyword: string,
    related_tags: string[],
    style: string | undefined = undefined
) {
    try {

        console.log('keys', keyword, related_tags)
        const response = await fetch('https://n8n.silviu.co.uk/webhook/shirt-from-keyword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword,
                related_tags,
                ...(style !== undefined && { style })
            })
        });

        if (!response.ok) {
            generatedDesigns.set([]);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const designs = await response.json();
        generatedDesigns.set(JSON.parse(designs.images));
        designMetadata.set({
            title: designs.title,
            keyword: designs.keyword,
            description: designs.desc,
            tags: designs.tags
        })
    } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
    }
}