// app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();
const port = 3000;

//SECURITY MIDDLEWARE
app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173", // change based on your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// GLOBAL RATE LIMIT → affects all routes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                  // 100 requests per window
    message: "Too many requests, please try again later."
});
app.use(globalLimiter);

// Strict limit for CREATE actions (optional)
const createLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,                   // Only 5 create attempts
    message: "Too many attempts to create content. Try later."
});

// JSON BODY PARSER
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Post API",
            version: "1.0.0",
            description: "Simple Posts API with In-Memory Storage"
        },
    },
    apis: ["./app.js"], // We will write Swagger comments here
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//In-memory "database"
let posts = [
    { id: 1, title: "First Post", content: "This is the first post." },
    { id: 2, title: "Second Post", content: "This is the second post." }
];
let nextId = 3;


//API ROUTES (Versioned: /api/v1/posts)

// get request
app.get('/api/v1/posts', (req, res) => {
    res.json(posts);
});

// get
app.get('/api/v1/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const post = posts.find(p => p.id === id);
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.json(post);
});

// post
app.post('/api/v1/posts', createLimiter, (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }
    const newPost = { id: nextId++, title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
});

//put
app.put('/api/v1/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }

    const { title, content } = req.body;
    posts[index] = {
        ...posts[index],
        title: title || posts[index].title,
        content: content || posts[index].content
    };

    res.json(posts[index]);
});

//delete
app.delete('/api/v1/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }

    posts.splice(index, 1);
    res.status(204).send();
});

// START SERVER
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
