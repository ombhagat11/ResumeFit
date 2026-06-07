function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? undefined : error.details,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
}

module.exports = { notFound, errorHandler };
