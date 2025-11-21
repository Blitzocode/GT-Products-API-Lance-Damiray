import * as userService from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

console.log("AUTH CONTROLLER FILE LOADED"); // for debugging

export const loginUser = asyncHandler(async (req, res) => {
  const token = await userService.loginUser(req.body);
  res.status(200).json(new ApiResponse(200, { token }, 'User logged in successfully'));
});

export const registerUser = asyncHandler(async (req, res) => {
  const newUser = await userService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, newUser, 'User registered successfully'));
});
