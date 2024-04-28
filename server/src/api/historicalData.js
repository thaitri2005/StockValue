const yahooFinance = require('yahoo-finance2').default;

async function getHistoricalData(symbol, from, to) {
    try {
        const queryOptions = {
            period1: from,
            period2: to,
            // Ensure only valid parameters are included here
            // events: 'div,splits' might have been here previously and should be removed or validated
        };
        const historicalData = await yahooFinance.historical(symbol, queryOptions);
        return historicalData;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error; // Rethrow to handle it in the caller
    }
}

module.exports = { getHistoricalData };
