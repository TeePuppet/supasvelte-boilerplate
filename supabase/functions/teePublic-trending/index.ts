import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// @ts-ignore
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";

interface PopularTag {
  result: string;
  score: number;
}



// @ts-ignore
Deno.serve(async (req) => {
  try {
    const tags = await getPopularTags();
    
    const tagsData = await Promise.all(tags.map(async (tag: PopularTag) => ({
      keyword: tag.result,
      searchScore: tag.score,
      created_at: new Date().toISOString(),
      numberOfItems: null,
      searchVolume: null,
      relatedTag: null,
      alsoSearched: null,
      shirts: null,
      status: 'draft',
      updated_at: new Date().toISOString(),
    })));

    return new Response(JSON.stringify({ message: 'Tags data retrieved', count: tagsData.length, data: tagsData }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error retrieving tags data:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve tags data', details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

async function getPopularTags(): Promise<PopularTag[]> {
  const response = await fetch('https://www.teepublic.com/', {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'max-age=0',
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'sec-gpc': '1',
      'upgrade-insecure-requests': '1'
    },
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  const $ = load(html);
  const tagList = $('#jsAutoCompleteHeader').attr('data-trendingsearchresults');

  if (!tagList) {
    throw new Error('Failed to find trending search results');
  }

  return JSON.parse(tagList);
}

