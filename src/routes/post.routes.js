// src/routes/post.routes.js
import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import { validatePost } from '../middlewares/validator.middleware.js';

const router = Router();

router.post('/', validatePost, postController.createPost);
router.put('/:id', validatePost, postController.updatePost);
router.patch('/:id', postController.partiallyUpdatePost);
router.get('/:id', postController.getPostById);
router.delete('/:id', postController.deletePost);


export default router;
