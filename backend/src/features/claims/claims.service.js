import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';

const CLAIM_SELECT_FIELDS =
  'id, status, proof_url, admin_note, submitted_at, reviewed_at, paid_at, draw_entry_id, draw_entries(id, match_count, prize_amount, submitted_scores, draws(id, draw_month, drawn_numbers))';

// Get all claims for the authenticated user paginated
const getUserClaims = async (userId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('prize_claims')
    .select(CLAIM_SELECT_FIELDS, { count: 'exact' })
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error({
      message: 'getUserClaims: query failed',
      userId,
      error: error.message,
    });
    throw new ApiError(500, 'Failed to retrieve claims');
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

// Get total winnings for the authenticated user
const getUserWinningsTotal = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('prize_claims')
    .select('draw_entries(prize_amount)')
    .eq('user_id', userId)
    .in('status', ['approved', 'paid']);

  if (error) {
    logger.error({
      message: 'getUserWinningsTotal: query failed',
      userId,
      error: error.message,
    });
    throw new ApiError(500, 'Failed to retrieve winnings total');
  }

  const total = data.reduce((sum, claim) => {
    return sum + (claim.draw_entries?.prize_amount || 0);
  }, 0);

  return parseFloat(total.toFixed(2));
};

// Upload proof for a prize claim
const submitClaimProof = async (claimId, userId, fileBuffer, mimeType) => {
  // Verify claim belongs to this user and is in pending status
  const { data: claim, error: claimError } = await supabaseAdmin
    .from('prize_claims')
    .select('id, status, user_id')
    .eq('id', claimId)
    .eq('user_id', userId)
    .single();

  if (claimError || !claim) {
    throw new ApiError(404, 'Claim not found or access denied');
  }

  if (claim.status !== 'pending') {
    throw new ApiError(409, `Claim is already ${claim.status} and cannot be updated`);
  }

  // Upload file to Supabase Storage
  const fileExtension = mimeType === 'image/png' ? 'png' : 'jpg';
  const filePath = `${userId}/${claimId}.${fileExtension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('prize-proofs')
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    logger.error({
      message: 'submitClaimProof: upload failed',
      claimId,
      userId,
      error: uploadError.message,
    });
    throw new ApiError(500, 'Failed to upload proof file');
  }

  // Get the public URL of the uploaded file
  const { data: urlData } = supabaseAdmin.storage
    .from('prize-proofs')
    .getPublicUrl(filePath);

  // Update claim with proof URL
  const { data: updated, error: updateError } = await supabaseAdmin
    .from('prize_claims')
    .update({ proof_url: urlData.publicUrl })
    .eq('id', claimId)
    .eq('user_id', userId)
    .select(CLAIM_SELECT_FIELDS)
    .single();

  if (updateError || !updated) {
    logger.error({
      message: 'submitClaimProof: failed to update claim',
      claimId,
      userId,
      error: updateError?.message,
    });
    throw new ApiError(500, 'Failed to update claim with proof');
  }

  logger.info({
    message: 'submitClaimProof: proof uploaded successfully',
    claimId,
    userId,
  });

  return updated;
};

export { getUserClaims, getUserWinningsTotal, submitClaimProof };