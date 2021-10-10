function output(fiatRate, p2pRate) {
	try {
		const diff = (p2pRate - fiatRate).toFixed(2);
		return `FIAT: ${fiatRate} | P2P(AnyCashBot): ${p2pRate} | DIFFERENCE: ${diff}`;
	} catch (error) {
		throw error;
	}
}

module.exports = output;
