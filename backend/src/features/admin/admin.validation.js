import { z } from 'zod';

export const getUsersSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1)),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().min(1).max(100)),

  search: z.string().max(100).optional(),

  status: z
    .enum(['active', 'inactive', 'cancelled', 'lapsed'])
    .optional(),
});

export const updateUserSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
  charity_id: z.string().uuid().optional(),
  charity_contribution_percent: z
    .number()
    .int()
    .min(10)
    .max(100)
    .optional(),
  subscription_status: z
    .enum(['active', 'inactive', 'cancelled', 'lapsed'])
    .optional(),
  role: z.enum(['subscriber', 'admin']).optional(),
});

export const createDrawSchema = z.object({
  draw_month: z
    .string({ required_error: 'Draw month is required' })
    .regex(/^\d{4}-\d{2}$/, 'Draw month must be in format YYYY-MM')
    .refine((val) => {
      const [year, month] = val.split('-').map(Number);
      return month >= 1 && month <= 12 && year >= 2026;
    }, 'Invalid draw month'),

  draw_type: z.enum(['random', 'algorithmic'], {
    required_error: 'Draw type is required',
  }),

  algorithm_mode: z
    .enum(['frequent', 'rare'])
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

export const updateClaimSchema = z.object({
  status: z.enum(['approved', 'rejected', 'paid'], {
    required_error: 'Status is required',
  }),
  admin_note: z.string().max(500).optional(),
});

export const createCharitySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  description: z.string().max(1000).optional(),
  website_url: z.string().url().optional(),
  is_featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
});

export const updateCharitySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  website_url: z.string().url().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const getAnalyticsSchema = z.object({
  range: z
    .enum(['7d', '30d', '90d', '12m'])
    .optional()
    .default('30d'),
});

export const getClaimsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1)),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().min(1).max(100)),

  status: z
    .enum(['pending', 'approved', 'rejected', 'paid'])
    .optional(),
});