import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegistration } from '../middlewares/validator.middleware.js';

const router = Router();

// Register route
router.post('/register', validateRegistration, authController.registerUser);

// Login route
router.post('/login', authController.loginUser);

export default router;
