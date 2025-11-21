// src/routes/post.routes.js
import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import { validatePost } from '../middlewares/validator.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // IMPORT

const router = Router();

// ... (GET routes can remain public)
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// PROTECT THIS ROUTE: A user must be logged in to create a post
router.post('/', authMiddleware, validatePost, postController.createPost);

export default router;