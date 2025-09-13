// src/controllers/comment.controller.js
import * as commentService from '../services/comment.service.js';

export const getAllComments = (req, res) => {
  const allComments = commentService.getAllComments();
  res.json(allComments);
};

export const getCommentsByPostId = (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  const comments = commentService.getCommentsByPostId(postId);
  res.json(comments);
};

export const createCommentForPost = (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required.' });
  }
  const newComment = commentService.createComment(postId, { text });
  res.status(201).json(newComment);
};
