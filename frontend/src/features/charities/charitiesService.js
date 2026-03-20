import api from '../../lib/axios';

const getCharities = async ({ pageParam = 1, search = '' } = {}) => {
  const response = await api.get('/charities', {
    params: { page: pageParam, limit: 12, search },
  });
  return response.data;
};

const getCharityBySlug = async (slug) => {
  const response = await api.get(`/charities/${slug}`);
  return response.data;
};

const getFeaturedCharity = async () => {
  const response = await api.get('/charities/featured');
  return response.data;
};

export const charitiesService = {
  getCharities,
  getCharityBySlug,
  getFeaturedCharity,
};