import { z } from 'zod';

export const getCharitiesSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, 'Page must be at least 1')),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 12))
    .pipe(z.number().min(1).max(100, 'Limit cannot exceed 100')),

  search: z
    .string()
    .max(100, 'Search term too long')
    .optional(),
});