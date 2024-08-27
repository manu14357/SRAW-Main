const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit feedback
router.post('/submit', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all feedback
router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reply to feedback
router.post('/reply', async (req, res) => {
  try {
    const { feedbackId, reply } = req.body;
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    feedback.replies.push({ reply });
    await feedback.save();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
