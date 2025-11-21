import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
  try {
    const { username, email, password } = userData;

    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new ApiError(400, 'Email already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into DB
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // Fetch the newly created user (exclude password)
    const newUser = await getUserById(result.insertId);

    return newUser;
  } catch (error) {
    console.error('Error in registerUser:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      throw new ApiError(409, "Username or email already exists");
    }

    throw new ApiError(500, "Failed to register user");
  }
};


export const loginUser = async (loginData) => {
    const { email, password } = loginData;

    // 1. Find the user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const user = rows[0];

    // 2. Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // 3. Generate JWT (this is where your line goes)
    const payload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 4. Return token
    return token;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, username, email, createdAt FROM users WHERE id = ?',
    [id]
  );
  if (!rows.length) throw new ApiError(404, "User not found");
  return rows[0];
};

export const getAllUsers = async () => {
  const [users] = await pool.query(
    'SELECT id, username, email, createdAt FROM users'
  );
  return users;
};
