import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = async (userData) => {
  const { username, email, password } = userData;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into DB
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

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  try {
    // Find user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) throw new ApiError(401, 'Invalid credentials');

    const user = rows[0];

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new ApiError(401, 'Invalid credentials');

    // Sign JWT
    if (!process.env.JWT_SECRET) throw new ApiError(500, "JWT_SECRET not set");

    const payload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;

  } catch (error) {
    console.error('Error in loginUser:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Login failed");
  }
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
