// nodemailerConfig.js

import nodemailer from 'nodemailer';

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
        user: 'hilarytn@gmail.com',//process.env.gmail, // Your Gmail email address
        pass:  'aqyt kcpx vfuq gesg' //process.env.gmail_pass, // Your Gmail password or app password
    },
});

export default transporter;