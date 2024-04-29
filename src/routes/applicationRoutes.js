// routes/applicationRoutes.js

import express from 'express';
import {
    createApplication, 
    approveApplication,
    getApprovedApplicants,
    getApplicants, 
    getIsssuedApplicants 
} from '../controllers/applicationController.js';
//import { authenticate} from '..//middleware/authMiddleware.js'

const router = express.Router();

// Route to handle form submissions and create new applications
router.post('/applications', createApplication);

// Route to retrieve all applications (pending by default)
router.get('/get-applicants', getApplicants);

// Route to approve an application by ID
router.patch('/applications/:id/approve', approveApplication);

// Route to retrieve a list of approved applicants
router.get('/approved-applicants', getApprovedApplicants);

//Route to retrieve a list of issued applicants
router.get('/issued-applicants', getIsssuedApplicants)




export default router;
