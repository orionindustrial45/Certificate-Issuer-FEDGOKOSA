// models/Application.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define schema for application
const applicationSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  otherName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  graduationYear: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvalDate: {
    type: Date
  },
  issueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create model for application
const Application = mongoose.model('Application', applicationSchema);

export default Application;
