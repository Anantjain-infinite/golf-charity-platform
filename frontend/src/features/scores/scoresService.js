import api from '../../lib/axios';

const getScores = async () => {
  const response = await api.get('/scores');
  return response.data;
};

const addScore = async ({ score, played_date }) => {
  const response = await api.post('/scores', { score, played_date });
  return response.data;
};

const updateScore = async ({ id, score, played_date }) => {
  const response = await api.patch(`/scores/${id}`, { score, played_date });
  return response.data;
};

const deleteScore = async (id) => {
  const response = await api.delete(`/scores/${id}`);
  return response.data;
};

export const scoresService = { getScores, addScore, updateScore, deleteScore };