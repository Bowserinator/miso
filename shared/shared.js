/** Shared functions for all files**/

const https = require('https')
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const MersenneTwister = require('mersenne-twister');
const generator = new MersenneTwister();

const fs = require('fs');

/**
 * Get a seeded random number
 * @param {Number} number Integer to seed
 * @returns Random integer on [0,0xffffffff]-interval *
 */
function seededRandom(number){
	generator.init_seed(number);
	return generator.random_int();
}

/**
 * Download a file from a url
 * @param {String} url URL to file to download
 * @param {String} dest Local file destination w/ name 
 */
function download(url, dest){
	let file = fs.createWriteStream(dest);
	https.get(url, res => {
		res.pipe(file);
		file.on('finish', file.close);
	}).on('error', err => {
		fs.unlink(dest); // Delete file on failure
	});
}

/**
 * Read data from a JSON API end point
 * @param {String} apiendpoint URL to API end point
 * @param {Function} callback Callback, json data will be passed to it
 */
async function getFromAPI(apiendpoint, callback){
	await https.get(apiendpoint, res => {
		let data = '';
		res.on('data', chunk => { data += chunk; });
		res.on('end', () => {
			let jsonData = JSON.parse(data);
			callback(jsonData);
		});

		res.on('error', err => {
			// TODO: replace w/ logger
			// callback should also be called to indicate an error occured
			console.log("Error: " + err.message);
		});
	});
}

/**
 * Evaluate a script on a page and get a callback
 * Example usage:
 * 	pageEval('https://mywebsite.xyz/url', () => document.getElementById(...).innerText, text => console.log(text), {})
 * 
 * @param {String} url Url to page to open 
 * @param {Function} pageScript Function to evaluate on the page, returned value
 * 								will be passed to the callback
 * @param {Function} callback Will be called when the page script returns 
 * @param {Object} settings Optional puppeteer settings. The following options can be set:
 * 								headless: {Boolean} default=false, launch browser in headless mode?
 * 								delay: {Integer}, default=0, extra delay in ms before running pagescript
 * 								autoscroll: {Boolean}, default=false, before running page script keep scrolling down until it can no longer?
 * 								autoscrollTimeout: {Integer}, default=-1, timeout for auto-scrolling, set to be negative for no limit
 * 										(WARNING: do not set to -1 for infinite scrolling page)	
 * 								autoscrollDelay: {Integer}, default=100, ms delay betwen scrolls, don't set too high or some autoscrolling pages may
 * 										not be able to keep up
 * 								autoscrollScrollBy: {Integer}, default=100, pixels to scroll by each time, don't set too high or program may incorrectly
 * 										detect its finished scrolling
 */
async function pageEval(url, pageScript, callback, settings={}) {
	settings.delay = settings.delay || 0;
	settings.autoscrollTimeout = settings.autoscrollTimeout || -1;
	settings.autoscrollDelay = settings.autoscrollDelay || 100;
	settings.autoscrollBy = settings.autoscrollBy || 100;

	const browser = await puppeteer.launch({ headless: settings.headless || false });
	const page = await browser.newPage();

	await page.goto(url, {
		waitUntil: 'load',
		timeout: 0
	});
	await page.waitForTimeout(settings.delay);

	// Autoscroll to bottom
	if (settings.autoscroll) {
		await page.evaluate(async ({settings}) => {
			await new Promise(resolve => {
				const start = new Date();
				let height = 0;

				let timer = setInterval(() => {
					window.scrollBy(0, settings.autoscrollBy);
					height += settings.autoscrollBy;

					if (height >= document.body.scrollHeight ||
							( // Scroll timeout, not tested on daylight savings
								settings.autoscrollTimeout > 0 &&
								Date.now() - start.getTime() > settings.autoscrollTimeout)) {
						clearInterval(timer);
						resolve();
					}
				}, settings.autoscrollDelay);
			});
		}, {settings});
	}

	// Evaluate scraping script
	const data = await page.evaluate(pageScript);
	callback(data);
	await browser.close();
}

/*
-- NOTE: untested
--       gets all the html from the
*/
async function grabHTML(url, callback){
	await searchPageFor(url, "*", callback);
}


module.exports = {
    /**
     * Assert the true-ness of a condition
     * @param {String} condition Condition to check for true-ness
     * @param {String} errorMsg Error message to display on fail, defaults to 'Assert failed'
     */
    assert: (condition, errorMsg) => { if (!condition) throw new Error(errorMsg || 'Assert failed'); },

	seededRandom,
	download,
	getFromAPI,
	pageEval
};
