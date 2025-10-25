import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegistration } from '../middlewares/validator.middleware.js';

const router = Router();

router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', authController.loginUser); // ✅ new route

export default router;

