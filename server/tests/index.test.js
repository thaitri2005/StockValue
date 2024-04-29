const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { server } = require('../index'); // Adjust the path as necessary to import your server

describe('Server Basic Functionality', () => {
    const clientPath = process.env.CLIENT_DIR || path.join(__dirname, '..', 'stock-price-tracker');

    beforeAll(() => {
        // Ensure the CLIENT_DIR is set for testing or use default
        process.env.CLIENT_DIR = clientPath;
        // Optionally, you can create a test file in the client directory to test static serving
        fs.writeFileSync(path.join(clientPath, 'test.html'), '<!DOCTYPE html><html><body>Test File</body></html>');
    });

    afterAll(() => {
        // Clean up the test file after tests run
        fs.unlinkSync(path.join(clientPath, 'test.html'));
        server.close(); // Ensure the server is closed after tests
    });

    test('should serve static files', async () => {
        const response = await request(server).get('/test.html'); // Use server to handle the HTTP requests
        expect(response.status).toBe(200);
        expect(response.type).toBe('text/html');
        expect(response.text).toContain('Test File');
    });

    // Add other tests here if needed
});
