const getPriceChangeInLastDay = require('./getPriceChangeInLastDay');

(async () => {
	const {
		description,
		decimals,
		roundDataDate,
		latestRoundDataDate,
		priceDifference
	} = await getPriceChangeInLastDay("0x9326BFA02ADD2366b30bacB125260Af641031331");

	console.log(`Description: ${description}`);
	console.log(`Decimals: ${decimals}`);
	console.log(`From: ${roundDataDate.toLocaleDateString("en-UK")} Time: ${roundDataDate.toLocaleTimeString("en-UK")}`);
	console.log(`To: ${latestRoundDataDate.toLocaleDateString("en-UK")} Time: ${latestRoundDataDate.toLocaleTimeString("en-UK")}`);
	console.log(`Price Change: ${priceDifference} dollars`);
})()
