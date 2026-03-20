import Stripe from 'stripe';
import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';
import { calculatePaymentBreakdown } from '../draws/prizeCalculator.js';
import {
  sendSubscriptionConfirmedEmail,
  sendPaymentFailedEmail,
  sendCancellationConfirmedEmail,
} from '../emails/email.service.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
  yearly: process.env.STRIPE_YEARLY_PRICE_ID,
};

// Create Stripe Checkout Session for subscription
const createCheckoutSession = async (userId, { plan, charity_id }) => {
  const priceId = PRICE_IDS[plan];

  if (!priceId) {
    throw new ApiError(400, 'Invalid plan selected');
  }

  // Get user profile to check for existing Stripe customer
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name, stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    throw new ApiError(404, 'User profile not found');
  }

  // Update charity selection before checkout
  await supabaseAdmin
    .from('profiles')
    .update({ charity_id })
    .eq('id', userId);

  const sessionParams = {
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId,
      charityId: charity_id,
      plan,
    },
    success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/subscribe?cancelled=true`,
    allow_promotion_codes: true,
  };

  // Use existing Stripe customer if available, otherwise use email
  if (profile.stripe_customer_id) {
    sessionParams.customer = profile.stripe_customer_id;
  } else {
    sessionParams.customer_email = profile.email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  logger.info({
    message: 'createCheckoutSession: session created',
    userId,
    plan,
    sessionId: session.id,
  });

  return { url: session.url };
};

// Create Stripe Customer Portal session for billing management
const createPortalSession = async (userId, returnUrl) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error || !profile?.stripe_customer_id) {
    throw new ApiError(404, 'No billing account found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`,
  });

  return { url: session.url };
};

// Handle checkout.session.completed webhook event
const handleCheckoutCompleted = async (session) => {
  const { userId, charityId, plan } = session.metadata;

  if (!userId) {
    logger.warn({
      message: 'handleCheckoutCompleted: missing userId in metadata',
      sessionId: session.id,
    });
    return;
  }

  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  const renewalDate = new Date(
    subscription.current_period_end * 1000
  ).toISOString();

  // Update profile with subscription details
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      subscription_status: 'active',
      subscription_plan: plan,
      subscription_renewal_date: renewalDate,
      ...(charityId ? { charity_id: charityId } : {}),
    })
    .eq('id', userId);

  if (updateError) {
    logger.error({
      message: 'handleCheckoutCompleted: failed to update profile',
      userId,
      error: updateError.message,
    });
    return;
  }

  logger.info({
    message: 'handleCheckoutCompleted: subscription activated',
    userId,
    plan,
    subscriptionId: session.subscription,
  });

  // Send subscription confirmed email
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email, charities(name)')
    .eq('id', userId)
    .single();

  if (profile) {
    await sendSubscriptionConfirmedEmail({
      to: profile.email,
      fullName: profile.full_name,
      plan,
      renewalDate: new Date(renewalDate).toLocaleDateString('en-GB'),
      charityName: profile.charities?.name,
    });
  }

};

// Handle invoice.payment_succeeded webhook event
const handlePaymentSucceeded = async (invoice) => {
  if (!invoice.subscription) return;

  // Get subscription to find user
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, charity_contribution_percent')
    .eq('stripe_subscription_id', invoice.subscription)
    .single();

  if (profileError || !profile) {
    logger.warn({
      message: 'handlePaymentSucceeded: profile not found',
      subscriptionId: invoice.subscription,
    });
    return;
  }

  const amount = invoice.amount_paid / 100; // Convert from pence to pounds
  const { charityAmount, prizePoolAmount } = calculatePaymentBreakdown(
    amount,
    profile.charity_contribution_percent
  );

  // Create payment record
  const { error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      user_id: profile.id,
      stripe_invoice_id: invoice.id,
      amount,
      currency: invoice.currency,
      status: 'succeeded',
      subscription_period_start: new Date(
        invoice.period_start * 1000
      ).toISOString(),
      subscription_period_end: new Date(
        invoice.period_end * 1000
      ).toISOString(),
      charity_contribution_amount: charityAmount,
      prize_pool_contribution_amount: prizePoolAmount,
    });

  if (paymentError) {
    logger.error({
      message: 'handlePaymentSucceeded: failed to create payment record',
      invoiceId: invoice.id,
      error: paymentError.message,
    });
    return;
  }

  // Update renewal date
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription
  );

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_renewal_date: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      subscription_status: 'active',
    })
    .eq('id', profile.id);

  logger.info({
    message: 'handlePaymentSucceeded: payment recorded',
    userId: profile.id,
    amount,
    charityAmount,
    prizePoolAmount,
  });
};

// Handle invoice.payment_failed webhook event
const handlePaymentFailed = async (invoice) => {
  if (!invoice.subscription) return;

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name')
    .eq('stripe_subscription_id', invoice.subscription)
    .single();

  if (error || !profile) {
    logger.warn({
      message: 'handlePaymentFailed: profile not found',
      subscriptionId: invoice.subscription,
    });
    return;
  }

  await supabaseAdmin
    .from('profiles')
    .update({ subscription_status: 'lapsed' })
    .eq('id', profile.id);

  logger.warn({
    message: 'handlePaymentFailed: subscription lapsed',
    userId: profile.id,
    invoiceId: invoice.id,
  });

  // Send payment failed email
  await sendPaymentFailedEmail({
    to: profile.email,
    fullName: profile.full_name,
  });

};

// Handle customer.subscription.updated webhook event
const handleSubscriptionUpdated = async (subscription) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (error || !profile) return;

  const statusMap = {
    active: 'active',
    past_due: 'lapsed',
    canceled: 'cancelled',
    unpaid: 'lapsed',
    trialing: 'active',
  };

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: statusMap[subscription.status] || 'inactive',
      subscription_renewal_date: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq('id', profile.id);

  logger.info({
    message: 'handleSubscriptionUpdated',
    userId: profile.id,
    status: subscription.status,
  });
};

// Handle customer.subscription.deleted webhook event
const handleSubscriptionDeleted = async (subscription) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (error || !profile) return;

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      stripe_subscription_id: null,
    })
    .eq('id', profile.id);

  logger.info({
    message: 'handleSubscriptionDeleted: subscription cancelled',
    userId: profile.id,
  });
// Send cancellation confirmed email
await sendCancellationConfirmedEmail({
  to: profile.email,
  fullName: profile.full_name,
  endDate: new Date(subscription.current_period_end * 1000).toLocaleDateString('en-GB'),
});

};

export {
  createCheckoutSession,
  createPortalSession,
  handleCheckoutCompleted,
  handlePaymentSucceeded,
  handlePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
};