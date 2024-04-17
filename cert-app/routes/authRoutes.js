// routes/authRoutes.js

import express from 'express';
const router = express.Router();
import passport from 'passport';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from '../utils/authMiddleware.js';

// User registration route
router.post('/register', authController.register);

// User login route
router.post('/login', authController.login);

// User logout route
router.get('/logout', authController.logout);

export default router;
