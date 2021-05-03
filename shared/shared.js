/** Shared functions for all files**/

const https = require('https')
const puppeteer = require('puppeteer-core');

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
	http.get(url, res => {
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

/*
-- NOTE: untested
-- 			 start of scraping with puppeteer
*/

async function pageEval(url, pageScript, callback){
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	const data = await page.evaluate(pageScript);
	callback(data);
	// await page.screenshot({ path: 'example.png' });

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
