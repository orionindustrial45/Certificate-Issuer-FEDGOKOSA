// controllers/applicationController.js

import Application from '../models/Application.js';

// Controller function to create a new application
export const createApplication = async (req, res) => {
  try {
    // Extract data from request body
    const { firstName, otherName, lastName, graduationYear } = req.body;

    // Create a new application object
    const newApplication = new Application({
      firstName,
      otherName,
      lastName,
      graduationYear
    });

    // Save the application to the database
    await newApplication.save();

    // Respond with success message
    res.status(201).json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with error message
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
