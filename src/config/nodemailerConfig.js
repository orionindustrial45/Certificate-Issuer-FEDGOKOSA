// nodemailerConfig.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config()

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
        user: process.env.gmail,//'hilarytn@gmail.com',//, // Your Gmail email address
        pass:  process.env.gmail_pass//'aqyt kcpx vfuq gesg' //process.env.gmail_pass, // Your Gmail password or app password
    },
});

export default transporter;