import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { getUserById } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Not authorized, no token provided');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw new ApiError(401, 'Not authorized, token invalid');
    }

    const user = await getUserById(decoded.id);
    if (!user) throw new ApiError(401, 'Not authorized, user not found');

    req.user = user;
    next();
});