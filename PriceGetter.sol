// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceGetter 
{
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() 
    {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }
    
    function getDecimals() public view returns (uint) 
    {
        return priceFeed.decimals();
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int, uint80, uint) 
    {
        (
            uint80 roundId, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return (price, roundId, timeStamp);
    }
    
    /**
     * Returns the price in the given roundId
     */
    function getHistoricalPrice(uint80 roundId) public view returns (int, uint, bool) 
    {
        (
            uint80 id, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.getRoundData(roundId);
        
        bool success = true;
        
        if(timeStamp == 0)
            success = false;
        
        return (price, timeStamp, success);
    }
    
    /**
     * Returns the price difference in the last 24 hours
     */
    function getPriceChange() public view returns (int) 
    {
        (int latestPrice, uint80 latestRoundId, uint latestTimeStamp) = getLatestPrice();
        uint dateDifference = 0;
        uint80 counter = 1;
        int result = 0;
        while(dateDifference < 1 days) {
            (int price, uint timeStamp, bool success) = getHistoricalPrice(latestRoundId - counter);
            
            if(success) 
            {
                dateDifference = latestTimeStamp - timeStamp;
                result = latestPrice - price;
                counter++;
            }
        }
        return result;
    }
}
