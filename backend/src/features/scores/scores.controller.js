import asyncHandler from '../../utils/asyncHandler.js';
import {
  getUserScores,
  addScore,
  updateScore,
  deleteScore,
} from './scores.service.js';

// GET /api/scores
// Returns the authenticated user's current scores (max 5, most recent first)
const getScores = asyncHandler(async (req, res) => {
  const scores = await getUserScores(req.user.id);

  res.status(200).json({
    success: true,
    data: scores,
    count: scores.length,
  });
});

// POST /api/scores
// Adds a new score — DB trigger handles rolling 5-score limit automatically
const createScore = asyncHandler(async (req, res) => {
  const { score, played_date } = req.body;

  const newScore = await addScore(req.user.id, score, played_date);

  // Fetch updated list so frontend can sync immediately
  const updatedScores = await getUserScores(req.user.id);

  res.status(201).json({
    success: true,
    data: newScore,
    scores: updatedScores,
    message: 'Score saved successfully',
  });
});

// PATCH /api/scores/:id
// Updates a specific score — ownership enforced in service layer
const editScore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = await updateScore(id, req.user.id, updates);

  res.status(200).json({
    success: true,
    data: updated,
    message: 'Score updated successfully',
  });
});

// DELETE /api/scores/:id
// Deletes a specific score — ownership enforced in service layer
const removeScore = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteScore(id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Score removed successfully',
  });
});

export { getScores, createScore, editScore, removeScore };