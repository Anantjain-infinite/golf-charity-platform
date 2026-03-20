import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';

const PROFILE_SELECT_FIELDS =
  'id, full_name, email, avatar_url, handicap, role, subscription_status, subscription_plan, subscription_renewal_date, charity_id, charity_contribution_percent';

const getProfile = async (userId) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select(PROFILE_SELECT_FIELDS)
    .eq('id', userId)
    .single();

  if (error || !profile) {
    logger.warn({ message: 'getProfile failed', userId, error: error?.message });
    throw new ApiError(404, 'User profile not found');
  }

  return profile;
};

// Ownership enforced by construction: only updates where `id = userId` (derived from auth middleware)
const updateProfile = async (userId, updates) => {
  // Make sure we only ever allow updates to known profile columns.
  const updatePayload = {
    ...(updates.full_name !== undefined ? { full_name: updates.full_name } : {}),
    ...(updates.avatar_url !== undefined ? { avatar_url: updates.avatar_url } : {}),
    ...(updates.charity_id !== undefined ? { charity_id: updates.charity_id } : {}),
    ...(updates.charity_contribution_percent !== undefined
      ? { charity_contribution_percent: updates.charity_contribution_percent }
      : {}),
  };

  // Defensive: schema should already prevent empty bodies, but avoid no-op updates.
  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(422, 'At least one profile field must be provided');
  }

  // Ownership check: verify profile exists for this userId before updating.
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existingError || !existing) {
    throw new ApiError(404, 'User profile not found');
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('profiles')
    .update(updatePayload)
    .eq('id', userId)
    .select(PROFILE_SELECT_FIELDS)
    .single();

  if (updateError || !updated) {
    logger.error({
      message: 'updateProfile failed',
      userId,
      error: updateError?.message,
    });
    throw new ApiError(500, 'Failed to update profile');
  }

  return updated;
};

export { getProfile, updateProfile };

