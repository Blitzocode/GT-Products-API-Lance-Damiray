// src/routes/post.routes.js
import * as postController from '../controllers/post.controller.js';
import { validatePost } from '../middlewares/validator.middleware.js';
import { Router } from 'express';
import { partiallyUpdatePost } from '../controllers/post.controller.js';  // Adjust path if needed


const router = Router();

router.patch('/posts/:id', partiallyUpdatePost);

router.post('/', validatePost, postController.createPost);
router.put('/:id', validatePost, postController.updatePost);
router.patch('/:id', postController.partiallyUpdatePost);
router.get('/:id', postController.getPostById);
router.delete('/:id', postController.deletePost);


export default router;
