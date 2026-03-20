import NodeCache from 'node-cache';

// TTL values in seconds
const TTL = {
  CHARITIES_LIST: 60 * 5, // 5 minutes — changes infrequently
  CHARITY_DETAIL: 60 * 10, // 10 minutes
  DRAW_PUBLISHED: 60 * 60, // 1 hour — published draws never change
  ANALYTICS: 60 * 5, // 5 minutes — acceptable staleness for dashboards
  PRIZE_POOL_PREVIEW: 60 * 2, // 2 minutes
};

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Cache key generators (consistent, collision-free)
const keys = {
  charitiesList: () => 'charities:list:active',
  charityBySlug: (slug) => `charity:slug:${slug}`,
  publishedDraws: (page) => `draws:published:page:${page}`,
  drawById: (id) => `draw:${id}`,
  prizePoolPreview: () => 'prize-pool:preview',
  analytics: (range) => `analytics:${range}`,
};

export { cache, TTL, keys };

