import api from '../../lib/axios';

const createCheckoutSession = async ({ plan, charity_id }) => {
  const response = await api.post('/payments/create-checkout-session', {
    plan,
    charity_id,
  });
  return response.data;
};

export const subscribeService = { createCheckoutSession };