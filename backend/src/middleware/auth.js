import { supabaseAdmin } from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  // Fetch profile to get role and subscription status
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role, subscription_status, subscription_plan, charity_id, full_name, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new ApiError(401, 'User profile not found');
  }

  req.user = { ...user, ...profile };
  next();
});

export { authenticate };

