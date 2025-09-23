import express from 'express';
import postRoutes from './src/routes/post.routes.js';
import { testConnection } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js'; // IMPORT

const app = express();
const port = 3000;
app.use('/posts', postRoutes);
app.use(express.json());

// Mount the post routes
app.use('/posts', postRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    testConnection(); // Test the database connection on startup
});