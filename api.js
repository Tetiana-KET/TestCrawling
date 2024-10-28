/**
 * 1) -----------------------------------------------------------------------------------------------------------
 *      Analyze browser Network Tab to find apis of the following urls.
 *      Tips: extract the productId from the url string.
 *      Use gotScraping to make a request to those apis.
 *
 *      Parse the json and extract:
 *          - fullPrice (it has to be a number)
 *          - discountedPrice (it has to be a number, if it does not exist same as fullPrice)
 *          - currency (written in 3 letters [GBP, USD, EUR...])
 *          - title (product title)
 *
 *      Result example
 *      {
 *          url: ${urlCrawled},
 *          apiUrl: ${apiUrl},
 *          fullPrice: 2000.12,
 *          discountedPrice: 1452.02,
 *          currency: 'GBP',
 *          title: 'Aqualung Computer subacqueo i330R'
 *      }
 * --------------------------------------------------------------------------------------------------------------
 * This task took me about 2 hours, just because it was my first experience, and i had no idea, what should I do.
 * I took more time, not to write code, it wasn't hard, but to find out from what URL should i fetch info
 */
import { gotScraping } from 'got-scraping';
import { extractProductId } from './utils/extractProductUrl.js';

const urls = [
	'https://www.stoneisland.com/en-it/collection/polos-and-t-shirts/slim-fit-short-sleeve-polo-shirt-2sc17-stretch-organic-cotton-pique-81152SC17A0029.html',
	'https://www.stoneisland.com/en-it/collection/polos-and-t-shirts/short-sleeve-polo-shirt-22r39-50-2-organic-cotton-pique-811522R39V0097.html',
];

async function scrapeApi(url) {
	const productId = extractProductId(url);
	const apiUrl = `https://www.stoneisland.com/on/demandware.store/Sites-StoneEU-Site/en_IT/ProductApi-Product?pid=${productId}&cachekill=2024-10-28T15%3A00%3A40.520Z`;
	const urlCrawled = url;

	try {
		const response = await gotScraping(apiUrl, { responseType: 'json' });
		const data = response.body;

		const prices = Object.values(data.price).map(obj => parseFloat(obj.value));
		const fullPrice = Math.max(...prices);
		const discountedPrice = Math.min(...prices);
		const currency = Object.values(data.price)[0]?.currency || 'N/A';
		const title = data.productName;

		return {
			url: `${urlCrawled}`,
			apiUrl,
			fullPrice,
			discountedPrice,
			currency,
			title,
		};
	} catch (error) {
		console.error(`Error fetching data for productId ${productId}:`, error);
		return null;
	}
}

async function scrapeAllProducts() {
	for (const url of urls) {
		const productData = await scrapeApi(url);
		if (productData) {
			console.log(productData);
		}
	}
}

scrapeAllProducts();
