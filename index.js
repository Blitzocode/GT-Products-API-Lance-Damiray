import dotenv from 'dotenv';
import express from 'express';


import authRoutes from './src/routes/auth.routes.js';
import postRoutes from './src/routes/post.routes.js';
import photoRoutes from './src/routes/photo.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import userRoutes from './src/routes/user.routes.js';

import { errorHandler } from './src/middlewares/errorHandler.middleware.js';

dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug line to check if JWT_SECRET is loaded
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use(errorHandler);



// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



