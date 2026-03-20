import express from 'express';

import { authLimiter } from '../../config/rateLimit.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';

import { signupSchema, loginSchema } from './auth.validation.js';
import { signup, login, logout } from './auth.controller.js';

const router = express.Router();

// Rate-limited auth endpoints.
router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', authLimiter, authenticate, logout);

export default router;

