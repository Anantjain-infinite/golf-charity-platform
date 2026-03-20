import asyncHandler from '../../utils/asyncHandler.js';
import {
  getUserClaims,
  getUserWinningsTotal,
  submitClaimProof,
} from './claims.service.js';

// GET /api/claims
// Authenticated — returns user's own prize claims paginated
const listClaims = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

  const [result, totalWon] = await Promise.all([
    getUserClaims(req.user.id, { page, limit }),
    getUserWinningsTotal(req.user.id),
  ]);

  res.status(200).json({
    success: true,
    totalWon,
    ...result,
  });
});

// POST /api/claims/:id/proof
// Authenticated — upload proof image for a prize claim
const uploadProof = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
    });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(422).json({
      success: false,
      error: 'File must be an image (JPEG, PNG, or WebP)',
    });
  }

  const updated = await submitClaimProof(
    id,
    req.user.id,
    req.file.buffer,
    req.file.mimetype
  );

  res.status(200).json({
    success: true,
    data: updated,
    message: 'Proof uploaded successfully',
  });
});

export { listClaims, uploadProof };