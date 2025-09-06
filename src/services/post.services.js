// src/services/post.service.js

let posts = [
  { id: 1, title: 'First Post', content: 'This is the first post.' },
  { id: 2, title: 'Second Post', content: 'This is the second post.' }
];
let nextId = 3;

export const getAllPosts = () => posts;

export const getPostById = (id) => posts.find(p => p.id === id);

export const createPost = (postData) => {
  const newPost = { id: nextId++, ...postData };
  posts.push(newPost);
  return newPost;
};

export const updatePost = (id, postData) => {
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;
  posts[index] = { ...posts[index], ...postData };
  return posts[index];
};

export const deletePost = (id) => {
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
};
