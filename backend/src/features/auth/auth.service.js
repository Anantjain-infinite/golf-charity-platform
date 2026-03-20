import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';

const PROFILE_SELECT_FIELDS =
  'id, full_name, email, role, subscription_status, subscription_plan, charity_id';

const normaliseEmail = (email) => email.trim().toLowerCase();

const signup = async ({ email, password, full_name }) => {
  const normalisedEmail = normaliseEmail(email);

  // 1) Create Supabase auth user (service role / server-side admin API)
  const { data: createdUserResponse, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email: normalisedEmail,
      password,
      email_confirm: true, // Confirm email is disabled in schema setup; keep this for safety.
    });

  if (createUserError || !createdUserResponse?.user) {
    logger.warn({
      message: 'Signup: failed to create auth user',
      error: createUserError?.message,
      email: normalisedEmail,
    });

    // Supabase typically returns 400 for "user already registered".
    throw new ApiError(409, 'Email is already in use');
  }

  const userId = createdUserResponse.user.id;

  // 2) Create profile row (required by our app + auth middleware)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: userId,
      full_name,
      email: normalisedEmail,
    });

  if (profileError) {
    logger.error({
      message: 'Signup: failed to create profile row',
      error: profileError.message,
      userId,
    });

    // Best-effort cleanup to avoid orphaned auth user without a profile.
    try {
      await supabaseAdmin.auth.admin.deleteUser(userId);
    } catch {
      // Ignore cleanup errors; original profile error is more relevant.
    }

    throw new ApiError(500, 'Failed to create user profile');
  }

  // 3) Sign in immediately so the frontend can redirect to /dashboard.
  const { data: signInData, error: signInError } =
    await supabaseAdmin.auth.signInWithPassword({
      email: normalisedEmail,
      password,
    });

  if (signInError || !signInData?.session?.access_token) {
    logger.error({
      message: 'Signup: failed to sign in user after profile creation',
      error: signInError?.message,
      userId,
    });
    throw new ApiError(500, 'Failed to create session');
  }

  // 4) Return session token + profile (frontend can display name/role)
  const { data: profile, error: profileFetchError } = await supabaseAdmin
    .from('profiles')
    .select(PROFILE_SELECT_FIELDS)
    .eq('id', userId)
    .single();

  if (profileFetchError || !profile) {
    throw new ApiError(500, 'User profile not found after signup');
  }

  return {
    token: signInData.session.access_token,
    user: profile,
  };
};

const login = async ({ email, password }) => {
  const normalisedEmail = normaliseEmail(email);

  const { data: signInData, error: signInError } =
    await supabaseAdmin.auth.signInWithPassword({
      email: normalisedEmail,
      password,
    });

  if (signInError || !signInData?.session?.access_token) {
    logger.warn({
      message: 'Login: invalid credentials',
      error: signInError?.message,
      email: normalisedEmail,
    });
    throw new ApiError(401, 'Invalid email or password');
  }

  const userId = signInData.user.id;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select(PROFILE_SELECT_FIELDS)
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    throw new ApiError(401, 'User profile not found');
  }

  return {
    token: signInData.session.access_token,
    user: profile,
  };
};

const logout = async (token) => {
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  // Server-side sign out: revoke refresh tokens for this JWT.
  // Supabase notes access tokens can't be revoked until expiry, but refresh token revocation
  // is sufficient for "log out" UX in this app (frontend removes token immediately).
  const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(
    token,
    'global'
  );

  if (signOutError) {
    logger.warn({
      message: 'Logout: failed to revoke session',
      error: signOutError.message,
    });
    throw new ApiError(401, 'Invalid or expired token');
  }

  return { message: 'Logged out' };
};

export { signup, login, logout };

