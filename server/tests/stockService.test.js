const { getStockData } = require('../src/services/stockService');

describe('Stock Service', () => {
    test('fetches stock data correctly', async () => {
        const symbol = 'AAPL';
        const data = await getStockData(symbol);
        expect(data).toBeDefined();
        expect(data.symbol).toBe(symbol);
    }, 10000); // Timeout set to 10000 ms    
});
