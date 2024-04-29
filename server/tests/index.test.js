const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { server } = require('../index'); // Adjust the path as necessary to import your server
const yahooFinance = require('yahoo-finance2').default;

// Correctly mock the yahooFinance module for integration testing
jest.mock('yahoo-finance2', () => ({
  default: {
    quote: jest.fn(),
    historical: jest.fn(),
  },
}));

describe('Server Basic Functionality', () => {
  const clientPath =
    process.env.CLIENT_DIR || path.join(__dirname, '..', 'client');

  beforeAll(() => {
    // Set up the CLIENT_DIR environment variable for testing or use the default
    process.env.CLIENT_DIR = clientPath;
    // Create a test file in the client directory to test static serving
    fs.writeFileSync(
      path.join(clientPath, 'test.html'),
      '<!DOCTYPE html><html><body>Test File</body></html>',
    );
  });

  // This will handle closing the server after each test suite
  afterAll(() => {
    fs.unlinkSync(path.join(clientPath, 'test.html'));
    server.close();
  });

  test('should serve static files', async () => {
    const response = await request(server).get('/test.html');
    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text).toContain('Test File');
  });

  test('should return real-time data for a given symbol', async () => {
    const expectedData = {
      symbol: 'AAPL',
      price: 150,
      high: 155,
      low: 149,
    };
    yahooFinance.quote.mockResolvedValue(expectedData); // Corrected mock

    const response = await request(server).get('/api/realtime/AAPL');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedData); // Ensure the response matches the expected object
  });

  test('should return historical data for a given symbol', async () => {
    const expectedData = [
      {
        date: '2023-01-01',
        close: 150,
      },
    ];
    yahooFinance.historical.mockResolvedValue(expectedData); // Corrected mock

    const response = await request(server).get(
      '/api/historical/AAPL?from=2023-01-01&to=2023-01-31',
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedData); // Ensure the response exactly matches the expected array
  });
});
