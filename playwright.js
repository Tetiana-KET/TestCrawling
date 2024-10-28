/**
 * 1) -----------------------------------------------------------------------------------------------------------
 *      Use playwright navigate to the following urls.
 *      Check response status code (200, 404, 403), proceed only in case of code 200, throw an error in other cases.
 *      Use playwright methods select the country associated with the url.
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
 *          currency: 'GBP',
 *          title: 'Aqualung Computer subacqueo i330R'
 *      }
 * --------------------------------------------------------------------------------------------------------------
 */
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';

const urls = [
	{
		url: 'https://www.selfridges.com/US/en/product/fear-of-god-essentials-camouflage-panels-relaxed-fit-woven-blend-overshirt_R04364969/#colour=WOODLAND%20CAMO',
		country: 'GB',
	},
	{
		url: 'https://www.selfridges.com/ES/en/product/gucci-interlocking-g-print-crewneck-cotton-jersey-t-shirt_R04247338/',
		country: 'US',
	},
	{
		url: 'https://www.selfridges.com/US/en/product/fear-of-god-essentials-essentials-cotton-jersey-t-shirt_R04318378/#colour=BLACK',
		country: 'IT',
	},
];
async function scrapeWithPlaywright(urlObj) {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	try {
		const { url, country } = urlObj;
		const response = await page.goto(url);
		if (response.status !== 200) {
			throw new Error(
				`Failed to load page. Status code: ${response?.status()}`
			);
		}
		const content = await page.content();
		const $ = cheerio.load(content);
		console.log(response);
		console.log($);

		/**I have issues with Playwright on my machine, I've tried to uninstall and install it in different ways
		 * I guess I can find solution, eventually, but I'll need more time to find out what the problem with it
		 */
		/**
		 * PS C:\Users\Котя\Desktop\TestCrawling> node playwright.js
node:internal/process/promises:394
    triggerUncaughtException(err, true fromPromise );
    ^

browserType.launch: Executable doesn't exist at C:\Users\Котя\AppData\Local\ms-playwright\chromium-1140\chrome-win\chrome.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install  // I did it, no effect                                            ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
    at scrapeWithPlaywright (C:\Users\Котя\Desktop\TestCrawling\playwright.js:41:33)
    at C:\Users\Котя\Desktop\TestCrawling\playwright.js:60:1 {
  name: 'Error'
}

Node.js v22.9.0
PS C:\Users\Котя\Desktop\TestCrawling> 

		 */
	} catch {}
}
scrapeWithPlaywright(urls[0]);
