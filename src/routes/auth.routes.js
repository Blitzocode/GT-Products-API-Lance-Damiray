import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegistration } from '../middlewares/validator.middleware.js';

const router = Router();

// Registration endpoint
router.post('/register', validateRegistration, authController.registerUser);

// Login endpoint
router.post('/login', authController.loginUser);

export default router;
