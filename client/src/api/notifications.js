const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // Adjust path as needed

// Fetch notifications for a specific user
router.get('/notifications/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username') // Adjust according to your User model
      .populate('post')
      .populate('comment')
      .populate('message');

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
