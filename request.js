/**
 * 1) -----------------------------------------------------------------------------------------------------------
 *      Use got-scraping to crawl in sequence the following urls.
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
 * 2) -----------------------------------------------------------------------------------------------------------
 *      Like the first exercise but the urls must be crawled in parallel
 * --------------------------------------------------------------------------------------------------------------
 */
import { got } from 'got-scraping';
import * as cheerio from 'cheerio';
import { parsePriceNumFirst } from './utils/parsePrice.js';

const urls = [
    'https://www.miinto.it/p-de-ver-s-abito-slip-3059591a-7c04-405c-8015-0936fc8ff9dd',
    'https://www.miinto.it/p-abito-a-spalline-d-jeny-fdac3d17-f571-4b55-8780-97dddf80ef35',
    'https://www.miinto.it/p-abito-bianco-con-stampa-grafica-e-scollo-a-v-profondo-2b03a3d9-fab1-492f-8efa-9151d3322ae7'
];

async function crawlUrls(url) {
    try {
        const response = await got(url)
        if (response.statusCode !== 200) {
            throw new Error(`Error: Status code ${response.statusCode} for URL ${url}`);
        }
        const $ = cheerio.load(response.body)

        const discountedPriceText  = $('p[data-testid="product-previous-price"]').text().trim();
        const fullPriceText = $('p[data-testid="product-price"]').text().trim();
        
        
        const fullPrice = fullPriceText
            ? parsePriceNumFirst(fullPriceText) : null;
        const discountedPrice  = discountedPriceText ? parsePriceNumFirst(discountedPriceText) : fullPrice;
        const currency = fullPrice ? fullPriceText.split(' ').pop() : 'N/A';
        const title = $('h1[data-testid="product-name"]').text().trim();

        const result = {
            url,
            fullPrice,
            discountedPrice,
            currency,
            title,
        }
        console.log(result)
       
    } catch (error){
        console.error(`Error scraping ${url}:`, error.message);
    }
}

async function crawlInSequence(urls) {
    console.log('This logs from crawl In Sequence')
    for (const url of urls) {
        await crawlUrls(url);
    }
}
await crawlInSequence(urls);

async function crawlInParallel(urls) {
    console.log('This logs from crawl In Parallel')
    await Promise.all(urls.map(url => crawlUrls(url)));
}

await crawlInParallel(urls);