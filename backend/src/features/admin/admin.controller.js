import asyncHandler from '../../utils/asyncHandler.js';
import { getKpiStats, getRecentSignups, getAnalytics } from './admin.analytics.service.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllDraws,
  createDraw,
  simulateDraw,
  publishDraw,
  adminGetAllCharities,
  adminCreateCharity,
  adminUpdateCharity,
  adminDeleteCharity,
  adminGetClaims,
  adminUpdateClaim,
} from './admin.service.js';

// ── OVERVIEW ──────────────────────────────────────────────────

export const overview = asyncHandler(async (req, res) => {
  const [kpi, recentSignups] = await Promise.all([
    getKpiStats(),
    getRecentSignups(10),
  ]);

  res.status(200).json({
    success: true,
    data: { kpi, recentSignups },
  });
});

// ── USERS ──────────────────────────────────────────────────────

export const listUsers = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
  const { search, status } = req.query;

  const result = await getUsers({ page, limit, search, status });

  res.status(200).json({ success: true, ...result });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

export const editUser = asyncHandler(async (req, res) => {
  const updated = await updateUser(req.params.id, req.body);
  res.status(200).json({ success: true, data: updated, message: 'User updated' });
});

export const removeUser = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);
  res.status(200).json({ success: true, message: 'User deleted' });
});

// ── DRAWS ──────────────────────────────────────────────────────

export const listDraws = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

  const result = await getAllDraws({ page, limit });
  res.status(200).json({ success: true, ...result });
});

export const newDraw = asyncHandler(async (req, res) => {
  const draw = await createDraw(req.body);
  res.status(201).json({ success: true, data: draw, message: 'Draw created' });
});

export const runSimulation = asyncHandler(async (req, res) => {
  const result = await simulateDraw(req.params.id);
  res.status(200).json({ success: true, data: result });
});

export const runPublish = asyncHandler(async (req, res) => {
  const result = await publishDraw(req.params.id);
  res.status(200).json({
    success: true,
    data: result,
    message: 'Draw published and winner emails sent',
  });
});

// ── CHARITIES ─────────────────────────────────────────────────

export const listAllCharities = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;

  const result = await adminGetAllCharities({ page, limit });
  res.status(200).json({ success: true, ...result });
});

export const createCharity = asyncHandler(async (req, res) => {
  const charity = await adminCreateCharity(req.body);
  res.status(201).json({ success: true, data: charity, message: 'Charity created' });
});

export const editCharity = asyncHandler(async (req, res) => {
  const updated = await adminUpdateCharity(req.params.id, req.body);
  res.status(200).json({ success: true, data: updated, message: 'Charity updated' });
});

export const removeCharity = asyncHandler(async (req, res) => {
  await adminDeleteCharity(req.params.id);
  res.status(200).json({ success: true, message: 'Charity deactivated' });
});

// ── CLAIMS ────────────────────────────────────────────────────

export const listClaims = asyncHandler(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
  const { status } = req.query;

  const result = await adminGetClaims({ page, limit, status });
  res.status(200).json({ success: true, ...result });
});

export const updateClaim = asyncHandler(async (req, res) => {
  const updated = await adminUpdateClaim(req.params.id, req.body);
  res.status(200).json({ success: true, data: updated, message: 'Claim updated' });
});

// ── ANALYTICS ─────────────────────────────────────────────────

export const analyticsOverview = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const result = await getAnalytics(range || '30d');
  res.status(200).json({ success: true, data: result });
});