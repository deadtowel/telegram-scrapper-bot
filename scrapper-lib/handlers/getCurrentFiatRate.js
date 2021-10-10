const cheerio = require('cheerio');
const getPageContent = require('../common/getPageContent');

const URL_FIAT = 'https://www.binance.com/en/trade/USDT_UAH?layout=pro';

async function getCurrentFiatRate() {
	try {
		const content = await getPageContent(URL_FIAT);
		const $ = cheerio.load(content);
		const currentP2pRate = $('.showPrice').text();

		return currentP2pRate;
	} catch (error) {
		throw error;
	}
}

module.exports = getCurrentFiatRate;
