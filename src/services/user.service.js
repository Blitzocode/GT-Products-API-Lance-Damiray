import db from '../config/db.js';
import {ApiError} from '../utils/ApiError.js';

async function createUser(userData) {
    const { username, email } = userData;
    try {
        const [result] = await db.query(
            'INSERT INTO users (username, email) VALUES (?, ?)',
            [username, email]
        );
        return await getUserById(result.insertId);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, 'Username or email already exists.');
        }
        throw error;
    }
}

async function getUserById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new ApiError(404, 'User not found.');
    }
    return rows[0];
}

async function getAllUsers() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
}

export {
  createUser,
  getUserById,
  getAllUsers,
};

import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = async ({ username, email, password }) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        const newUser = await getUserById(result.insertId);
        return newUser;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, "Username or email already exists.");
        }
        throw error;
    }
};

export const getUserById = async (id) => {
    const [rows] = await pool.query('SELECT id, username, email, createdAt FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new ApiError(404, "User not found");
    }
    return rows[0];
};

export const getAllUsers = async () => {
    const [users] = await pool.query('SELECT id, username, email, createdAt FROM users');
    return users;
};