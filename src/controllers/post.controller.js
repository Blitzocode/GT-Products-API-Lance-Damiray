// src/controllers/post.controller.js
import * as postServices from '../services/post.services.js';


    export const getAllPosts = async (req, res) => {
        try {
            const posts = await postServices.getAllPosts();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving posts', error: error.message });
        }
    };

export const getPostById = (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = postServices.getPostById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }
  res.json(post);
};

export const createPost = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }
  const newPost = postServices.createPost({ title, content });
  res.status(201).json(newPost);
};

export const updatePost = (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = postServices.updatePost(postId, req.body);
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }
  res.json(post);
};

export const deletePost = (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const success = postServices.deletePost(postId);
  if (!success) {
    return res.status(404).json({ message: 'Post not found.' });
  }
  res.status(204).send();
};


    // (Apply the same async/await and try/catch pattern to all other controller functions:
    // getPostById, createPost, updatePost, partiallyUpdatePost, and deletePost)