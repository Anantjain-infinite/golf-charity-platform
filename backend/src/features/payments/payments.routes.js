import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { webhookLimiter } from '../../config/rateLimit.js';
import {
  createCheckoutSchema,
  createPortalSchema,
} from './payments.validation.js';
import { checkout, portal, webhook } from './payments.controller.js';

const router = Router();

// POST /api/payments/create-checkout-session
// Authenticated — initiates Stripe Checkout
router.post(
  '/create-checkout-session',
  authenticate,
  validate(createCheckoutSchema),
  checkout
);

// POST /api/payments/create-portal-session
// Authenticated — opens Stripe billing portal
router.post(
  '/create-portal-session',
  authenticate,
  validate(createPortalSchema),
  portal
);

// POST /api/payments/webhook
// Stripe webhook — NO authenticate middleware, raw body already set in app.js
router.post('/webhook', webhookLimiter, webhook);

export default router;