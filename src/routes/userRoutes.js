// routes/userRoutes.js

import express from 'express';
const router = express.Router();
import * as authMiddleware from '../utils/authMiddleware.js';
import * as userController from '../controllers/userController.js';

// User profile route
router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);

export default router;
