import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../middleware/auth.js';
import { uploadLimiter } from '../../config/rateLimit.js';
import { listClaims, uploadProof } from './claims.controller.js';

// Use memory storage — file buffer passed directly to Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File must be an image (JPEG, PNG, or WebP)'), false);
    }
  },
});

const router = Router();

// All claims routes require authentication
router.use(authenticate);

// GET /api/claims
// Returns authenticated user's claims with total winnings
router.get('/', listClaims);

// POST /api/claims/:id/proof
// Upload proof image for a specific claim
router.post(
  '/:id/proof',
  uploadLimiter,
  upload.single('proof'),
  uploadProof
);

export default router;