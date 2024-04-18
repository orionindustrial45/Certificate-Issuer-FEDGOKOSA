// controllers/applicationController.js

import Application from '../models/Application.js';

// Controller function to create a new application
export const createApplication = async (req, res) => {
  try {
    // Extract data from request body
    const { firstName, otherName, lastName, graduationYear, email } = req.body;

    // Create a new application object
    const newApplication = new Application({
      firstName,
      otherName,
      lastName,
      graduationYear,
      email
    });

    // Save the application to the database
    const application = await newApplication.save();

    res.render('success')
    // Respond with success message
    //res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
    
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with error message
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

 // Controller function to retrieve a list of applicants with optional search functionality
export const getApplicants = async (req, res) => {
  try {
    const { searchTerm } = req.query; // Get the search term from the request query parameters

    // Build the query to find applicants with status "pending" and optionally matching the search term
    const query = { status: 'pending' };
    
    // If a search term is provided, add search criteria to the query
    if (searchTerm) {
      query.$or = [
        { firstName: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive match for first name
        { lastName: { $regex: searchTerm, $options: 'i' } }   // Case-insensitive match for last name
      ];
    }

    // Find applicants that match the query
    const applicants = await Application.find(query);

    // Respond with the list of matching applicants
    res.status(200).json({ success: true, applicants });
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with error message
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Controller function to approve an application
export const approveApplication = async (req, res) => {
    try {
      // Extract application ID from request parameters
      const { id } = req.params;
  
      // Find the application by ID
      const application = await Application.findById(id);
  
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
  
      // Update the status to "approved"
      application.status = 'approved';
      // Set the approval date to current date and time
      application.approvalDate = new Date();
      // Save the updated application
      const myApplication= await application.save();
  
      // Respond with success message
      res.status(200).json({ success: true, message: 'Application approved successfully', data: myApplication});
    } catch (error) {
      console.error(error);
      // If an error occurs, respond with error message
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
  // Controller function to retrieve a list of approved applicants
  export const getApprovedApplicants = async (req, res) => {
    try {
      // Find all applications with status "approved"
      const approvedApplicants = await Application.find({ status: 'approved' });
  
      // Respond with the list of approved applicants
      res.status(200).json({ success: true, approvedApplicants });
    } catch (error) {
      console.error(error);
      // If an error occurs, respond with error message
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

   // Controller function to retrieve a list of issued applicants
   export const getIsssuedApplicants = async (req, res) => {
    try {
      // Find all applications with status "approved"
      const issuedApplicants = await Application.find({ status: 'issued' });
  
      // Respond with the list of approved applicants
      res.status(200).json({ success: true, issuedApplicants });
    } catch (error) {
      console.error(error);
      // If an error occurs, respond with error message
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };