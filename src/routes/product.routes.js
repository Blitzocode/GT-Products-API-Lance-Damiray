import { authMiddleware } from '../middlewares/auth.middleware.js';
router.post('/', authMiddleware, productController.createProduct);
