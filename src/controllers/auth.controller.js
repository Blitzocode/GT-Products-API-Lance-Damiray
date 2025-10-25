import * as userService from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from 'express-async-handler';

export const registerUser = asyncHandler(async (req, res) => {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
});