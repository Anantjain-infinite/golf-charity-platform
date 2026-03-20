import { z } from 'zod';

// Server-side input validation for auth.
// Note: controllers/services rely on `validate()` to replace req.body with parsed data.
const signupSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().trim().min(2, 'Full name is required').max(120),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export { signupSchema, loginSchema };

