// src/routes/comment.routes.js
import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

// Get all comments (independent of posts)
router.get('/', commentController.getAllComments);

// Get all comments for a specific post
router.get('/posts/:postId/comments', commentController.getCommentsByPostId);

// Create a comment for a specific post
router.post('/posts/:postId/comments', commentController.createCommentForPost);

export default router;
