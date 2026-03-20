import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';
import { cache } from '../../config/cache.js';
import { executeDraw, calculateMatchCount } from '../draws/drawEngine.js';
import { calculatePrizePools, splitPrize } from '../draws/prizeCalculator.js';
import {
  sendDrawResultsEmail,
  sendYouWonEmail,
  sendClaimApprovedEmail,
  sendClaimRejectedEmail,
  sendPaymentSentEmail,
} from '../emails/email.service.js';

// ── USERS ──────────────────────────────────────────────────────

const getUsers = async ({ page = 1, limit = 20, search = '', status }) => {
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('profiles')
    .select(
      'id, full_name, email, role, subscription_status, subscription_plan, charity_id, created_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search && search.trim() !== '') {
    query = query.or(
      `full_name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`
    );
  }

  if (status) {
    query = query.eq('subscription_status', status);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error({ message: 'admin getUsers: query failed', error: error.message });
    throw new ApiError(500, 'Failed to retrieve users');
  }

  return {
    data,
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: page * limit < (count || 0),
      hasPrevPage: page > 1,
    },
  };
};

const getUserById = async (userId) => {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select(
      'id, full_name, email, avatar_url, handicap, role, subscription_status, subscription_plan, subscription_renewal_date, charity_id, charity_contribution_percent, stripe_customer_id, created_at, charities(id, name, slug)'
    )
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    throw new ApiError(404, 'User not found');
  }

  const { data: scores } = await supabaseAdmin
    .from('scores')
    .select('id, score, played_date, created_at')
    .eq('user_id', userId)
    .order('played_date', { ascending: false })
    .limit(5);

  return { ...profile, scores: scores || [] };
};

const updateUser = async (userId, updates) => {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existingError || !existing) {
    throw new ApiError(404, 'User not found');
  }

  const allowedFields = [
    'full_name',
    'avatar_url',
    'charity_id',
    'charity_contribution_percent',
    'subscription_status',
    'role',
  ];

  const updatePayload = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      updatePayload[field] = updates[field];
    }
  });

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(422, 'No valid fields provided for update');
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updatePayload)
    .eq('id', userId)
    .select('id, full_name, email, role, subscription_status')
    .single();

  if (error || !data) {
    logger.error({ message: 'admin updateUser: failed', userId, error: error?.message });
    throw new ApiError(500, 'Failed to update user');
  }

  return data;
};

const deleteUser = async (userId) => {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existingError || !existing) {
    throw new ApiError(404, 'User not found');
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    logger.error({ message: 'admin deleteUser: failed', userId, error: error.message });
    throw new ApiError(500, 'Failed to delete user');
  }

  logger.info({ message: 'admin deleteUser: deleted', userId });
};

// ── DRAWS ──────────────────────────────────────────────────────

const getAllDraws = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('draws')
    .select(
      'id, draw_month, drawn_numbers, draw_type, algorithm_mode, status, jackpot_amount, pool_4match, pool_3match, total_entries, jackpot_rolled_over, published_at, created_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new ApiError(500, 'Failed to retrieve draws');
  }

  return {
    data,
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: page * limit < (count || 0),
      hasPrevPage: page > 1,
    },
  };
};

const createDraw = async ({ draw_month, draw_type, algorithm_mode }) => {
  // Check draw for this month does not already exist
  const { data: existing } = await supabaseAdmin
    .from('draws')
    .select('id')
    .eq('draw_month', draw_month)
    .single();

  if (existing) {
    throw new ApiError(409, `A draw for ${draw_month} already exists`);
  }

  // Check for previous jackpot rollover
  const { data: lastDraw } = await supabaseAdmin
    .from('draws')
    .select('jackpot_amount, jackpot_rolled_over')
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .limit(1)
    .single();

  const rolloverAmount =
    lastDraw?.jackpot_rolled_over ? lastDraw.jackpot_amount : 0;

  const { data, error } = await supabaseAdmin
    .from('draws')
    .insert({
      draw_month,
      draw_type,
      algorithm_mode: algorithm_mode || null,
      drawn_numbers: [],
      status: 'draft',
      jackpot_amount: rolloverAmount,
    })
    .select()
    .single();

  if (error || !data) {
    logger.error({ message: 'admin createDraw: failed', error: error?.message });
    throw new ApiError(500, 'Failed to create draw');
  }

  logger.info({ message: 'admin createDraw: created', drawId: data.id, draw_month });

  return data;
};

const simulateDraw = async (drawId) => {
  const { data: draw, error } = await supabaseAdmin
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single();

  if (error || !draw) {
    throw new ApiError(404, 'Draw not found');
  }

  if (draw.status === 'published') {
    throw new ApiError(409, 'Draw has already been published');
  }

  const drawnNumbers = await executeDraw({
    drawType: draw.draw_type,
    algorithmMode: draw.algorithm_mode,
    drawMonth: draw.draw_month,
  });

  // Fetch eligible users (active subscribers with at least 1 score)
  const { data: eligibleUsers } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .eq('subscription_status', 'active');

  const simulationEntries = [];

  for (const user of eligibleUsers || []) {
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

  const jackpotWinners = simulationEntries.filter((e) => e.matchCount === 5);
  const fourMatchWinners = simulationEntries.filter((e) => e.matchCount === 4);
  const threeMatchWinners = simulationEntries.filter((e) => e.matchCount === 3);

  const monthlyRate = 9.99;
  const totalRevenue = (eligibleUsers || []).length * monthlyRate;
  const pools = calculatePrizePools(totalRevenue, draw.jackpot_amount || 0);

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

  // Update draw with simulated numbers and status
  await supabaseAdmin
    .from('draws')
    .update({
      drawn_numbers: drawnNumbers,
      status: 'simulated',
      jackpot_amount: pools.jackpot,
      pool_4match: pools.fourMatch,
      pool_3match: pools.threeMatch,
      total_entries: simulationEntries.length,
    })
    .eq('id', drawId);

  logger.info({
    message: 'admin simulateDraw: simulation complete',
    drawId,
    drawnNumbers,
    totalEntries: simulationEntries.length,
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

const publishDraw = async (drawId) => {
  const { data: draw, error } = await supabaseAdmin
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single();

  if (error || !draw) {
    throw new ApiError(404, 'Draw not found');
  }

  if (draw.status === 'published') {
    throw new ApiError(409, 'Draw has already been published');
  }

  if (draw.status !== 'simulated') {
    throw new ApiError(400, 'Draw must be simulated before publishing');
  }

  // Fetch all eligible users with their scores
  const { data: eligibleUsers } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .eq('subscription_status', 'active');

  const entries = [];

  for (const user of eligibleUsers || []) {
    const { data: scores } = await supabaseAdmin
      .from('scores')
      .select('score')
      .eq('user_id', user.id)
      .order('played_date', { ascending: false })
      .limit(5);

    if (!scores || scores.length === 0) continue;

    const userScores = scores.map((s) => s.score);
    const matchCount = calculateMatchCount(userScores, draw.drawn_numbers);

    entries.push({
      draw_id: drawId,
      user_id: user.id,
      submitted_scores: userScores,
      match_count: matchCount,
      is_winner: matchCount >= 3,
      prize_amount: null,
    });
  }

  // Calculate prize amounts for winners
  const jackpotWinners = entries.filter((e) => e.match_count === 5);
  const fourMatchWinners = entries.filter((e) => e.match_count === 4);
  const threeMatchWinners = entries.filter((e) => e.match_count === 3);

  const jackpotPrize = splitPrize(draw.jackpot_amount, jackpotWinners.length);
  const fourMatchPrize = splitPrize(draw.pool_4match, fourMatchWinners.length);
  const threeMatchPrize = splitPrize(draw.pool_3match, threeMatchWinners.length);

  // Assign prize amounts
  entries.forEach((entry) => {
    if (entry.match_count === 5) entry.prize_amount = jackpotPrize;
    else if (entry.match_count === 4) entry.prize_amount = fourMatchPrize;
    else if (entry.match_count === 3) entry.prize_amount = threeMatchPrize;
  });

  // Save all draw entries
  if (entries.length > 0) {
    const { error: entriesError } = await supabaseAdmin
      .from('draw_entries')
      .insert(entries);

    if (entriesError) {
      logger.error({
        message: 'admin publishDraw: failed to save entries',
        drawId,
        error: entriesError.message,
      });
      throw new ApiError(500, 'Failed to save draw entries');
    }
  }

  // Create prize claims for all winners
  const winners = entries.filter((e) => e.is_winner);

  if (winners.length > 0) {
    // Fetch the draw entry IDs that were just inserted
    const { data: savedEntries } = await supabaseAdmin
      .from('draw_entries')
      .select('id, user_id, match_count')
      .eq('draw_id', drawId)
      .eq('is_winner', true);

    const claims = (savedEntries || []).map((entry) => ({
      draw_entry_id: entry.id,
      user_id: entry.user_id,
      status: 'pending',
    }));

    if (claims.length > 0) {
      await supabaseAdmin.from('prize_claims').insert(claims);
    }
  }

  // Determine jackpot rollover
  const jackpotRolledOver = jackpotWinners.length === 0;

  // Update draw status to published
  await supabaseAdmin
    .from('draws')
    .update({
      status: 'published',
      jackpot_rolled_over: jackpotRolledOver,
      total_entries: entries.length,
      published_at: new Date().toISOString(),
    })
    .eq('id', drawId);

  logger.info({
    message: 'admin publishDraw: published',
    drawId,
    totalEntries: entries.length,
    winners: winners.length,
    jackpotRolledOver,
  });

  // Send emails to all entries asynchronously
  const userMap = {};
  (eligibleUsers || []).forEach((u) => { userMap[u.id] = u; });

  const drawMonthLabel = draw.draw_month;

  // Fire and forget — do not await so response is not delayed
  Promise.allSettled(
    entries.map(async (entry) => {
      const user = userMap[entry.user_id];
      if (!user) return;

      if (entry.is_winner) {
        await sendYouWonEmail({
          to: user.email,
          fullName: user.full_name,
          drawMonth: drawMonthLabel,
          matchCount: entry.match_count,
          prizeAmount: entry.prize_amount,
        });
      } else {
        await sendDrawResultsEmail({
          to: user.email,
          fullName: user.full_name,
          drawMonth: drawMonthLabel,
          drawnNumbers: draw.drawn_numbers,
          userScores: entry.submitted_scores,
          matchCount: entry.match_count,
          prizeAmount: null,
        });
      }
    })
  );

  return {
    drawId,
    drawMonth: draw.draw_month,
    totalEntries: entries.length,
    winners: winners.length,
    jackpotRolledOver,
  };
};

// ── CHARITIES ─────────────────────────────────────────────────

const adminGetAllCharities = async ({ page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('charities')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new ApiError(500, 'Failed to retrieve charities');
  }

  return {
    data,
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: page * limit < (count || 0),
      hasPrevPage: page > 1,
    },
  };
};

const adminCreateCharity = async (charityData) => {
  const { data, error } = await supabaseAdmin
    .from('charities')
    .insert(charityData)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new ApiError(409, 'A charity with this slug already exists');
    }
    logger.error({ message: 'adminCreateCharity: failed', error: error.message });
    throw new ApiError(500, 'Failed to create charity');
  }

  // Invalidate charities cache
  cache.flushAll();

  return data;
};

const adminUpdateCharity = async (charityId, updates) => {
  const { data, error } = await supabaseAdmin
    .from('charities')
    .update(updates)
    .eq('id', charityId)
    .select()
    .single();

  if (error || !data) {
    throw new ApiError(404, 'Charity not found');
  }

  // Invalidate charities cache
  cache.flushAll();

  return data;
};

const adminDeleteCharity = async (charityId) => {
  // Soft delete — set is_active to false
  const { error } = await supabaseAdmin
    .from('charities')
    .update({ is_active: false })
    .eq('id', charityId);

  if (error) {
    throw new ApiError(404, 'Charity not found');
  }

  cache.flushAll();
};

// ── CLAIMS ────────────────────────────────────────────────────

const adminGetClaims = async ({ page = 1, limit = 20, status }) => {
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('prize_claims')
    .select(
      'id, status, proof_url, admin_note, submitted_at, reviewed_at, paid_at, user_id, draw_entry_id, profiles(full_name, email), draw_entries(match_count, prize_amount, draws(draw_month))',
      { count: 'exact' }
    )
    .order('submitted_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error({ message: 'adminGetClaims: query failed', error: error.message });
    throw new ApiError(500, 'Failed to retrieve claims');
  }

  return {
    data,
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: page * limit < (count || 0),
      hasPrevPage: page > 1,
    },
  };
};

const adminUpdateClaim = async (claimId, { status, admin_note }) => {
  const { data: claim, error: claimError } = await supabaseAdmin
    .from('prize_claims')
    .select(
      'id, status, user_id, draw_entry_id, profiles(full_name, email), draw_entries(prize_amount, draws(draw_month))'
    )
    .eq('id', claimId)
    .single();

  if (claimError || !claim) {
    throw new ApiError(404, 'Claim not found');
  }

  const updatePayload = {
    status,
    reviewed_at: new Date().toISOString(),
    ...(admin_note !== undefined ? { admin_note } : {}),
    ...(status === 'paid' ? { paid_at: new Date().toISOString() } : {}),
  };

  const { data, error } = await supabaseAdmin
    .from('prize_claims')
    .update(updatePayload)
    .eq('id', claimId)
    .select()
    .single();

  if (error || !data) {
    throw new ApiError(500, 'Failed to update claim');
  }

  // Send email based on new status
  const userEmail = claim.profiles?.email;
  const userName = claim.profiles?.full_name;
  const prizeAmount = claim.draw_entries?.prize_amount;
  const drawMonth = claim.draw_entries?.draws?.draw_month;

  if (userEmail) {
    if (status === 'approved') {
      await sendClaimApprovedEmail({
        to: userEmail,
        fullName: userName,
        prizeAmount,
        drawMonth,
      });
    } else if (status === 'rejected') {
      await sendClaimRejectedEmail({
        to: userEmail,
        fullName: userName,
        drawMonth,
        adminNote: admin_note,
      });
    } else if (status === 'paid') {
      await sendPaymentSentEmail({
        to: userEmail,
        fullName: userName,
        prizeAmount,
        drawMonth,
      });
    }
  }

  logger.info({
    message: 'adminUpdateClaim: updated',
    claimId,
    status,
  });

  return data;
};

export {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllDraws,
  createDraw,
  simulateDraw,
  publishDraw,
  adminGetAllCharities,
  adminCreateCharity,
  adminUpdateCharity,
  adminDeleteCharity,
  adminGetClaims,
  adminUpdateClaim,
};