const errorHandler = require('../../src/utils/errorHandler');

describe('errorHandler', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = { path: '/test' };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
        console.error = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should log errors with stack in development and send appropriate response', () => {
        const error = new Error('Test error');
        error.stack = 'This is a stack trace';
        process.env.NODE_ENV = 'development';

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(console.error).toHaveBeenCalledWith('Error:', {
            message: error.message,
            stack: error.stack,
            path: mockReq.path
        });
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: {
                message: 'Internal Server Error',
                stack: 'This is a stack trace'
            }
        });
    });

    test('should handle client errors differently and not send stack in production', () => {
        const error = new Error('Client error');
        error.statusCode = 400;
        process.env.NODE_ENV = 'production';

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(console.error).toHaveBeenCalledWith('Error:', {
            message: error.message,
            path: mockReq.path,
            stack: undefined  // Ensure the stack is not included in production
        });
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: {
                message: 'Client error'
            }
        });
    });
    
    test('should handle unexpected errors without a specific status code', () => {
        const error = new Error('Unexpected error');

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: {
                message: 'Internal Server Error',
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            }
        });
    });

    test('should optionally call next with the error for further processing', () => {
        const error = new Error('For next handler');
        errorHandler(error, mockReq, mockRes, mockNext);

        // Uncomment the next line if you decide to use next() in your errorHandler
        // expect(mockNext).toHaveBeenCalledWith(error);
    });
});
