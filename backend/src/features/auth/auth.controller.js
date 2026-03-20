import asyncHandler from '../../utils/asyncHandler.js';
import * as authService from './auth.service.js';

const signup = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;
  const result = await authService.signup({ email, password, full_name });
  return res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return res.status(200).json({ success: true, data: result });
});

const logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const result = await authService.logout(token);
  return res.status(200).json({ success: true, data: result });
});

export { signup, login, logout };

