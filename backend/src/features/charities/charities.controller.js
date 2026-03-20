import asyncHandler from '../../utils/asyncHandler.js';
import {
  getCharities,
  getCharityBySlug,
  getFeaturedCharity,
} from './charities.service.js';

// GET /api/charities
// Public — paginated list with optional search
const listCharities = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;

  const result = await getCharities({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 12,
    search: search || '',
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// GET /api/charities/featured
// Public — returns the single featured charity for homepage
const featuredCharity = asyncHandler(async (req, res) => {
  const charity = await getFeaturedCharity();

  res.status(200).json({
    success: true,
    data: charity,
  });
});

// GET /api/charities/:slug
// Public — single charity detail
const getCharity = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const charity = await getCharityBySlug(slug);

  res.status(200).json({
    success: true,
    data: charity,
  });
});

export { listCharities, featuredCharity, getCharity };