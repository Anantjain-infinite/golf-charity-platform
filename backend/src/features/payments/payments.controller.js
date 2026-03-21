import Stripe from 'stripe';
import asyncHandler from '../../utils/asyncHandler.js';
import logger from '../../config/logger.js';
import {
  createCheckoutSession,
  createPortalSession,
  handleCheckoutCompleted,
  handlePaymentSucceeded,
  handlePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from './payments.service.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-checkout-session
// Authenticated — creates Stripe Checkout session and returns URL
const checkout = asyncHandler(async (req, res) => {
  const { plan, charity_id } = req.body;

  const result = await createCheckoutSession(req.user.id, {
    plan,
    charity_id,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

// POST /api/payments/create-portal-session
// Authenticated — creates Stripe billing portal session
const portal = asyncHandler(async (req, res) => {
  const return_url = req.body?.return_url || null;

  const result = await createPortalSession(req.user.id, return_url);

  res.status(200).json({
    success: true,
    data: result,
  });
});
// POST /api/payments/webhook
// Stripe webhook — raw body required, signature verified
const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    logger.warn({ message: 'Webhook: missing stripe-signature header' });
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.warn({
      message: 'Webhook: signature verification failed',
      error: err.message,
    });
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  logger.info({
    message: 'Webhook: event received',
    type: event.type,
    id: event.id,
  });

  // Handle each event type
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        logger.info({
          message: 'Webhook: unhandled event type',
          type: event.type,
        });
    }
  } catch (err) {
    // Log handler errors but always return 200 to Stripe
    // Stripe retries on non-200 responses which can cause duplicate processing
    logger.error({
      message: 'Webhook: handler error',
      type: event.type,
      error: err.message,
    });
  }

  // Always return 200 to Stripe to acknowledge receipt
  res.status(200).json({ received: true });
};

export { checkout, portal, webhook };