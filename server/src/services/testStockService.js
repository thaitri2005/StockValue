const { getStockData } = require('./stockService');

async function testGetStockData() {
  const symbol = 'AAPL'; // Use a common stock symbol like Apple

  try {
    const data = await getStockData(symbol);
    console.log('Stock Data:', data);
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
  }
}

testGetStockData();
