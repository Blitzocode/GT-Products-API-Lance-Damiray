import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllComments = async () => {
    const [rows] = await pool.query('SELECT * FROM comments');
    return rows;
};

export const getCommentsByPostId = async (postId) => {
    const [rows] = await pool.query('SELECT * FROM comments WHERE postId = ?', [postId]);
    return rows;
};

export const createComment = async (postId, authorId, commentData) => {
    const { text } = commentData;
    try {
        const [result] = await pool.query(
            'INSERT INTO comments (text, postId, authorId) VALUES (?, ?, ?)',
            [text, postId, authorId]
        );

        const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
        return rows[0];
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new ApiError(400, 'Invalid postId or authorId. The specified post or user does not exist.');
        }
        throw err;
    }
};
