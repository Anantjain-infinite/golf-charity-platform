import api from '../../lib/axios';

const getPublishedDraws = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get('/draws', { params: { page, limit } });
  return response.data;
};

const getDrawById = async (id) => {
  const response = await api.get(`/draws/${id}`);
  return response.data;
};

const getMyDrawEntries = async ({ pageParam = 1 }) => {
  const response = await api.get('/draws/my-entries', {
    params: { page: pageParam, limit: 10 },
  });
  return response.data;
};

export const drawsService = {
  getPublishedDraws,
  getDrawById,
  getMyDrawEntries,
};