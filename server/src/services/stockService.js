const yahooFinance = require('yahoo-finance');
const cacheManager = require('../cache/cacheManager');

async function getStockData(symbol) {
    // Check cache first
    if (cacheManager.has(symbol)) {
        return cacheManager.get(symbol);
    }

    // Fetch new data and cache it
    const data = await yahooFinance.quote({ symbol, modules: ['price'] });
    cacheManager.set(symbol, data);
    return data;
}

module.exports = { getStockData };
