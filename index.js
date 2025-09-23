import express from 'express';
import dotenv from 'dotenv';
import {postRoutes} from './src/routes/post.routes.js';
import {userRoutes} from './src/routes/user.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import { testConnection } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    testConnection();
});

