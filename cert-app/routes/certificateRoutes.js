// routes/certificateRoutes.js

import express from 'express';
import { issueCertificate } from '../controllers/certController.js';

const router = express.Router();

// Route to issue a certificate by application ID
router.post('/certificates/:id/issue', issueCertificate);

export default router;
