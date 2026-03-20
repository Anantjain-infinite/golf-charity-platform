import { z } from 'zod';

// Server-side validation for PATCH /me
// - All fields are optional (partial updates)
// - At least one field must be provided
const updateProfileSchema = z
  .object({
    full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(120).optional(),
    avatar_url: z.string().trim().url('avatar_url must be a valid URL').optional(),
    charity_id: z.string().trim().uuid('charity_id must be a valid UUID').optional(),
    charity_contribution_percent: z
      .coerce
      .number()
      .int('charity_contribution_percent must be an integer')
      .min(10, 'charity_contribution_percent must be at least 10')
      .max(100, 'charity_contribution_percent must be at most 100')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one profile field must be provided',
  });

export { updateProfileSchema };

