import ApiError from '../utils/ApiError.js';

// Factory: returns middleware that validates req.body against a Zod schema
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join('; ');
    throw new ApiError(422, message);
  }
  req[source] = result.data; // Replace with parsed/coerced data
  next();
};

export { validate };

