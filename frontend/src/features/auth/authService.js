import api from '../../lib/axios';

const signup = async ({ full_name, email, password }) => {
  const response = await api.post('/auth/signup', {
    full_name,
    email,
    password,
  });
  return response.data;
};

const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const authService = { signup, login, logout };