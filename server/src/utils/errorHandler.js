function errorHandler(err, req, res, next) {
    console.error(err); // Log error information for debugging
    res.status(500).json({ error: 'Internal server error' }); // Send a generic error message to the client
}
module.exports = errorHandler;
