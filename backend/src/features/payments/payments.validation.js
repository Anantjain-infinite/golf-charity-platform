import { z } from 'zod';

export const createCheckoutSchema = z.object({
  plan: z.enum(['monthly', 'yearly'], {
    required_error: 'Plan is required',
    invalid_type_error: 'Plan must be monthly or yearly',
  }),

  charity_id: z
    .string({
      required_error: 'Charity selection is required',
    })
    .uuid('Invalid charity ID'),
});

export const createPortalSchema = z.object({
  return_url: z
    .string()
    .url('Invalid return URL')
    .optional(),
});