export const SCORE_MIN = 1;
export const SCORE_MAX = 45;

export const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    currency: 'GBP',
    interval: 'month',
    description: 'Billed monthly',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    price: 99.99,
    currency: 'GBP',
    interval: 'year',
    description: 'Billed annually',
    savings: 'Save 17%',
  },
};

export const POOL_SPLITS = {
  jackpot: 0.40,
  fourMatch: 0.35,
  threeMatch: 0.25,
};

export const MIN_CHARITY_PERCENT = 10;
export const MAX_CHARITY_PERCENT = 100;

export const SUBSCRIPTION_STATUSES = {
  active: 'active',
  inactive: 'inactive',
  cancelled: 'cancelled',
  lapsed: 'lapsed',
};

export const CLAIM_STATUSES = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  paid: 'paid',
};

export const DRAW_TYPES = {
  random: 'random',
  algorithmic: 'algorithmic',
};

export const ALGORITHM_MODES = {
  frequent: 'frequent',
  rare: 'rare',
};