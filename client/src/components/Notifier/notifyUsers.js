// notifyUsers.js
const User = require('../../../../models/User');
const Notification = require('../../../../models/Notification');
const sendEmail = require('./emailService');
const generateEmailContent = require('./emailContentGenerator');
const { subMinutes } = require('date-fns');

const checkAndSendNotificationEmail = async () => {
    const users = await User.find({}); // Fetch all users or use a specific query

    for (const user of users) {
        const unreadNotifications = await Notification.find({
            recipient: user._id,
            read: false,
            createdAt: { $gte: subMinutes(new Date(), 10) } // Check notifications from the last 5 minutes
        }).sort({ createdAt: -1 })
          .populate('sender', 'username'); // Populate sender's username

        if (unreadNotifications.length > 0) {
            const emailContent = generateEmailContent(user.username, unreadNotifications.length, unreadNotifications);
            await sendEmail(user.email, 'You have new notifications', emailContent);
        }
    }
};

module.exports = checkAndSendNotificationEmail;
