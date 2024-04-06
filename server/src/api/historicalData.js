// This module will handle fetching historical stock data.
const yahooFinance = require('yahoo-finance');

async function getHistoricalData(symbol, from, to) {
    try {
        const historicalData = await yahooFinance.historical({
            symbol: symbol,
            from: from,
            to: to
        });
        return historicalData;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error; // Rethrow to handle it in the caller
    }
}

module.exports = { getHistoricalData };
