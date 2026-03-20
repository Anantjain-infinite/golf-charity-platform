import express from 'express';

import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/users/users.routes.js';
import scoresRoutes from './features/scores/scores.routes.js';
import charitiesRoutes from './features/charities/charities.routes.js';
import drawsRoutes from './features/draws/draws.routes.js';
import claimsRoutes from './features/claims/claims.routes.js';
import paymentsRoutes from './features/payments/payments.routes.js';
import adminRoutes from './features/admin/admin.routes.js';

const router = express.Router();

router.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/scores', scoresRoutes);
router.use('/charities', charitiesRoutes);
router.use('/draws', drawsRoutes);
router.use('/claims', claimsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/admin', adminRoutes);

export default router;

