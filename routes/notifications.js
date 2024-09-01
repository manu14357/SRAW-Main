const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // Adjust path as needed
const User = require('../models/User'); // Import the User model
const Post = require('../models/Post'); // Import the Post model
const Comment = require('../models/Comment'); // Import the Comment model
const Message = require('../models/Message'); // Import the Message model

// Fetch notifications for a specific user
router.get('/notifications/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username') // Populate sender field with User model
      .populate('post') // Populate post field with Post model
      .populate('comment') // Populate comment field with Comment model
      .populate('message'); // Populate message field with Message model

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read for a user
router.put('/notifications/mark-all-read/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a single notification as read
router.put('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { $set: { read: true } });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get unread messages count for a user
router.get('/messages/unread-count/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const unreadCount = await Message.countDocuments({ 
      recipient: userId, 
      read: false 
    });
    res.status(200).json({ count: unreadCount });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a single message as read
router.put('/messages/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { $set: { read: true } });
    res.status(200).json({ message: 'Message marked as read' });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
