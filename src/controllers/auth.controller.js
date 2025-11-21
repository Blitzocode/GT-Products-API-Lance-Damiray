import * as userService from '../services/user.service.js';
import asyncHandler from 'express-async-handler';

export const registerUser = asyncHandler(async (req, res) => {
  const newUser = await userService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const token = await userService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: "Login successful",
    token
  });
});
