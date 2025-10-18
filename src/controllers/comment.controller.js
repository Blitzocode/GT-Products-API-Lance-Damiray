// src/controllers/comment.controller.js
import * as commentService from '../services/comment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllComments = asyncHandler(async (req, res) => {
    const comments = await commentService.getAllComments();
    res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully.'));
});

export const getCommentsByPostId = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const comments = await commentService.getCommentsByPostId(postId);
    res.status(200).json(new ApiResponse(200, comments, 'Comments for the post retrieved successfully.'));
});

export const createCommentForPost = asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.postId);
  const { text, authorId } = req.body;

  const comment = await commentService.createComment(postId, authorId, { text });

  res.status(201).json(new ApiResponse(201, comment, 'Comment created successfully.'));
});

