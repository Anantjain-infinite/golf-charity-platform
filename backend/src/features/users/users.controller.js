import asyncHandler from '../../utils/asyncHandler.js';
import * as usersService from './users.service.js';

const getMe = asyncHandler(async (req, res) => {
  const profile = await usersService.getProfile(req.user.id);
  return res.status(200).json({ success: true, data: profile });
});

const patchMe = asyncHandler(async (req, res) => {
  const profile = await usersService.updateProfile(req.user.id, req.body);
  return res.status(200).json({ success: true, data: profile });
});

export { getMe, patchMe };

