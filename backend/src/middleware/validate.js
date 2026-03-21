import ApiError from '../utils/ApiError.js';

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    // Zod v4 uses result.error.issues, v3 uses result.error.errors
    const issues = result.error.issues || result.error.errors || [];
    const message = issues.length > 0
      ? issues.map((e) => e.message).join('; ')
      : 'Validation failed';
    throw new ApiError(422, message);
  }
  req[source] = result.data;
  next();
};

export { validate };