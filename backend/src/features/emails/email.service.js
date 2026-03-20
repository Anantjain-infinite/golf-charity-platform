import { Resend } from 'resend';
import logger from '../../config/logger.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL;
const APP_NAME = process.env.APP_NAME || 'Golf Charity Club';

// Base send function — all emails go through here
const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (error) {
      logger.error({
        message: 'sendEmail: failed to send',
        to,
        subject,
        error: error.message,
      });
      return { success: false, error };
    }

    logger.info({
      message: 'sendEmail: sent successfully',
      to,
      subject,
      emailId: data?.id,
    });

    return { success: true, data };
  } catch (err) {
    logger.error({
      message: 'sendEmail: unexpected error',
      to,
      subject,
      error: err.message,
    });
    return { success: false, error: err };
  }
};

// 1. Welcome email — sent on signup
export const sendWelcomeEmail = async ({ to, fullName }) => {
  const { html } = await import('./templates/welcome.js');
  return sendEmail({
    to,
    subject: `Welcome to ${APP_NAME}`,
    html: html({ fullName, appName: APP_NAME }),
  });
};

// 2. Subscription confirmed — sent on checkout.session.completed
export const sendSubscriptionConfirmedEmail = async ({
  to,
  fullName,
  plan,
  renewalDate,
  charityName,
}) => {
  const { html } = await import('./templates/subscriptionConfirmed.js');
  return sendEmail({
    to,
    subject: `Your ${APP_NAME} subscription is confirmed`,
    html: html({ fullName, plan, renewalDate, charityName, appName: APP_NAME }),
  });
};

// 3. Payment failed — sent on invoice.payment_failed
export const sendPaymentFailedEmail = async ({ to, fullName }) => {
  const { html } = await import('./templates/paymentFailed.js');
  return sendEmail({
    to,
    subject: `Action required: Payment failed for ${APP_NAME}`,
    html: html({ fullName, appName: APP_NAME }),
  });
};

// 4. Draw results — sent to all entries on draw publish
export const sendDrawResultsEmail = async ({
  to,
  fullName,
  drawMonth,
  drawnNumbers,
  userScores,
  matchCount,
  prizeAmount,
}) => {
  const { html } = await import('./templates/drawResults.js');
  return sendEmail({
    to,
    subject: `${APP_NAME} — Draw results for ${drawMonth}`,
    html: html({
      fullName,
      drawMonth,
      drawnNumbers,
      userScores,
      matchCount,
      prizeAmount,
      appName: APP_NAME,
    }),
  });
};

// 5. You won — sent only to winners on draw publish
export const sendYouWonEmail = async ({
  to,
  fullName,
  drawMonth,
  matchCount,
  prizeAmount,
}) => {
  const { html } = await import('./templates/youWon.js');
  return sendEmail({
    to,
    subject: `You won in the ${APP_NAME} draw!`,
    html: html({
      fullName,
      drawMonth,
      matchCount,
      prizeAmount,
      appName: APP_NAME,
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
    }),
  });
};

// 6. Claim approved — sent when admin approves proof
export const sendClaimApprovedEmail = async ({
  to,
  fullName,
  prizeAmount,
  drawMonth,
}) => {
  const { html } = await import('./templates/claimApproved.js');
  return sendEmail({
    to,
    subject: `Your prize claim has been approved`,
    html: html({ fullName, prizeAmount, drawMonth, appName: APP_NAME }),
  });
};

// 7. Claim rejected — sent when admin rejects proof
export const sendClaimRejectedEmail = async ({
  to,
  fullName,
  drawMonth,
  adminNote,
}) => {
  const { html } = await import('./templates/claimRejected.js');
  return sendEmail({
    to,
    subject: `Update on your prize claim`,
    html: html({ fullName, drawMonth, adminNote, appName: APP_NAME }),
  });
};

// 8. Payment sent — sent when admin marks claim as paid
export const sendPaymentSentEmail = async ({
  to,
  fullName,
  prizeAmount,
  drawMonth,
}) => {
  const { html } = await import('./templates/paymentSent.js');
  return sendEmail({
    to,
    subject: `Your prize payment has been sent`,
    html: html({ fullName, prizeAmount, drawMonth, appName: APP_NAME }),
  });
};

// 9. Cancellation confirmed — sent on subscription deletion
export const sendCancellationConfirmedEmail = async ({
  to,
  fullName,
  endDate,
}) => {
  const { html } = await import('./templates/cancellationConfirmed.js');
  return sendEmail({
    to,
    subject: `Your ${APP_NAME} subscription has been cancelled`,
    html: html({
      fullName,
      endDate,
      appName: APP_NAME,
      resubscribeUrl: `${process.env.FRONTEND_URL}/subscribe`,
    }),
  });
};