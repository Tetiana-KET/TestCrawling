/**
 * 1) -----------------------------------------------------------------------------------------------------------
 *      Use puppeteer navigate to the following urls.
 *      Check response status code (200, 404, 403), proceed only in case of code 200, throw an error in other cases.
 *
 *      Using cheerio extract from html:
 *          - fullPrice (it has to be a number)
 *          - discountedPrice (it has to be a number, if it does not exist same as fullPrice)
 *          - currency (written in 3 letters [GBP, USD, EUR...])
 *          - title (product title)
 *
 *      Result example
 *      {
 *          url: ${urlCrawled},
 *          fullPrice: 2000.12,
 *          discountedPrice: 1452.02,
 *          currency: 'EUR',
 *          title: 'Abito Bianco con Stampa Grafica e Scollo a V Profondo'
 *      }
 * --------------------------------------------------------------------------------------------------------------
 *
 * 2) -----------------------------------------------------------------------------------------------------------
 *      Extract product options (from the select form) and log them
 *      Select/click on the second option (if the second one doesn't exist, select/click the first)
 *
 *      Log options example:
 *      [
 *          {
 *              value: 'Blu - L/XL',
 *              optionValue: '266,1033', // Attribute "value" of option element
 *          }
 *      ]
 * --------------------------------------------------------------------------------------------------------------
 */
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { parsePrice } from './utils/parsePrice.js';

const urls = [
	'https://www.outdoorsrlshop.it/catalogo/1883-trekker-rip.html',
	'https://www.outdoorsrlshop.it/catalogo/2928-arco-man-t-shirt.html',
];

async function scrapeWithPuppeteer(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	try {
		const response = await page.goto(url);
		if (response.status() !== 200) {
			throw new Error(`Failed to load page. Status code: ${response.status()}`);
		}

		const content = await page.content();
		const $ = cheerio.load(content);
		extractProductDetails($, url);

		const productOptions = extractProductOptions($);
		console.log('All available options', productOptions);

		const selectedOption =
			productOptions.length > 1 ? productOptions[1] : productOptions[0];

		console.log(`Selected option: `, selectedOption);
		if (selectedOption) {
			await page.select('select.scegliVarianti', selectedOption.optionValue);
		}
	} catch (error) {
		console.error(`Error scraping ${url}: ${error.message}`);
	}

	await browser.close();
}

function extractProductDetails($, url) {
	const title = $('h1').text().trim();
	const price = $('.prodotto .prezzo span').text().trim();

	const priceNum = parsePrice(price);
	const currency = price.split(' ')[0];

	const fullPriceText = $('upyPrezzoScontato').text().trim();
	const fullPrice = fullPriceText ? parsePrice(fullPriceText) : priceNum;
	const discountedPriceText = $('.upyPrezzoFinale').text().trim();
	const discountedPrice = discountedPriceText
		? parsePrice(discountedPriceText)
		: priceNum;

	const result = {
		url,
		fullPrice,
		discountedPrice,
		currency,
		title,
	};

	console.log(result);
}

function extractProductOptions($) {
	const options = [];
	$('select.scegliVarianti option').each((_, option) => {
		const value = $(option).text().trim();
		const optionValue = $(option).attr('value');
		if (optionValue && optionValue !== '0') {
			options.push({ value, optionValue });
		}
	});
	return options;
}

async function scrapeAllProducts(urls) {
	for (const url of urls) {
		await scrapeWithPuppeteer(url);
	}
}

scrapeAllProducts(urls);
