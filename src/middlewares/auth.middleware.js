// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { getUserById } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, no token provided' 
            });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, token invalid' 
            });
        }

        const user = await getUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, user not found' 
            });
        }

        req.user = user; // attach user to request
        next(); // proceed to the next middleware or route
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error in authentication middleware' 
        });
    }
};
