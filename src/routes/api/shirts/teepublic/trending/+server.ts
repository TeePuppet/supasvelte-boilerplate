// src/routes/api/popular-tags/+server.js
import * as cheerio from 'cheerio';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET() {
	try {
		const tags = await getPopularTags();
		const items = await Promise.all(
			tags.map(async (tag: { result: string; score: number }) => {
				const tagData = await getTagData(tag.result);
				return {
					keyword: tag.result,
					searchScore: tag.score,
					numberOfItems: tagData.numberOfItems,
					searchVolume: tagData.searchVolume,
                    relatedTag: tagData.relatedTags,
                    alsoSearched: tagData.alsoSearched,
					items: tagData.items
				};
			})
		);

		const filteredItems = items;
		// const filteredItems = items.filter(item =>
		//     item.searchVolume > 0 && item.numberOfItems < 1800
		// );
		return json(filteredItems);
	} catch (error) {
		console.error('Error fetching popular tags:', error);
		return json({ error: 'Failed to fetch popular tags' }, { status: 500 });
	}
}

async function getPopularTags() {
	const response = await fetch('https://www.teepublic.com/', {
		headers: {
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
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
	const $ = cheerio.load(html);
	const tagList = $('#jsAutoCompleteHeader').attr('data-trendingsearchresults');

	if (!tagList) {
		throw new Error('Failed to find trending search results');
	}

	return JSON.parse(tagList);
}

async function getTagData(tag: string) {
	const encodedTag = encodeURIComponent(tag.trim());
	const response = await fetch(`https://www.teepublic.com/t-shirts?query=${encodedTag}`, {
		headers: {
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
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
	const $ = cheerio.load(html);

	// Extract related tags
	const relatedTags = $('.m-sidebar__section')
		.last()
		.find('.c-menu__item a')
		.map((index, element) => $(element).text().trim())
		.get();

	const alsoSearched = $('.m-search__related .link-collection__content')
		.text()
		.split('\n')
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0);

	// Extract items
	const items = $('.jsTilesDesigns .jsDesignContainer');

	const mappedItems = items
		.map((index, element) => {
			const $element = $(element);
			const $image = $element.find('.tp-design-tile__image');
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
			// const relatedTags = $element.find('.m-search__related .link-collection__content a')
			return {
				title: deslugify($element.attr('data-gtm-design-title') || ''),
				imageSrc: $element.attr('data-image-url') || '',
				mainTag: deslugify($element.attr('data-gtm-primary-tag') || ''),
                secondaryTags: secondaryTags || []
			};
		})
		.get();

	return {
		numberOfItems:
			items.length * parseInt($('nav.pagination span.page').last().text().trim() || '1'),
		searchVolume: await getKeywordData(`${tag} shirt`),
		mainTag: tag,
		relatedTags: relatedTags || [],
        alsoSearched: alsoSearched || [],
		items: mappedItems
	};
}

interface KeywordPayload {
	dataSource: string;
	country: string;
	currency: string;
	kw: string[];
}

interface KeywordResponse {
	data: {
		[keyword: string]: {
			vol: number;
			cpc: number;
			comp: number;
			// Add other properties as needed based on the API response
		};
	};
	// Add other top-level properties if present in the API response
}

async function getKeywordData(keyword: string): Promise<Number> {
	const apiUrl = 'https://api.keywordseverywhere.com/v1/get_keyword_data';

	const payload: KeywordPayload = {
		dataSource: 'gkp',
		country: 'us',
		currency: 'USD',
		kw: [keyword]
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
				Authorization: `Bearer 64e2ec1f8c3b48462150`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: params
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: KeywordResponse = await response.json();
		return data.data[0].vol;
	} catch (error) {
		console.error('Error fetching keyword data:', error);
		throw error;
	}
}

function deslugify(slug: string): string {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
