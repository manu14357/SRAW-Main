const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

/**
 * Sends a message to a recipient. Creates a conversation if one does not exist.
 * @param {Object} req - The request object containing recipient ID, message content, and sender ID.
 * @param {Object} res - The response object used to send the response.
 */
const sendMessage = async (req, res) => {
  try {
    const recipientId = req.params.id;
    const { content, userId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(recipientId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      recipients: { $all: [userId, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        recipients: [userId, recipientId],
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversation._id,
      sender: userId,
      content,
    });

    // Update conversation with the last message timestamp
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    // Create notification
    await createNotification("message", null, userId, recipientId, message._id);

    return res.json({ success: true });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves messages for a given conversation ID.
 * @param {Object} req - The request object containing the conversation ID.
 * @param {Object} res - The response object used to send the response.
 */
const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // Validate conversation ID
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation ID" });
    }

    // Find conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Retrieve messages
    const messages = await Message.find({ conversation: conversation._id })
      .populate("sender", "-password")
      .sort("-createdAt");

    return res.json(messages);
  } catch (err) {
    console.error("Error getting messages:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all conversations for a given user ID.
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object used to send the response.
 */
const getConversations = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Retrieve conversations
    const conversations = await Conversation.find({
      recipients: { $in: [userId] },
    })
      .populate("recipients", "-password")
      .sort("-updatedAt")
      .lean();

    // Process conversations to assign the other recipient
    const updatedConversations = conversations.map(conversation => {
      const otherRecipient = conversation.recipients.find(recipient => recipient._id.toString() !== userId);
      return {
        ...conversation,
        recipient: otherRecipient || null,
      };
    });

    return res.json(updatedConversations);
  } catch (err) {
    console.error("Error getting conversations:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Creates a notification for a given action.
 * @param {string} type - The type of notification.
 * @param {string} postId - The ID of the post related to the notification (if any).
 * @param {string} senderId - The ID of the user sending the notification.
 * @param {string} recipientId - The ID of the user receiving the notification.
 * @param {string} [messageId=null] - The ID of the message related to the notification (if any).
 */
const createNotification = async (type, postId, senderId, recipientId, messageId = null) => {
  try {
    if (senderId.toString() === recipientId.toString()) return;

    const existingNotification = await Notification.findOne({
      type,
      sender: senderId,
      recipient: recipientId,
      message: messageId,
    });

    if (!existingNotification) {
      await Notification.create({
        type,
        sender: senderId,
        recipient: recipientId,
        post: postId,
        message: messageId,
      });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
};
