import asyncHandler from '../../utils/asyncHandler.js';
import {
  getPublishedDraws,
  getDrawById,
  getUserDrawEntries,
  simulateDraw,
} from './draws.service.js';

// GET /api/draws
// Public — paginated list of published draws
const listDraws = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

  const result = await getPublishedDraws({ page, limit });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// GET /api/draws/:id
// Public — single published draw detail
const getDraw = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const draw = await getDrawById(id);

  res.status(200).json({
    success: true,
    data: draw,
  });
});

// GET /api/draws/my-entries
// Authenticated — user's own draw entry history
const getMyEntries = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

  const result = await getUserDrawEntries(req.user.id, { page, limit });

  res.status(200).json({
    success: true,
    ...result,
  });
});

export { listDraws, getDraw, getMyEntries };