import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { addScoreSchema, updateScoreSchema } from './scores.validation.js';
import {
  getScores,
  createScore,
  editScore,
  removeScore,
} from './scores.controller.js';

const router = Router();

// All scores routes require authentication
router.use(authenticate);

// GET /api/scores
// Returns authenticated user's current scores
router.get('/', getScores);

// POST /api/scores
// Adds a new score (DB trigger enforces rolling 5-score limit)
router.post('/', validate(addScoreSchema), createScore);

// PATCH /api/scores/:id
// Updates a specific score
router.patch('/:id', validate(updateScoreSchema), editScore);

// DELETE /api/scores/:id
// Deletes a specific score
router.delete('/:id', removeScore);

export default router;