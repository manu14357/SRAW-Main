// emailService.js
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: 'manoharchoppa6@gmail.com',
        pass: 'nbqfgcmxggfkuzri'
    }
});

const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: '"SRAW Team" <manoharchoppa6@gmail.com>',
            to,
            subject,
            html: htmlContent
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
