const Web3 = require('web3');
const { PROJECT_ID } = require('./config.json');

async function getPriceChangeInLastDay(tokenAddress) {
	try {
		const web3 = new Web3(`https://kovan.infura.io/v3/${PROJECT_ID}`);
		const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
		const addr = tokenAddress;
		const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

		const description = await priceFeed.methods.description().call();
		const decimals = await priceFeed.methods.decimals().call();
		const latestRoundData = await priceFeed.methods.latestRoundData().call();
		const latestRoundDataDate = new Date(parseInt(latestRoundData.startedAt) * 1000);

		let roundData;
		let roundDataDate;
		let dateDifferenceInHours = 0;
		let counter = 0;

		while (dateDifferenceInHours < 24) {
			roundData = await priceFeed.methods.getRoundData(
				BigInt(latestRoundData.roundId) - BigInt(counter++)
			).call();

			if (roundData.startedAt && roundData.updatedAt) { //check if valid round id
				roundDataDate = new Date(parseInt(roundData.startedAt) * 1000);
				dateDifferenceInHours = Math.abs(latestRoundDataDate - roundDataDate) / (1000 * 60 * 60);
			}
		}

		const priceDifference = ((latestRoundData.answer - roundData.answer) / 10 ** decimals).toFixed(2);

		return {
			description,
			decimals,
			roundDataDate,
			latestRoundDataDate,
			priceDifference
		};
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = getPriceChangeInLastDay;