import { Router } from 'express';
import { listCharities, featuredCharity, getCharity } from './charities.controller.js';

const router = Router();

// All charities routes are public — no authentication required

// GET /api/charities
// Paginated list with optional search query param
router.get('/', listCharities);

// GET /api/charities/featured
// Returns the featured charity for homepage spotlight
// Must be defined BEFORE /:slug to avoid "featured" being treated as a slug
router.get('/featured', featuredCharity);

// GET /api/charities/:slug
// Single charity detail page
router.get('/:slug', getCharity);

export default router;