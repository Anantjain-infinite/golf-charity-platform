import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';
import { cache, TTL, keys } from '../../config/cache.js';
import { executeDraw, calculateMatchCount } from './drawEngine.js';
import { calculatePrizePools, splitPrize } from './prizeCalculator.js';

const DRAW_SELECT_FIELDS =
  'id, draw_month, drawn_numbers, draw_type, algorithm_mode, status, jackpot_amount, pool_4match, pool_3match, total_entries, jackpot_rolled_over, rollover_from_draw_id, published_at, created_at';

// Get all published draws paginated
const getPublishedDraws = async ({ page = 1, limit = 10 }) => {
  const cacheKey = keys.publishedDraws(page);
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('draws')
    .select(DRAW_SELECT_FIELDS, { count: 'exact' })
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error({
      message: 'getPublishedDraws: query failed',
      error: error.message,
    });
    throw new ApiError(500, 'Failed to retrieve draws');
  }

  const totalPages = Math.ceil((count || 0) / limit);

  const result = {
    data,
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };

  cache.set(cacheKey, result, TTL.DRAW_PUBLISHED);

  return result;
};

// Get single draw by id
const getDrawById = async (drawId) => {
  const cacheKey = keys.drawById(drawId);
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const { data, error } = await supabaseAdmin
    .from('draws')
    .select(DRAW_SELECT_FIELDS)
    .eq('id', drawId)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    throw new ApiError(404, 'Draw not found');
  }

  cache.set(cacheKey, data, TTL.DRAW_PUBLISHED);

  return data;
};

// Get authenticated user's draw entries paginated
const getUserDrawEntries = async (userId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('draw_entries')
    .select(
      'id, submitted_scores, match_count, is_winner, prize_amount, created_at, draws(id, draw_month, drawn_numbers, status, published_at)',
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error({
      message: 'getUserDrawEntries: query failed',
      userId,
      error: error.message,
    });
    throw new ApiError(500, 'Failed to retrieve draw history');
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data,
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

// Run draw simulation — does NOT save results to database
const simulateDraw = async (drawId) => {
  const { data: draw, error } = await supabaseAdmin
    .from('draws')
    .select(DRAW_SELECT_FIELDS)
    .eq('id', drawId)
    .single();

  if (error || !draw) {
    throw new ApiError(404, 'Draw not found');
  }

  if (draw.status === 'published') {
    throw new ApiError(409, 'Draw has already been published');
  }

  // Execute the draw algorithm
  const drawnNumbers = await executeDraw({
    drawType: draw.draw_type,
    algorithmMode: draw.algorithm_mode,
    drawMonth: draw.draw_month,
  });

  // Fetch all active subscribers with at least 1 score
  const { data: eligibleUsers, error: usersError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .eq('subscription_status', 'active');

  if (usersError) {
    throw new ApiError(500, 'Failed to fetch eligible users');
  }

  // Fetch scores for all eligible users
  const simulationEntries = [];

  for (const user of eligibleUsers) {
    const { data: scores } = await supabaseAdmin
      .from('scores')
      .select('score')
      .eq('user_id', user.id)
      .order('played_date', { ascending: false })
      .limit(5);

    if (!scores || scores.length === 0) continue;

    const userScores = scores.map((s) => s.score);
    const matchCount = calculateMatchCount(userScores, drawnNumbers);

    simulationEntries.push({
      userId: user.id,
      fullName: user.full_name,
      email: user.email,
      submittedScores: userScores,
      matchCount,
      isWinner: matchCount >= 3,
    });
  }

  // Group winners by tier
  const jackpotWinners = simulationEntries.filter((e) => e.matchCount === 5);
  const fourMatchWinners = simulationEntries.filter((e) => e.matchCount === 4);
  const threeMatchWinners = simulationEntries.filter((e) => e.matchCount === 3);

  // Calculate prize pools based on active subscriber count
  const monthlyRate = 9.99;
  const totalRevenue = eligibleUsers.length * monthlyRate;
  const rolloverAmount = draw.jackpot_amount || 0;
  const pools = calculatePrizePools(totalRevenue, rolloverAmount);

  const prizeBreakdown = {
    jackpot: {
      pool: pools.jackpot,
      winners: jackpotWinners.length,
      prizePerWinner: splitPrize(pools.jackpot, jackpotWinners.length),
      willRollover: jackpotWinners.length === 0,
    },
    fourMatch: {
      pool: pools.fourMatch,
      winners: fourMatchWinners.length,
      prizePerWinner: splitPrize(pools.fourMatch, fourMatchWinners.length),
    },
    threeMatch: {
      pool: pools.threeMatch,
      winners: threeMatchWinners.length,
      prizePerWinner: splitPrize(pools.threeMatch, threeMatchWinners.length),
    },
  };

  logger.info({
    message: 'simulateDraw: simulation completed',
    drawId,
    drawnNumbers,
    totalEntries: simulationEntries.length,
    jackpotWinners: jackpotWinners.length,
    fourMatchWinners: fourMatchWinners.length,
    threeMatchWinners: threeMatchWinners.length,
  });

  return {
    drawId,
    drawMonth: draw.draw_month,
    drawnNumbers,
    totalEntries: simulationEntries.length,
    prizeBreakdown,
    winners: {
      jackpot: jackpotWinners,
      fourMatch: fourMatchWinners,
      threeMatch: threeMatchWinners,
    },
  };
};

export {
  getPublishedDraws,
  getDrawById,
  getUserDrawEntries,
  simulateDraw,
};