// src/controllers/post.controller.js
import asyncHandler from 'express-async-handler';
import * as postService from '../services/post.services.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

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
    const postData = req.body;
    const userId = req.user.id; // Get the user ID from the middleware

    const updatedPost = await postService.updatePost(postId, postData, userId);
    res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

export const deletePost = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.id; // Get the user ID from the middleware

    await postService.deletePost(postId, userId);
    res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

export const createPost = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        throw new ApiError(401, 'Not authorized, user info missing');
    }

    const authorId = req.user.id;
    const postData = req.body;

    let newPost;
    try {
        newPost = await postService.createPost(postData, authorId);
    } catch (err) {
        console.error('POST CREATION ERROR:', err);
        throw new ApiError(500, 'Failed to create post');
    }

    res.status(201).json(new ApiResponse(201, newPost, 'Post created successfully'));
});

export const partiallyUpdatePost = (req, res) => {
  // Your update logic here
};
