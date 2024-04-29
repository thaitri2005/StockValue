const yahooFinance = require('yahoo-finance2').default;

async function getRealTimeData(symbol) {
  try {
    const result = await yahooFinance.quote(symbol);
    return result;
  } catch (error) {
    if (error.name === 'FailedYahooValidationError') {
      console.warn('Validation error ignored:', error);
      // Log the error for future analysis but return the result as it might still be usable
      return error.result; // Assuming error object has the result that failed validation
    }
    console.error('Error fetching real-time data:', error);
    throw new Error(
      `Failed to fetch real-time data for ${symbol}: ${error.message}`,
    );
  }
}

module.exports = { getRealTimeData };
