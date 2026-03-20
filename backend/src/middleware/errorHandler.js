import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Log all 5xx errors; log 4xx at warn level
  if (error.statusCode >= 500) {
    logger.error({
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.id,
    });
  } else {
    logger.warn({
      message: error.message,
      statusCode: error.statusCode,
      path: req.path,
      method: req.method,
    });
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export { errorHandler };

