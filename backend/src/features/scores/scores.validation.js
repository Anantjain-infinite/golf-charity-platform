import { z } from 'zod';

export const addScoreSchema = z.object({
  score: z
    .number({
      required_error: 'Score is required',
      invalid_type_error: 'Score must be a number',
    })
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score must be no more than 45'),

  played_date: z
    .string({
      required_error: 'Played date is required',
    })
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date must be in format YYYY-MM-DD'
    )
    .refine((date) => {
      const parsed = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return parsed <= today;
    }, 'Played date cannot be in the future'),
});

export const updateScoreSchema = z
  .object({
    score: z
      .number({
        invalid_type_error: 'Score must be a number',
      })
      .int('Score must be a whole number')
      .min(1, 'Score must be at least 1')
      .max(45, 'Score must be no more than 45')
      .optional(),

    played_date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Date must be in format YYYY-MM-DD'
      )
      .refine((date) => {
        const parsed = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return parsed <= today;
      }, 'Played date cannot be in the future')
      .optional(),
  })
  .refine(
    (data) => data.score !== undefined || data.played_date !== undefined,
    'At least one field (score or played_date) must be provided'
  );