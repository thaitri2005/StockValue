const errorHandler = require('../../src/utils/errorHandler');

describe('errorHandler', () => {
    const mockReq = {};
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const mockNext = jest.fn();
    const error = new Error('Test error');

    beforeEach(() => {
        // Mock console.error before each test
        console.error = jest.fn();
    });

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });

    it('should send a 500 status and a generic error message', () => {
        errorHandler(error, mockReq, mockRes, mockNext);
        
        expect(console.error).toHaveBeenCalledWith(error);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        expect(mockNext).not.toHaveBeenCalled(); // Ensure 'next' is not called
    });
});
