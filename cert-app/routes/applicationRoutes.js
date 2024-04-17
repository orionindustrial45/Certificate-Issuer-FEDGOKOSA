// routes/applicationRoutes.js

import express from 'express';
import { createApplication, approveApplication, getApprovedApplicants } from '../controllers/applicationController.js';

const router = express.Router();

// Route to handle form submissions and create new applications
router.post('/applications', createApplication);

// Route to approve an application by ID
router.patch('/applications/:id/approve', approveApplication);

// Route to retrieve a list of approved applicants
router.get('/approved-applicants', getApprovedApplicants);


export default router;
