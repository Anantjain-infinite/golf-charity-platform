import express from 'express';

import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';

import { updateProfileSchema } from './users.validation.js';
import { getMe, patchMe } from './users.controller.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validate(updateProfileSchema), patchMe);

export default router;

