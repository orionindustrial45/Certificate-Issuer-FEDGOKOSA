// routes/applicationRoutes.js

import express from 'express';
import {
    createApplication, 
    approveApplication,
    getApprovedApplicants,
    getApplicants, 
    getIsssuedApplicants 
} from '../controllers/applicationController.js';
import { authenticate} from '..//middleware/authMiddleware.js'

const router = express.Router();

// Route to handle form submissions and create new applications
router.post('/applications', createApplication);

// Route to retrieve all applications (pending by default)
router.get('/get-applicants', authenticate, getApplicants);

// Route to approve an application by ID
router.patch('/applications/:id/approve', authenticate, approveApplication);

// Route to retrieve a list of approved applicants
router.get('/approved-applicants', authenticate, getApprovedApplicants);

//Route to retrieve a list of issued applicants
router.get('/issued-applicants', authenticate, getIsssuedApplicants)




export default router;
