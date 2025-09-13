// app.js
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// In-memory "database"
let posts = [
    { id: 1, title: 'First Post', content: 'This is the first post.' },
    { id: 2, title: 'Second Post', content: 'This is the second post.' }
];
let nextId = 3;

// POST /posts (adds a new post to the array)
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }
    const newPost = { id: nextId++, title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// GET /posts (returns the full array)
app.get('/posts', (req, res) => {
    res.json(posts);
});

// GET /posts/:id (finds and returns a single post)
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
});

// PUT /posts/:id (finds and updates a post)
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    const { title, content } = req.body;
    posts[postIndex] = { ...posts[postIndex], title: title || posts[postIndex].title, content: content || posts[postIndex].content };
    res.json(posts[postIndex]);
});

// DELETE /posts/:id (removes a post from the array)
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    posts.splice(postIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});