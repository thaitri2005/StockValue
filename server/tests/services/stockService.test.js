const yahooFinance = require('yahoo-finance2').default;
const cacheManager = require('../../src/cache/cacheManager');
const { getStockData } = require('../../src/services/stockService');

jest.mock('yahoo-finance2', () => ({
  default: {
    quote: jest.fn(),
  },
}));

jest.mock('../../src/cache/cacheManager', () => ({
  has: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
}));

describe('stockService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    // Restore original console methods after each test
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('returns data from cache if available', async () => {
    const cachedData = { symbol: 'AAPL', price: 150 };
    cacheManager.has.mockReturnValue(true);
    cacheManager.get.mockReturnValue(cachedData);

    const data = await getStockData('AAPL');
    expect(data).toEqual(cachedData);
    expect(cacheManager.has).toHaveBeenCalledWith('AAPL');
    expect(cacheManager.get).toHaveBeenCalledWith('AAPL');
    expect(yahooFinance.quote).not.toHaveBeenCalled();
  });

  test('fetches data from API and caches it if not in cache', async () => {
    const apiData = { symbol: 'AAPL', price: 150 };
    cacheManager.has.mockReturnValue(false);
    yahooFinance.quote.mockResolvedValue(apiData);

    const data = await getStockData('AAPL');
    expect(data).toEqual(apiData);
    expect(cacheManager.set).toHaveBeenCalledWith('AAPL', apiData);
    expect(yahooFinance.quote).toHaveBeenCalledWith('AAPL');
  });

  test('retries fetching data when API call fails initially', async () => {
    cacheManager.has.mockReturnValue(false);
    const error = new Error('API error');
    yahooFinance.quote
      .mockRejectedValueOnce(error) // First call fails
      .mockRejectedValueOnce(error) // Second call fails
      .mockResolvedValue({ symbol: 'AAPL', price: 150 }); // Third call succeeds

    const data = await getStockData('AAPL');
    expect(data).toEqual({ symbol: 'AAPL', price: 150 });
    expect(yahooFinance.quote).toHaveBeenCalledTimes(3);
  });

  test('throws error after max retries are exceeded', async () => {
    cacheManager.has.mockReturnValue(false);
    const error = new Error('API error');
    yahooFinance.quote.mockRejectedValue(error);

    await expect(getStockData('AAPL')).rejects.toThrow(error);
    expect(yahooFinance.quote).toHaveBeenCalledTimes(4); // Initial + 3 retries
  });
});
