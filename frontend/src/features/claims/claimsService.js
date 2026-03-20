import api from '../../lib/axios';

const getMyClaims = async () => {
  const response = await api.get('/claims');
  return response.data;
};

const submitProof = async ({ claimId, file }) => {
  const formData = new FormData();
  formData.append('proof', file);
  const response = await api.post(`/claims/${claimId}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const claimsService = { getMyClaims, submitProof };