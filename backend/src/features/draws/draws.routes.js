import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { listDraws, getDraw, getMyEntries } from './draws.controller.js';

const router = Router();

// GET /api/draws
// Public — list all published draws
router.get('/', listDraws);

// GET /api/draws/my-entries
// Authenticated — must be defined BEFORE /:id to avoid conflict
router.get('/my-entries', authenticate, getMyEntries);

// GET /api/draws/:id
// Public — single draw detail
router.get('/:id', getDraw);

export default router;