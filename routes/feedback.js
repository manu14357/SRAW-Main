const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit feedback
router.post('/submit', async (req, res) => {
  try {
    // Validate request body (e.g., check for required fields)
    const { name, title, feedback } = req.body;
    if (!title || !feedback) {
      return res.status(400).json({ error: 'Title and feedback are required' });
    }

    const newFeedback = new Feedback({
      name,
      title,
      feedback
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to get all feedbacks
router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); // Fetch feedbacks from the database
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Reply to feedback
router.post('/reply', async (req, res) => {
  try {
    const { feedbackId, reply } = req.body;
    if (!feedbackId || !reply) {
      return res.status(400).json({ error: 'Feedback ID and reply are required' });
    }

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    feedback.replies.push(reply); // Assuming reply is an object
    const updatedFeedback = await feedback.save();
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error('Error replying to feedback:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
