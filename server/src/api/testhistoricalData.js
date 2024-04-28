const { getHistoricalData } = require('./historicalData');

async function testGetHistoricalData() {
    const symbol = 'AAPL'; // Use a common stock symbol like Apple
    const from = '2023-01-01'; // Start date for historical data
    const to = '2023-04-01'; // End date for historical data

    try {
        const data = await getHistoricalData(symbol, from, to);
        console.log('Historical Data:', data);
    } catch (error) {
        console.error('Failed to fetch historical data:', error);
    }
}

testGetHistoricalData();
