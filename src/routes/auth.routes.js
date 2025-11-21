// src/routes/auth.routes.js
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
// We'll add a new validator for login
import { validateRegistration } from '../middlewares/validator.middleware.js';

const router = Router();

router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', authController.loginUser); // ADD THIS ROUTE

export default router;
