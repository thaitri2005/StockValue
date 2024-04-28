const { getRealTimeData } = require('../../src/api/realTimeData');
const yahooFinance = require('yahoo-finance2').default;

// Mocking yahooFinance.quote to control the behavior for testing
jest.mock('yahoo-finance2', () => ({
    default: {
        quote: jest.fn()
    }
}));

describe('getRealTimeData', () => {
    const symbol = 'AAPL';

    beforeEach(() => {
        yahooFinance.quote.mockClear();
    });

    test('fetches real-time data successfully', async () => {
        // Setup the expected data and the mock to return this data
        const expectedData = {
            symbol: symbol,
            price: 150,
            high: 155,
            low: 149
        };
        yahooFinance.quote.mockResolvedValue(expectedData);

        // Call the function with the test parameters
        const data = await getRealTimeData(symbol);

        // Assertions to check if the function behaves as expected
        expect(data).toEqual(expectedData);
        expect(yahooFinance.quote).toHaveBeenCalledWith(symbol);
    });

    test('handles errors correctly when fetching data fails', async () => {
        // Setup the mock to reject with an error
        const errorMessage = 'Error fetching real-time data';
        yahooFinance.quote.mockRejectedValue(new Error(errorMessage));

        // Assert that the promise throws an error
        await expect(getRealTimeData(symbol)).rejects.toThrow(errorMessage);
    });
});
