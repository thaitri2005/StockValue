function errorHandler(err, req, res, next) {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
  });

  const statusCode = err.statusCode || 500;
  const errorMessage =
    statusCode === 500 ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
module.exports = errorHandler;
