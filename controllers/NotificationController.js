// controllers/NotificationController.js

const Notification = require('../models/Notification');

const getNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username') // Adjust fields as needed
      .populate('postId', 'title') // Adjust fields as needed
      .populate('commentId', 'text') // Adjust fields as needed
      .populate('messageThreadId', 'lastMessage') // Adjust fields as needed
      .sort({ createdAt: -1 }); // Sort by newest first
    return notifications;
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    throw error;
  }
};


module.exports = {
  getNotifications
};
