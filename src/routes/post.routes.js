// src/routes/post.routes.js
import express from 'express';
import * as postController from '../controllers/post.controller.js';
import * as commentController from '../controllers/comment.controller.js';
import { validateComment } from '../middlewares/validator.middleware.js';  // <-- Import here

const router = express.Router();

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

router.post('/:postId/comments', validateComment, commentController.createCommentForPost);
router.get('/:postId/comments', commentController.getCommentsByPostId);

export const postRoutes = router;

