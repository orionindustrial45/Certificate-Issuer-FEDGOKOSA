// controllers/applicationController.js
import QRCode from 'qrcode';
import PDFKit from 'pdfkit';
import PDFImage from 'pdf-image';
import fs from 'fs';
import path from 'path';
import Application from '../models/Application.js';
import transporter from '../config/nodemailerConfig.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    const submittedApplication = await newApplication.save();

    const mailOptions = {
      from: process.env.gmail, // Your Gmail email address
      to: 'bhqfspjpbsuhduqahz@cazlv.com', // Applicant's email address
      subject: `Application Received `,
      html:`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Received - Email</title>
        <style>
          /* Add your custom styles here */
          .card {
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 20px;
            margin: 0 auto;
          }
          .btn {
            display: block;
            width: 100%;
            padding: 10px 0;
            background-color: #007bff;
            color: #fff;
            text-align: center;
            text-decoration: none;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .btn:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
  
      <div class="card">
        <h3>Application Received</h3>
        <p>Dear Hilary,</p>
        <p>Your application for the FEDGOKOSA membership has been received. </p>
        <p><em>Note:</em> This application may take up to 3 days to be either approved or declined.</p>
      </div>
      </body>
      </html>
    `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(201).json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with error message
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Controller function to issue a certificate
export const issueCertificate = async (req, res) => {
  try {
    const { id } = req.params; // Extract application ID from request parameters

    // Find the application by ID
    const application = await Application.findById(id);

    if (!application || application.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Application not found or not approved' });
    }

    // Create a PDF document
    const pdfDoc = new PDFKit();
    const certificatePath = path.join(__dirname, '..', 'certificates', `${application._id}.pdf`);
    const qrCodeData = `Name: ${application.firstName} ${application.otherName} ${application.lastName}\nGraduation Year: ${application.graduationYear}`;

    // Generate QR code
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Pipe PDF document to a writable stream
    const writeStream = fs.createWriteStream(certificatePath);
    pdfDoc.pipe(writeStream);

    // Add applicant's details to the PDF document
    pdfDoc.fontSize(20).text(`Certificate of Completion`, { align: 'center' });
    pdfDoc.fontSize(14).text(`Name: ${application.firstName} ${application.otherName} ${application.lastName}`, { align: 'center' });
    pdfDoc.fontSize(14).text(`Graduation Year: ${application.graduationYear}`, { align: 'center' });
    
    // Add QR code image to the PDF document
    pdfDoc.image(qrCodeImage, { fit: [250, 250], align: 'center' });

    // Finalize PDF document
    pdfDoc.end();

    //const pdfImage = new PDFImage.PDFImage(certificatePath);

    // Convert the PDF to a PNG image
    //const imagePaths = await pdfImage.convertPage(0); // Convert only the first page

    // Get the path of the converted image
    //const imagePath = imagePaths[0]; // Assuming only one page is converted
    //console.log(imagePath)

// Construct the email options
    const mailOptions = {
      from: process.env.gmail, // Your Gmail email address
      to: application.email, // Applicant's email address
      subject: `FEDGOKOSA Membership Certificate - ${application.firstName} ${application.otherName} ${application.lastName}`,
      //text: `Dear ${application.firstName},\n Please find your certificate attached.`,
      html:`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate Email</title>
        <style>
          /* Add your custom styles here */
          .card {
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 20px;
            margin: 0 auto;
          }
          .btn {
            display: block;
            width: 100%;
            padding: 10px 0;
            background-color: #007bff;
            color: #fff;
            text-align: center;
            text-decoration: none;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .btn:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
  
      <div class="card">
        <h3>Certificate Issued</h3>
        <p>Dear ${application.firstName},</p>
        <p>Congratulations! Your certificate has been issued.</p>
        <p>You can download from the attachment below</p>
      </div>
  
      </body>
      </html>
    `,
      attachments: [{
        filename: 'FEDGOKOSA Certificate.pdf',
        path: certificatePath,
      }]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    application.status = 'issued';
    const issueData = await application.save();
    // Respond with success message
    res.status(200).json({ success: true, message: 'Certificate issued successfully', data: issueData });
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with error message
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};