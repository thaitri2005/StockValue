// Import yahoo-finance2
const yahooFinance = require('yahoo-finance2').default;

async function getRealTimeData(symbol) {
    try {
        // Use the .quote() method from yahoo-finance2 for real-time data
        const result = await yahooFinance.quote(symbol);
        return result;
    } catch (error) {
        console.error('Error fetching real-time data:', error);
        throw error; // Ensure this error is caught and handled appropriately in your route
    }
}

module.exports = { getRealTimeData };
