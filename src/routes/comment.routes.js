// src/routes/comment.routes.js
import { Router } from 'express';
import {
    getAllComments,
    getCommentsByPostId,
    createCommentForPost
} from '../controllers/comment.controller.js';
import { validateComment } from '../middlewares/validator.middleware.js';

const router = Router();

router.get('/', getAllComments);
router.get('/:postId/comments', getCommentsByPostId);
router.post('/:postId/comments', validateComment, createCommentForPost);

export default router;

