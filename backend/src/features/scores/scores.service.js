import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';

const SCORE_SELECT_FIELDS = 'id, score, played_date, created_at';

// Fetch user's current scores, most recent first (max 5 enforced by DB trigger)
const getUserScores = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .select(SCORE_SELECT_FIELDS)
    .eq('user_id', userId)
    .order('played_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    logger.error({
      message: 'getUserScores: failed to fetch scores',
      userId,
      error: error.message,
    });
    throw new ApiError(500, 'Failed to retrieve scores');
  }

  return data;
};

// Insert new score — DB trigger automatically removes oldest if count exceeds 5
const addScore = async (userId, scoreValue, playedDate) => {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .insert({
      user_id: userId,
      score: scoreValue,
      played_date: playedDate,
    })
    .select(SCORE_SELECT_FIELDS)
    .single();

  if (error) {
    logger.error({
      message: 'addScore: failed to insert score',
      userId,
      score: scoreValue,
      error: error.message,
    });
    throw new ApiError(500, 'Failed to save score');
  }

  logger.info({
    message: 'addScore: score added successfully',
    userId,
    score: scoreValue,
    played_date: playedDate,
  });

  return data;
};

// Update an existing score — eq user_id enforces ownership
const updateScore = async (scoreId, userId, updates) => {
  const updatePayload = {
    ...(updates.score !== undefined ? { score: updates.score } : {}),
    ...(updates.played_date !== undefined ? { played_date: updates.played_date } : {}),
  };

  const { data, error } = await supabaseAdmin
    .from('scores')
    .update(updatePayload)
    .eq('id', scoreId)
    .eq('user_id', userId)
    .select(SCORE_SELECT_FIELDS)
    .single();

  if (error || !data) {
    logger.warn({
      message: 'updateScore: score not found or access denied',
      scoreId,
      userId,
      error: error?.message,
    });
    throw new ApiError(404, 'Score not found or access denied');
  }

  logger.info({
    message: 'updateScore: score updated successfully',
    scoreId,
    userId,
  });

  return data;
};

// Delete a score — eq user_id enforces ownership
const deleteScore = async (scoreId, userId) => {
  // First check the score exists and belongs to this user
  const { data: existing, error: findError } = await supabaseAdmin
    .from('scores')
    .select('id')
    .eq('id', scoreId)
    .eq('user_id', userId)
    .single();

  if (findError || !existing) {
    throw new ApiError(404, 'Score not found or access denied');
  }

  const { error: deleteError } = await supabaseAdmin
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', userId);

  if (deleteError) {
    logger.error({
      message: 'deleteScore: failed to delete score',
      scoreId,
      userId,
      error: deleteError.message,
    });
    throw new ApiError(500, 'Failed to delete score');
  }

  logger.info({
    message: 'deleteScore: score deleted successfully',
    scoreId,
    userId,
  });
};

export { getUserScores, addScore, updateScore, deleteScore };