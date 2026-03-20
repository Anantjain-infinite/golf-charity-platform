import api from '../../lib/axios';

// Overview
const getOverview = async () => {
  const response = await api.get('/admin');
  return response.data;
};

// Users
const getUsers = async ({ pageParam = 1, search = '', status = '' } = {}) => {
  const response = await api.get('/admin/users', {
    params: { page: pageParam, limit: 20, search, status },
  });
  return response.data;
};

const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

const updateUser = async ({ id, ...updates }) => {
  const response = await api.patch(`/admin/users/${id}`, updates);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// Draws
const getDraws = async ({ page = 1 } = {}) => {
  const response = await api.get('/admin/draws', { params: { page } });
  return response.data;
};

const createDraw = async (data) => {
  const response = await api.post('/admin/draws', data);
  return response.data;
};

const simulateDraw = async (id) => {
  const response = await api.post(`/admin/draws/${id}/simulate`);
  return response.data;
};

const publishDraw = async (id) => {
  const response = await api.post(`/admin/draws/${id}/publish`);
  return response.data;
};

// Charities
const getAllCharities = async ({ page = 1 } = {}) => {
  const response = await api.get('/admin/charities', { params: { page } });
  return response.data;
};

const createCharity = async (data) => {
  const response = await api.post('/admin/charities', data);
  return response.data;
};

const updateCharity = async ({ id, ...updates }) => {
  const response = await api.patch(`/admin/charities/${id}`, updates);
  return response.data;
};

const deleteCharity = async (id) => {
  const response = await api.delete(`/admin/charities/${id}`);
  return response.data;
};

// Claims
const getClaims = async ({ page = 1, status = '' } = {}) => {
  const response = await api.get('/admin/claims', {
    params: { page, limit: 20, status },
  });
  return response.data;
};

const updateClaim = async ({ id, status, admin_note }) => {
  const response = await api.patch(`/admin/claims/${id}`, { status, admin_note });
  return response.data;
};

// Analytics
const getAnalytics = async (range = '30d') => {
  const response = await api.get('/admin/analytics', { params: { range } });
  return response.data;
};

export const adminService = {
  getOverview,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDraws,
  createDraw,
  simulateDraw,
  publishDraw,
  getAllCharities,
  createCharity,
  updateCharity,
  deleteCharity,
  getClaims,
  updateClaim,
  getAnalytics,
};