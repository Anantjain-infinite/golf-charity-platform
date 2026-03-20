import { supabaseAdmin } from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';
import { cache, TTL, keys } from '../../config/cache.js';

const CHARITY_SELECT_FIELDS =
  'id, name, slug, description, logo_url, cover_image_url, website_url, is_featured, total_raised, upcoming_events';

// Get paginated list of active charities with optional search
const getCharities = async ({ page = 1, limit = 12, search = '' }) => {
  const cacheKey = keys.charitiesList() + `:page:${page}:limit:${limit}:search:${search}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    logger.info({ message: 'getCharities: cache hit', cacheKey });
    return cached;
  }

  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('charities')
    .select(CHARITY_SELECT_FIELDS, { count: 'exact' })
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (search && search.trim() !== '') {
    query = query.ilike('name', `%${search.trim()}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error({
      message: 'getCharities: query failed',
      error: error.message,
    });
    throw new ApiError(500, 'Failed to retrieve charities');
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

  cache.set(cacheKey, result, TTL.CHARITIES_LIST);

  return result;
};

// Get single charity by slug
const getCharityBySlug = async (slug) => {
  const cacheKey = keys.charityBySlug(slug);
  const cached = cache.get(cacheKey);

  if (cached) {
    logger.info({ message: 'getCharityBySlug: cache hit', slug });
    return cached;
  }

  const { data, error } = await supabaseAdmin
    .from('charities')
    .select(
      'id, name, slug, description, logo_url, cover_image_url, website_url, is_featured, total_raised, upcoming_events, created_at'
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    logger.warn({
      message: 'getCharityBySlug: not found',
      slug,
      error: error?.message,
    });
    throw new ApiError(404, 'Charity not found');
  }

  cache.set(cacheKey, data, TTL.CHARITY_DETAIL);

  return data;
};

// Get only featured charities (used on homepage)
const getFeaturedCharity = async () => {
  const cacheKey = 'charities:featured';
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const { data, error } = await supabaseAdmin
    .from('charities')
    .select(CHARITY_SELECT_FIELDS)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('total_raised', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    logger.warn({
      message: 'getFeaturedCharity: none found',
      error: error?.message,
    });
    return null;
  }

  cache.set(cacheKey, data, TTL.CHARITIES_LIST);

  return data;
};

export { getCharities, getCharityBySlug, getFeaturedCharity };