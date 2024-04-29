import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';

dotenv.config()

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    );

    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    );
    res.cookie('token', token, {
      httpOnly: true,
      path: '/api/auth/login',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh-token',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ message: 'Login successful', user, token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ message: 'Access denied. No token provided' });
    }

    const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded.id) {
      return res.status(403).json({ message: 'User ID not found in the token' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    );

    res.json({ accessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  // Assuming logout functionality doesn't require authentication middleware
  req.logout();
  res.status(200).json({ message: 'Logout successful' });
};
