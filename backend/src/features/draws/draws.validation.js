import { z } from 'zod';

export const createDrawSchema = z.object({
  draw_month: z
    .string({
      required_error: 'Draw month is required',
    })
    .regex(
      /^\d{4}-\d{2}$/,
      'Draw month must be in format YYYY-MM'
    )
    .refine((val) => {
      const [year, month] = val.split('-').map(Number);
      return month >= 1 && month <= 12 && year >= 2026;
    }, 'Invalid draw month'),

  draw_type: z.enum(['random', 'algorithmic'], {
    required_error: 'Draw type is required',
    invalid_type_error: 'Draw type must be random or algorithmic',
  }),

  algorithm_mode: z
    .enum(['frequent', 'rare'], {
      invalid_type_error: 'Algorithm mode must be frequent or rare',
    })
    .optional(),
}).refine(
  (data) => {
    if (data.draw_type === 'algorithmic' && !data.algorithm_mode) {
      return false;
    }
    return true;
  },
  'Algorithm mode is required when draw type is algorithmic'
);

export const getDrawsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1)),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1).max(50)),
});