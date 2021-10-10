const cheerio = require('cheerio');
const chalk = require('chalk');
const getPageContent = require('../common/getPageContent');

const URL_P2P =
	'https://p2p.binance.com/en/trade/sell/USDT?fiat=UAH&payment=ALL';

async function getCurrentP2pRate(specifiedMerchantName) {
	try {
		const content = await getPageContent(URL_P2P);
		// first instance of function
		if (specifiedMerchantName) {
			const $ = cheerio.load(content);
			const tradeOffers = $('.css-1q1sp11');

			const merchant = {};
			tradeOffers.each((index, el) => {
				const merchantNameEl = $(el).find(
					'#C2Cofferlistbuy_link_merchantdetail',
				);

				if (merchantNameEl.text() === specifiedMerchantName) {
					merchant.name = merchantNameEl.text();
					const merchantCurrentRateEl = $(el).find('.css-1m1f8hn');
					merchant.rate = merchantCurrentRateEl.text();
					return false;
				}
			});
			return merchant;
		} else {
			// second instance of function
			const $ = cheerio.load(content);
			const tradeOffers = $('.css-1q1sp11');

			const merchantsArray = [];
			tradeOffers.each((index, el) => {
				const merchant = {};
				const merchantNameEl = $(el).find(
					'#C2Cofferlistbuy_link_merchantdetail',
				);
				merchant.name = merchantNameEl.text();

				const merchantCurrentRateEl = $(el).find('.css-1m1f8hn');
				merchant.rate = merchantCurrentRateEl.text();

				//console.log(chalk.bgGray(`${JSON.stringify(merchant)}`));
				merchantsArray.push(merchant);
			});
			return merchantsArray;
		}
	} catch (error) {
		throw error;
	}
}

module.exports = getCurrentP2pRate;
