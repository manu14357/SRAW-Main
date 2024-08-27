const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

// Get all chat messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Send a chat message
router.post('/send', async (req, res) => {
  try {
    const { message, sender } = req.body;
    const chatMessage = new ChatMessage({
      text: message,
      sender: sender || 'Anonymous'  // Use 'Anonymous' if sender is not provided
    });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reply to a chat message
router.post('/reply', async (req, res) => {
  try {
    const { messageId, reply, sender } = req.body;
    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    chatMessage.replies.push({
      text: reply.message,
      sender: sender || 'Anonymous' // Use 'Anonymous' if sender is not provided
    });
    await chatMessage.save();
    res.status(200).json(chatMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
