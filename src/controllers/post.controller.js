// src/controllers/post.controller.js
import asyncHandler from 'express-async-handler';
import * as postService from '../services/post.services.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getAllPosts();
    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

export const getPostById = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await postService.getPostById(postId);

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post retrieved successfully"));
});

export const updatePost = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await postService.updatePost(postId, req.body);
    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    return res.json(post);
});

export const deletePost = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const success = await postService.deletePost(postId);
    if (!success) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    return res.status(204).send();
});

export const createPost = asyncHandler(async (req, res) => {
    const newPost = await postService.createPost(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, newPost, "Post created successfully"));
});
