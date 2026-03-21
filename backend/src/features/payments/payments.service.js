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

  // Log what we received
  logger.info({
    message: 'handleCheckoutCompleted: processing',
    userId,
    plan,
    subscriptionId: session.subscription,
    subscriptionType: typeof session.subscription,
  });

  // subscription can sometimes be an expanded object — extract the ID safely
  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    logger.error({
      message: 'handleCheckoutCompleted: no subscription ID found',
      session: session.id,
    });
    return;
  }

  // Retrieve subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  logger.info({
    message: 'handleCheckoutCompleted: subscription retrieved',
    subscriptionStatus: subscription.status,
    currentPeriodEnd: subscription.current_period_end,
    currentPeriodEndType: typeof subscription.current_period_end,
  });

  // Safely convert Unix timestamp
  const periodEnd =
  subscription.current_period_end ??
  subscription.items?.data?.[0]?.current_period_end ??
  subscription.billing_cycle_anchor;

if (!periodEnd || typeof periodEnd !== 'number') {
  logger.error({
    message: 'handleCheckoutCompleted: invalid current_period_end',
    periodEnd,
    subscriptionId,
  });
  return;
}

const renewalDate = new Date(periodEnd * 1000).toISOString();


  // Update profile
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscriptionId,
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
    subscriptionId,
    renewalDate,
  });

  // Send email
  try {
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
  } catch (emailErr) {
    logger.warn({
      message: 'handleCheckoutCompleted: email failed but subscription activated',
      error: emailErr.message,
    });
  }
};



// Handle invoice.payment_succeeded webhook event
const handlePaymentSucceeded = async (invoice) => {
  // Stripe API 2026+ moved subscription ID to invoice.parent.subscription_details.subscription
  const subscriptionId =
    invoice.subscription ||
    invoice.parent?.subscription_details?.subscription ||
    null;

  logger.info({
    message: 'handlePaymentSucceeded: started',
    invoiceId: invoice.id,
    subscriptionId,
    customer: invoice.customer,
    amountPaid: invoice.amount_paid,
  });

  if (!subscriptionId) {
    logger.warn({ message: 'handlePaymentSucceeded: no subscription ID found, skipping' });
    return;
  }

  // Try finding profile by stripe_subscription_id first
  let profile = null;

  const { data: profileBySubId } = await supabaseAdmin
    .from('profiles')
    .select('id, charity_contribution_percent')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (profileBySubId) {
    profile = profileBySubId;
  } else {
    // Fallback: find by stripe_customer_id
    const { data: profileByCustomerId } = await supabaseAdmin
      .from('profiles')
      .select('id, charity_contribution_percent')
      .eq('stripe_customer_id', invoice.customer)
      .single();

    if (profileByCustomerId) {
      profile = profileByCustomerId;

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_subscription_id: subscriptionId })
        .eq('id', profile.id);
    }
  }

  if (!profile) {
    logger.warn({
      message: 'handlePaymentSucceeded: profile not found',
      subscriptionId,
      customerId: invoice.customer,
    });
    return;
  }

  // Check duplicate
  const { data: existing } = await supabaseAdmin
    .from('payments')
    .select('id')
    .eq('stripe_invoice_id', invoice.id)
    .single();

  if (existing) {
    logger.info({ message: 'handlePaymentSucceeded: already recorded', invoiceId: invoice.id });
    return;
  }

  const amount = invoice.amount_paid / 100;
  const { charityAmount, prizePoolAmount } = calculatePaymentBreakdown(
    amount,
    profile.charity_contribution_percent || 10
  );

  // Stripe API 2026+ uses period_start and period_end directly on invoice
  const periodStart = invoice.period_start || invoice.parent?.subscription_details?.period_start;
  const periodEnd = invoice.period_end || invoice.parent?.subscription_details?.period_end;

  const { error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      user_id: profile.id,
      stripe_invoice_id: invoice.id,
      amount,
      currency: invoice.currency,
      status: 'succeeded',
      subscription_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      subscription_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      charity_contribution_amount: charityAmount,
      prize_pool_contribution_amount: prizePoolAmount,
    });

  if (paymentError) {
    logger.error({
      message: 'handlePaymentSucceeded: insert failed',
      invoiceId: invoice.id,
      error: paymentError.message,
      errorCode: paymentError.code,
    });
    return;
  }

  // Update renewal date
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const renewalEnd =
      subscription.current_period_end ??
      subscription.items?.data?.[0]?.current_period_end ??
      subscription.billing_cycle_anchor;

    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_renewal_date: renewalEnd
          ? new Date(renewalEnd * 1000).toISOString()
          : null,
        subscription_status: 'active',
      })
      .eq('id', profile.id);
  } catch (err) {
    logger.warn({
      message: 'handlePaymentSucceeded: failed to update renewal date',
      error: err.message,
    });
  }

  logger.info({
    message: 'handlePaymentSucceeded: payment recorded successfully',
    userId: profile.id,
    amount,
    charityAmount,
    prizePoolAmount,
  });
};


// Handle invoice.payment_failed webhook event
const handlePaymentFailed = async (invoice) => {
  const subscriptionId =
    invoice.subscription ||
    invoice.parent?.subscription_details?.subscription ||
    null;

  if (!subscriptionId) return;

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (error || !profile) {
    // Fallback by customer ID
    const { data: profileByCustomer } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('stripe_customer_id', invoice.customer)
      .single();

    if (!profileByCustomer) {
      logger.warn({
        message: 'handlePaymentFailed: profile not found',
        subscriptionId,
        customerId: invoice.customer,
      });
      return;
    }

    await supabaseAdmin
      .from('profiles')
      .update({ subscription_status: 'lapsed' })
      .eq('id', profileByCustomer.id);

    logger.warn({
      message: 'handlePaymentFailed: subscription lapsed',
      userId: profileByCustomer.id,
    });

    await sendPaymentFailedEmail({
      to: profileByCustomer.email,
      fullName: profileByCustomer.full_name,
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

  await sendPaymentFailedEmail({
    to: profile.email,
    fullName: profile.full_name,
  });
};
// Handle customer.subscription.updated webhook event
const handleSubscriptionUpdated = async (subscription) => {
  // Try finding profile by stripe_subscription_id
  let profile = null;

  const { data: profileBySubId } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (profileBySubId) {
    profile = profileBySubId;
  } else {
    // Fallback by customer ID
    const { data: profileByCustomer } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single();

    if (profileByCustomer) {
      profile = profileByCustomer;
    }
  }

  if (!profile) {
    logger.warn({
      message: 'handleSubscriptionUpdated: profile not found',
      subscriptionId: subscription.id,
      customerId: subscription.customer,
    });
    return;
  }

  const statusMap = {
    active: 'active',
    past_due: 'lapsed',
    canceled: 'cancelled',
    unpaid: 'lapsed',
    trialing: 'active',
  };

  // Stripe API 2026+ moved current_period_end to items level
  const periodEnd =
    subscription.current_period_end ??
    subscription.items?.data?.[0]?.current_period_end ??
    subscription.billing_cycle_anchor;

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: statusMap[subscription.status] || 'inactive',
      subscription_renewal_date: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
    })
    .eq('id', profile.id);

  logger.info({
    message: 'handleSubscriptionUpdated: profile updated',
    userId: profile.id,
    status: subscription.status,
  });
};

// Handle customer.subscription.deleted webhook event
const handleSubscriptionDeleted = async (subscription) => {
  let profile = null;

  const { data: profileBySubId } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (profileBySubId) {
    profile = profileBySubId;
  } else {
    const { data: profileByCustomer } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('stripe_customer_id', subscription.customer)
      .single();

    if (profileByCustomer) {
      profile = profileByCustomer;
    }
  }

  if (!profile) {
    logger.warn({
      message: 'handleSubscriptionDeleted: profile not found',
      subscriptionId: subscription.id,
    });
    return;
  }

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

  // Stripe API 2026+ moved current_period_end to items level
  const periodEnd =
    subscription.current_period_end ??
    subscription.items?.data?.[0]?.current_period_end ??
    subscription.billing_cycle_anchor;

  try {
    await sendCancellationConfirmedEmail({
      to: profile.email,
      fullName: profile.full_name,
      endDate: periodEnd
        ? new Date(periodEnd * 1000).toLocaleDateString('en-GB')
        : 'your billing period end date',
    });
  } catch (emailErr) {
    logger.warn({
      message: 'handleSubscriptionDeleted: email failed',
      error: emailErr.message,
    });
  }
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