const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, default: 'Anonymous' }, // Default to 'Anonymous'
  createdAt: { type: Date, default: Date.now },
  replies: [{ 
    text: { type: String },
    sender: { type: String, default: 'Anonymous' }, // Default to 'Anonymous'
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
