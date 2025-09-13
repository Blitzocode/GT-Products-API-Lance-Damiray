// src/services/comment.service.js

let comments = [
  { id: 1, text: 'Great post!', postId: 1 },
  { id: 2, text: 'Thanks for sharing.', postId: 1 }
];
let nextCommentId = 3;

export const getAllComments = () => comments;

export const getCommentsByPostId = (postId) => {
  return comments.filter(comment => comment.postId === postId);
};

export const createComment = (postId, commentData) => {
  const newComment = { id: nextCommentId++, postId, ...commentData };
  comments.push(newComment);
  return newComment;
};
