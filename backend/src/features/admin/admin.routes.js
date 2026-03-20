import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { validate } from '../../middleware/validate.js';
import { drawLimiter } from '../../config/rateLimit.js';
import {
  createDrawSchema,
  updateUserSchema,
  updateClaimSchema,
  createCharitySchema,
  updateCharitySchema,
} from './admin.validation.js';
import {
  overview,
  listUsers,
  getUser,
  editUser,
  removeUser,
  listDraws,
  newDraw,
  runSimulation,
  runPublish,
  listAllCharities,
  createCharity,
  editCharity,
  removeCharity,
  listClaims,
  updateClaim,
  analyticsOverview,
} from './admin.controller.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, adminOnly);

// ── OVERVIEW ──────────────────────────────────────────────────
router.get('/', overview);

// ── USERS ──────────────────────────────────────────────────────
router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', validate(updateUserSchema), editUser);
router.delete('/users/:id', removeUser);

// ── DRAWS ──────────────────────────────────────────────────────
router.get('/draws', listDraws);
router.post('/draws', validate(createDrawSchema), newDraw);
router.post('/draws/:id/simulate', drawLimiter, runSimulation);
router.post('/draws/:id/publish', runPublish);

// ── CHARITIES ─────────────────────────────────────────────────
router.get('/charities', listAllCharities);
router.post('/charities', validate(createCharitySchema), createCharity);
router.patch('/charities/:id', validate(updateCharitySchema), editCharity);
router.delete('/charities/:id', removeCharity);

// ── CLAIMS ────────────────────────────────────────────────────
router.get('/claims', listClaims);
router.patch('/claims/:id', validate(updateClaimSchema), updateClaim);

// ── ANALYTICS ─────────────────────────────────────────────────
router.get('/analytics', analyticsOverview);

export default router;