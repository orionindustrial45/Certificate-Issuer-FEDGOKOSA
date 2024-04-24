import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generateCertificate(application) {
    // Load existing PDF template
    const templatePath = 'Cert Template.pdf';
    const existingPdfBytes = fs.readFileSync(templatePath);

    // Load existing PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add applicant's details to the PDF document
    const { width, height } = firstPage.getSize();
    const fontSize = 52.7;
    const textX = width / 2;
    let textY = height / 2;

    // firstPage.drawText('Certificate of Completion', {
    //     x: textX,
    //     y: textY,
    //     size: fontSize,
    //     color: rgb(0, 0, 0),
    //     font: await pdfDoc.embedFont('Helvetica-Bold'),
    //     rotate: degrees(0), // Optional rotation angle
    //     opacity: 1, // Optional opacity value (0 to 1)
    //     lineHeight: fontSize * 1.2, // Optional line height
    //     textAlign: 'center', // Optional text alignment
    // });
    
    
    firstPage.drawText(`${application.firstName} ${application.otherName} ${application.lastName}`, {
        x: 300,
        y: 320,
        size: fontSize,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont('Helvetica'),
        rotate: degrees(0),
        opacity: 1,
        lineHeight: fontSize * 1.2,
        textAlign: 'center',
    });
    
    // textY -= fontSize * 1.2; // Move down a line
    // firstPage.drawText(`Graduation Year: ${application.graduationYear}`, {
    //     x: textX,
    //     y: textY,
    //     size: fontSize,
    //     color: rgb(0, 0, 0),
    //     font: await pdfDoc.embedFont('Helvetica'),
    //     rotate: degrees(0),
    //     opacity: 1,
    //     lineHeight: fontSize * 1.2,
    //     textAlign: 'center',
    // });

    // Generate QR code
    const qrCodeData = `FEDGOKOSA- Genuine Certificate\n Name: ${application.firstName} ${application.otherName} ${application.lastName}\nGraduation Year: ${application.graduationYear}`;
    const qrCodeImage = await QRCode.toBuffer(qrCodeData);

    // Embed the QR code image onto the PDF
    const qrImage = await pdfDoc.embedPng(qrCodeImage);
    firstPage.drawImage(qrImage, {
        x: 300, // Adjust as needed
        y: 60, // Adjust as needed
        width: 200, // Adjust as needed
        height: 200, // Adjust as needed
    });

    // Save the modified PDF
    const certificatePath = path.join(__dirname, '..','Certificate', 'certificates', `${application._id}.pdf`);
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(certificatePath, modifiedPdfBytes);
}

// Example usage
const applicationData = {
    _id: 'application_id',
    firstName: 'John',
    otherName: '',
    lastName: 'Doe',
    graduationYear: 2024
};

generateCertificate(applicationData);
