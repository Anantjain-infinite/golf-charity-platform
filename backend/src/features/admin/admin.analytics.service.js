import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';
import { cache, TTL, keys } from '../../config/cache.js';

// Get overall KPI stats for admin overview
const getKpiStats = async () => {
  const cacheKey = 'admin:kpi';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const [
    { count: totalUsers },
    { count: activeSubscribers },
    { data: paymentTotals },
    { count: pendingClaims },
  ] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true }),

    supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active'),

    supabaseAdmin
      .from('payments')
      .select('prize_pool_contribution_amount, charity_contribution_amount')
      .eq('status', 'succeeded'),

    supabaseAdmin
      .from('prize_claims')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ]);

  const totalPrizePool = (paymentTotals || []).reduce(
    (sum, p) => sum + (p.prize_pool_contribution_amount || 0),
    0
  );

  const totalCharityRaised = (paymentTotals || []).reduce(
    (sum, p) => sum + (p.charity_contribution_amount || 0),
    0
  );

  const result = {
    totalUsers: totalUsers || 0,
    activeSubscribers: activeSubscribers || 0,
    totalPrizePool: parseFloat(totalPrizePool.toFixed(2)),
    totalCharityRaised: parseFloat(totalCharityRaised.toFixed(2)),
    pendingClaims: pendingClaims || 0,
  };

  cache.set(cacheKey, result, TTL.ANALYTICS);

  return result;
};

// Get recent signups for admin overview table
const getRecentSignups = async (limit = 10) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, subscription_status, subscription_plan, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ message: 'getRecentSignups: query failed', error: error.message });
    throw new ApiError(500, 'Failed to retrieve recent signups');
  }

  return data;
};

// Get analytics data for charts
const getAnalytics = async (range = '30d') => {
  const cacheKey = keys.analytics(range);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Calculate start date based on range
  const now = new Date();
  const startDate = new Date();

  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    case '12m':
      startDate.setMonth(now.getMonth() - 12);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  const startISO = startDate.toISOString();

  const [
    { data: signupData },
    { data: paymentData },
    { data: charityData },
    { data: drawData },
  ] = await Promise.all([
    // Subscriber growth
    supabaseAdmin
      .from('profiles')
      .select('created_at, subscription_status')
      .gte('created_at', startISO)
      .order('created_at', { ascending: true }),

    // Monthly prize pool totals
    supabaseAdmin
      .from('payments')
      .select('prize_pool_contribution_amount, created_at')
      .eq('status', 'succeeded')
      .gte('created_at', startISO)
      .order('created_at', { ascending: true }),

    // Charity contribution breakdown
    supabaseAdmin
      .from('payments')
      .select('charity_contribution_amount, profiles!inner(charity_id, charities(name))')
      .eq('status', 'succeeded')
      .gte('created_at', startISO),

    // Draw match distribution
    supabaseAdmin
      .from('draw_entries')
      .select('match_count, draws!inner(draw_month, status)')
      .eq('draws.status', 'published')
      .gte('created_at', startISO),
  ]);

  // Process subscriber growth by day
  const signupsByDay = {};
  (signupData || []).forEach((p) => {
    const day = p.created_at.split('T')[0];
    signupsByDay[day] = (signupsByDay[day] || 0) + 1;
  });

  // Process prize pool by month
  const poolByMonth = {};
  (paymentData || []).forEach((p) => {
    const month = p.created_at.substring(0, 7);
    poolByMonth[month] = (poolByMonth[month] || 0) + (p.prize_pool_contribution_amount || 0);
  });

  // Process charity contributions by charity name
  const charityTotals = {};
  (charityData || []).forEach((p) => {
    const name = p.profiles?.charities?.name || 'Unknown';
    charityTotals[name] = (charityTotals[name] || 0) + (p.charity_contribution_amount || 0);
  });

  // Process draw match distribution
  const matchDistribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (drawData || []).forEach((e) => {
    matchDistribution[e.match_count] = (matchDistribution[e.match_count] || 0) + 1;
  });

  const result = {
    subscriberGrowth: Object.entries(signupsByDay).map(([date, count]) => ({
      date,
      count,
    })),
    prizePoolByMonth: Object.entries(poolByMonth).map(([month, total]) => ({
      month,
      total: parseFloat(total.toFixed(2)),
    })),
    charityBreakdown: Object.entries(charityTotals).map(([name, total]) => ({
      name,
      total: parseFloat(total.toFixed(2)),
    })),
    matchDistribution: Object.entries(matchDistribution).map(([match, count]) => ({
      match: parseInt(match),
      count,
    })),
  };

  cache.set(cacheKey, result, TTL.ANALYTICS);

  return result;
};

export { getKpiStats, getRecentSignups, getAnalytics };