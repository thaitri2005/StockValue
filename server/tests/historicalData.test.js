const { getHistoricalData } = require('./historicalData');

describe('Historical Data Module', () => {
  test('fetches historical data successfully', async () => {
    const symbol = 'AAPL';
    const from = '2023-01-01';
    const to = '2023-01-31';
    const data = await getHistoricalData(symbol, from, to);

    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    data.forEach(item => {
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('open');
      expect(item).toHaveProperty('high');
      expect(item).toHaveProperty('low');
      expect(item).toHaveProperty('close');
      expect(item).toHaveProperty('adjClose');
      expect(item).toHaveProperty('volume');
    });
  });

  test('handles errors appropriately', async () => {
    const symbol = 'INVALID';
    await expect(getHistoricalData(symbol, '2023-01-01', '2023-01-31')).rejects.toThrow();
  });
});

