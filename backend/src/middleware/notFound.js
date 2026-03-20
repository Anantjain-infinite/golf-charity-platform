import ApiError from '../utils/ApiError.js';

// Catch-all 404 handler for any unmatched route.
const notFound = (req, res, next) => {
  throw new ApiError(404, 'Route not found');
};

export { notFound };

