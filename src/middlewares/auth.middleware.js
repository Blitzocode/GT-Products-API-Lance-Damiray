import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import { getUserById } from '../services/user.service.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await getUserById(decoded.id);
      return next();
    } catch (error) {
      throw new ApiError(401, 'Not authorized, token invalid');
    }
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }
});
