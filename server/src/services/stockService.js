const yahooFinance = require('yahoo-finance2').default;
const cacheManager = require('../cache/cacheManager');

async function getStockData(symbol, retries = 3) {
  // Check cache first
  if (cacheManager.has(symbol)) {
    return cacheManager.get(symbol);
  }

  try {
    const data = await yahooFinance.quote(symbol);
    cacheManager.set(symbol, data);
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds before retrying
      return getStockData(symbol, retries - 1);
    } else {
      console.error('Failed to fetch stock data:', error);
      throw error;
    }
  }
}

module.exports = { getStockData };
