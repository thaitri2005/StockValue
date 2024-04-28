const { getHistoricalData } = require('../../src/api/historicalData');
const yahooFinance = require('yahoo-finance2').default;

// Mocking yahooFinance.historical to control the behavior for testing
jest.mock('yahoo-finance2', () => ({
    default: {
        historical: jest.fn()
    }
}));

describe('getHistoricalData', () => {
    const symbol = 'AAPL';
    const from = '2023-01-01';
    const to = '2023-01-31';

    beforeEach(() => {
        yahooFinance.historical.mockClear();
        console.error = jest.fn();
    });

    test('fetches historical data successfully', async () => {
        // Setup the expected data and the mock to return this data
        const expectedData = [{ date: '2023-01-01', close: 150 }];
        yahooFinance.historical.mockResolvedValue(expectedData);

        // Call the function with the test parameters
        const data = await getHistoricalData(symbol, from, to);

        // Assertions to check if the function behaves as expected
        expect(data).toEqual(expectedData);
        expect(yahooFinance.historical).toHaveBeenCalledWith(symbol, {
            period1: from,
            period2: to
        });
    });

    test('handles errors correctly when fetching data fails', async () => {
        // Setup the mock to reject with an error
        const errorMessage = 'Failed to fetch data';
        yahooFinance.historical.mockRejectedValue(new Error(errorMessage));

        // Assert that the promise throws an error
        await expect(getHistoricalData(symbol, from, to)).rejects.toThrow(errorMessage);
    });
});
