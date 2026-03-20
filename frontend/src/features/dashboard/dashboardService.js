import api from '../../lib/axios';

const getProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

const updateProfile = async (updates) => {
  const response = await api.patch('/users/me', updates);
  return response.data;
};

export const dashboardService = { getProfile, updateProfile };