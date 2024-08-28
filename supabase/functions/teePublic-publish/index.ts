// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

// @ts-ignore
import { load } from 'https://esm.sh/cheerio@1.0.0-rc.12';

// @ts-ignore
Deno.serve(async (req) => {
	try {
		// {
		//   design_id: $('HTML').item.json.design_id,
		//   auth_token: $('HTML').item.json.authenticity_token,
		//   design_title: $('Setup Data').item.json.design_title,
		//   design_desc: $('Setup Data').item.json.design_desc,
		//   main_tag: $('Setup Data').item.json.main_tag,
		//   tags: $('Setup Data').item.json.tags,
		//   artwork: {
		//     url: `${$('Upload to Cloudinary').item.json["url"].replace('http://res.cloudinary.com/teepublic/', '')}# ${$('Upload to Cloudinary').item.json['signature']}`,
		//     data: $('Upload to Cloudinary').item.json,
		// }

		const { cookie, design_id, auth_token, design_title, design_desc, main_tag, tags, artwork } =
			await req.json();

		if (!cookie) throw new Error("'cookie' is required");
		if (!design_id) throw new Error("'design_id' is required");
		if (!auth_token) throw new Error("'auth_token' is required");
		if (!artwork) throw new Error("'artwork_url' is required");
		if (!design_title) throw new Error("'design_title' is required");
		if (!design_desc) throw new Error("'design_desc' is required");
		if (!main_tag) throw new Error("'main_tag' is required");
		if (!tags) throw new Error("'main_tag' is required");

		const design = {
			id: design_id,
			auth_token: auth_token,
			title: design_title,
			description: design_desc,
			main_tag: main_tag,
			secondary_tags: tags
		};

		const artwork_data = {
			url: artwork.url,
			dpi: artwork.data.image_metadata.dpi,
			width: artwork.data.width,
			height: artwork.data.height
		};

		const formData = await createFormData(design, artwork_data);
    // console.log('Form Data', formData)

    const publishDesign = await publish(cookie, design.id, formData)
    // console.log('publish', publishDesign);

		return new Response(
			JSON.stringify({ 
        message: 'Design Uploaded',
        url: `https://www.teepublic.com/t-shirt/${design_id}`,
        artwork_data,
      }),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Error processing request:', error.message);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/teePublic-publish' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

type Design = {
	id: string;
	auth_token: string;
	title: string;
	description: string;
	main_tag: string;
	secondary_tags: string[];
};

type Artwork = {
	url: string;
	dpi: string;
	width: Number;
	height: Number;
};

async function createFormData(design: Design, artwork: Artwork): Promise<string> {
  const lightColors = [
    12, 31, 13, 17, 8, 22, 72, 21, 28, 23, 3, 5, 60, 14, 9, 10, 69, 20, 6, 54, 4, 38, 42, 71, 44,
    70, 65, 45, 55, 49, 52, 53, 50, 51, 108, 8, 3, 14, 49, 52, 53, 51
  ];

  const darkColors = [
    31, 11, 1, 13, 24, 17, 8, 2, 21, 67, 18, 5, 75, 7, 14, 9, 107, 10, 69, 27, 38, 57, 46, 19, 42,
    47, 71, 44, 70, 43, 59, 65, 45, 40, 48, 11, 1, 8, 18, 7, 14
  ];

  const allColors = [...new Set([...lightColors, ...darkColors])];

  const payload = {
    utf8: '✓',
    _method: 'patch',
    authenticity_token: design.auth_token,
    design_id: design.id,
    jsMinImageWidth: '1500',
    jsMinImageHeight: '1995',
    jsIsSaved: 'false',
    artwork_version: '0',
    file: '',
    design: {
      preview_file_info_attributes: {
        dpi: '306',
        width: artwork.width.toString(),
        height: artwork.height.toString()
      },
      design_title: design.title,
      design_description: design.description,
      primary_tag: design.main_tag,
      secondary_tags: design.secondary_tags,
      content_flag: 'false',
      mockup_config_print_attributes: {
        bg_color: '#000000',
        image_size: '88',
        position_top: '6.000000000000003',
        position_left: '6.857898215465963',
        scale_to_fill: 'false',
        orientation_id: '77',
        aspect_ratio_id: '71'
      },
      mockup_config_case_attributes: {
        position_top: '30.921932830219063',
        position_left: '12.500000000000005',
        rotation: '0',
        bg_color: '#000000',
        image_size: '75'
      },
      mockup_config_apparel_attributes: {
        position_top: '0',
        position_left: '0',
        image_size: '100'
      },
      mockup_config_apparel_back_attributes: {
        position_top: '0',
        position_left: '0',
        image_size: '100'
      },
      mockup_config_apparel_front_attributes: {
        position_top: '0',
        position_left: '0',
        image_size: '100'
      },
      mockup_config_coffee_mug_attributes: {
        position_top: '6.000000000000001',
        position_left: '5.922085643020118',
        bg_color: '#000000',
        image_size: '88'
      },
      mockup_config_travel_mug_attributes: {
        position_top: '6.000000000000004',
        position_left: '14.62982096341511',
        bg_color: '#000000',
        image_size: '88'
      },
      mockup_config_sticker_attributes: {
        bg_color: '#000000',
        config_style: 'auto_br'
      },
      mockup_config_pillow_attributes: {
        position_top: '12.5',
        position_left: '13.231163251817579',
        bg_color: '#000000',
        image_size: '75'
      },
      mockup_config_tote_attributes: {
        position_top: '7.999999999999993',
        position_left: '8.818902842035689',
        bg_color: '#000000',
        image_size: '84'
      },
      mockup_config_tapestry_attributes: {
        position_top: '6.000000000000002',
        position_left: '13.353450618980073',
        bg_color: '#000000',
        image_size: '88',
        orientation_id: '78'
      },
      mockup_config_small_tapestry_attributes: {
        position_top: '5.9999999999999964',
        position_left: '18.40852958569589',
        bg_color: '#000000',
        image_size: '88',
        orientation_id: '78'
      },
      mockup_config_pin_attributes: {
        position_top: '10',
        position_left: '10.779907468605412',
        bg_color: '#000000',
        image_size: '80'
      },
      mockup_config_magnet_attributes: {
        bg_color: '#000000',
        config_style: 'auto_bg'
      },
      mockup_config_hat_attributes: {
        position_top: '0',
        position_left: '23.85327164573695',
        image_size: '100'
      },
      artwork: artwork.url
    },
    autoposition: 'false',
    is_saved: 'false',
    backprint_back_image_version: '',
    backprint_front_image_version: '',
    'canvas-option[1]': 'true',
    'primary_colors[1]': '1',
    apparel_side: 'front',
    'canvas-option[4]': 'true',
    'primary_colors[4]': '1',
    'canvas-option[2]': 'true',
    'primary_colors[2]': '1',
    'canvas-option[5]': 'true',
    'primary_colors[5]': '1',
    'canvas-option[7]': 'true',
    'primary_colors[7]': '1',
    'canvas-option[8]': 'true',
    'primary_colors[8]': '48',
    'canvas-option[3]': 'false',
    'primary_colors[3]': '1',
    'canvas-option[14]': 'false',
    'primary_colors[14]': '1',
    'canvas-option[15]': 'false',
    'primary_colors[15]': '1',
    additional_colors: allColors,
    orientation: '77',
    ratio: '71',
    tapestry_orientation_radio: '78',
    magnet: {
      pin_bg_color: '#000000'
    },
    uploader_magnet_pin_image_size: '80',
    magnet_print_orientation: '77',
    magnet_print_aspect_ratio: '71',
    'primary_colors[55]': '1',
    'canvas-option[55]': 'true',
    'canvas-option[16]': 'true',
    'canvas-option[9]': 'true',
    'canvas-option[12]': 'true',
    'canvas-option[6]': 'true',
    'canvas-option[17]': 'true',
    'canvas-option[18]': 'true',
    'canvas-option[19]': 'true',
    'canvas-option[20]': 'true',
    'canvas-option[21]': 'true',
    terms: 'read',
    commit: 'publish'
  };

  // Function to flatten and encode the payload
  function flattenAndEncode(obj: Record<string, any>, prefix = ''): string {
    return Object.keys(obj).reduce((str: string[], p: string) => {
      const k = prefix ? `${prefix}[${p}]` : p;
      if (Array.isArray(obj[p])) {
        obj[p].forEach((v: any) => {
          str.push(`${encodeURIComponent(k)}[]=${encodeURIComponent(v)}`);
        });
      } else if (typeof obj[p] === 'object' && obj[p] !== null) {
        str.push(flattenAndEncode(obj[p], k));
      } else {
        str.push(`${encodeURIComponent(k)}=${encodeURIComponent(obj[p])}`);
      }
      return str;
    }, []).join('&');
  }

  // Convert the payload to a URL-encoded string
  return flattenAndEncode(payload);
}


async function publish(cookie, design_id, payload) {


  const url = `https://www.teepublic.com/designs/${design_id}/edit`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'max-age=0',
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': cookie,
      'origin': 'https://www.teepublic.com',
      'referer': `https://www.teepublic.com/designs/${design_id}/edit`,
      'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    },
    body: payload,
    redirect: 'manual' // This is important to handle the 302 redirect
  });


  if (response.status === 302) {
    console.log('Redirect location:', response.headers.get('location'));
    return { status: 'success', redirectUrl: response.headers.get('location') };
  }

  const contentType = response.headers.get("content-type");


  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const text = await response.text();
    console.log('Response text:', text.substring(0, 500)); // Log first 500 characters
    return { status: 'error', text: text };
  }
}