// routes/authRoutes.js

import express from 'express';
const router = express.Router();
import passport from 'passport';
import * as authController from '../controllers/authController.js';
import {authenticate}  from '../middleware/authMiddleware.js';

// User registration route
router.post('/register', authenticate, authController.register);

// User login route
router.post('/login', authController.login);

router.post('/user/refresh-token', authController.refreshToken);

// User logout route
router.get('/logout', authenticate, authController.logout);

export default router;
