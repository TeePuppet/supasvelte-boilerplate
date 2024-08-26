import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// @ts-ignore
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Initialize Supabase client
// @ts-ignore
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
// @ts-ignore
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
let supabase = createClient(supabaseUrl, supabaseKey);
supabase = supabase.schema('shirts');

// Define interfaces
interface TagData {
  numberOfItems: number;
  mainTag: string;
  relatedTags: string[];
  alsoSearched: string[];
  items: Array<{
    title: string;
    imageSrc: string;
    mainTag: string;
    secondaryTags: string[];
  }>;
}

// Main function to serve HTTP requests
// @ts-ignore
Deno.serve(async (req) => {
  try {
    console.log('Received request:', req.method, req.url);
    console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers)));

    let keyword: string | undefined;

    // Try to parse JSON body
    try {
      const body = await req.json();
      console.log('Parsed JSON body:', JSON.stringify(body));
      keyword = body.keyword;
    } catch (jsonError) {
      console.log('Failed to parse JSON body:', jsonError);
      // If JSON parsing fails, try to parse as form data
      const formData = await req.formData();
      keyword = formData.get('keyword')?.toString();
      console.log('Parsed form data:', keyword);
    }

    console.log('Extracted keyword:', keyword);

    // Validate the incoming keyword
    if (!keyword || typeof keyword !== 'string') {
      console.log('Invalid keyword:', keyword);
      return new Response(JSON.stringify({ error: 'Invalid or missing keyword' }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const tagData = await getTagData(keyword);

    // Prepare the data to return and insert into the database
    const responseData = {
      keyword,
      numberOfItems: tagData.numberOfItems,
      searchVolume: await getKeywordData(keyword),
      relatedTags: tagData.relatedTags,
      alsoSearched: tagData.alsoSearched,
      shirts: tagData.items,
    };

    // Insert data into the database
    const { data, error } = await supabase
      .from('keywords')
      .insert({
        keyword: keyword,
        search_volume: responseData.searchVolume,
        number_of_items: tagData.numberOfItems,
        related_tag: tagData.relatedTags,
        also_searched: tagData.alsoSearched,
        teepublic_shirts: tagData.items,
        status: 'processed',
        type: 'trending'
      })
      .select();

    if (error) {
      console.error('Error inserting data into database:', error);
      throw new Error('Failed to insert data into database');
    }

    console.log('Data inserted into database:', data);

    console.log('Processed data for keyword:', keyword);

    // Return success response
    return new Response(JSON.stringify({ 
      message: 'Keyword processed successfully and data inserted into database', 
      data: responseData 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    // Log and return error response
    console.error('Detailed error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return new Response(JSON.stringify({ error: 'Failed to process keyword', details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

// Function to fetch detailed tag data from TeePublic
async function getTagData(tag: string): Promise<TagData> {
  console.log('Fetching tag data for:', tag);
  const encodedTag = encodeURIComponent(tag.trim());
  const response = await fetch(`https://www.teepublic.com/t-shirts?query=${encodedTag}`, {
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
    console.error('HTTP error when fetching tag data:', response.status);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  const $ = load(html);

  // Extract related tags
  const relatedTags = $('.m-sidebar__section')
    .last()
    .find('.c-menu__item a')
    .map((_, element) => $(element).text().trim())
    .get();

  // Extract "also searched" tags
  const alsoSearched = $('.m-search__related .link-collection__content')
    .text()
    .split('\n')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Extract shirt items
  const items = $('.jsTilesDesigns .jsDesignContainer');

  const mappedItems = items
    .map((_, element) => {
      const $element = $(element);
      const secondaryTags = $element.find('.tp-design-tile__seo-secondary-tags')
        .contents()
        .filter(function() {
          return this.nodeType === 3; // Text nodes only
        })
        .text()
        .trim()
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      return {
        title: deslugify($element.attr('data-gtm-design-title') || ''),
        imageSrc: $element.attr('data-image-url') || '',
        mainTag: deslugify($element.attr('data-gtm-primary-tag') || ''),
        secondaryTags: secondaryTags || []
      };
    })
    .get();

  // Calculate total number of items
  const numberOfItems = items.length * parseInt($('nav.pagination span.page').last().text().trim() || '1');

  return {
    numberOfItems,
    mainTag: tag,
    relatedTags: relatedTags || [],
    alsoSearched: alsoSearched || [],
    items: mappedItems
  };
}

// Helper function to convert slug to readable text
function deslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface KeywordPayload {
  dataSource: string;
  country: string;
  currency: string;
  kw: string[];
}

async function getKeywordData(keyword: string): Promise<number> {
  const apiUrl = 'https://api.keywordseverywhere.com/v1/get_keyword_data';
  // @ts-ignore
  const apiKey = Deno.env.get("KEYWORDS_EVERYWHERE");

  if (!apiKey) {
    console.error('KEYWORDS_EVERYWHERE API key is not set');
    return 0;
  }

  const payload: KeywordPayload = {
    dataSource: 'gkp',
    country: 'us',
    currency: 'USD',
    kw: [`${keyword} shirt`]
  };

  const params = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(`${key}[]`, item));
    } else {
      params.append(key, value);
    }
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      const keywordData = data.data[0];
      if (typeof keywordData.vol === 'number') {
        return keywordData.vol;
      }
    }
    
    console.error('Unexpected data structure from Keywords Everywhere API:', JSON.stringify(data));
    return 0;
  } catch (error) {
    console.error('Error fetching keyword data:', error);
    return 0;
  }
}