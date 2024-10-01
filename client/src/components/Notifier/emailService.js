const nodemailer = require('nodemailer');
const moment = require('moment'); // For handling dates

// Email addresses
const emailAddresses = [
    'notifications_r261201@no-reply.sraws.com',
    'notifications_r261202@no-reply.sraws.com',
    'notifications_r261203@no-reply.sraws.com',
    'notifications_r261204@no-reply.sraws.com',
    'notifications_r261205@no-reply.sraws.com'
];

// Password for all emails
const emailPassword = '@Ramu2612manu';

// Create a transporter object using Hostinger's SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // SMTP server host
    port: 465, // SMTP server port
    secure: true, // Use SSL/TLS
    auth: {
        user: emailAddresses[0], // Use the first email for authentication
        pass: emailPassword
    }
});

// Message counts and date tracking
let messageCounts = emailAddresses.reduce((acc, email) => {
    acc[email] = { count: 0, lastSentDate: moment().startOf('day') };
    return acc;
}, {});

// Send email function
const sendEmail = async (to, subject, htmlContent) => {
    try {
        // Determine which email address to use
        let emailToUse = null;
        for (const email of emailAddresses) {
            const data = messageCounts[email];
            const today = moment().startOf('day');
            
            // Reset count if a new day
            if (!data.lastSentDate.isSame(today, 'day')) {
                data.count = 0;
                data.lastSentDate = today;
            }

            // Check if the daily limit has been reached
            if (data.count < 280) {
                emailToUse = email;
                data.count += 1;
                break;
            }
        }

        if (!emailToUse) {
            throw new Error('All email addresses have reached the daily limit');
        }

        await transporter.sendMail({
            from: `"Sraws Notification Center" <${emailToUse}>`,
            to,
            subject,
            html: htmlContent
        });

        console.log('Email sent successfully from', emailToUse);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



module.exports = sendEmail;
