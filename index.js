const getPriceChangeInLastDay = require('./getPriceChangeInLastDay');

(async () => {
	const {
		description,
		decimals,
		roundDataDate,
		latestRoundDataDate,
		priceDifference
	} = await getPriceChangeInLastDay();

	console.log(`Description: ${description}`);
	console.log(`Decimals: ${decimals}`);
	console.log(`From: ${roundDataDate.toLocaleDateString("en-UK")} Time: ${roundDataDate.toLocaleTimeString("en-UK")}`);
	console.log(`To: ${latestRoundDataDate.toLocaleDateString("en-UK")} Time: ${latestRoundDataDate.toLocaleTimeString("en-UK")}`);
	console.log(`Price Change: ${priceDifference} dollars`);
})()
