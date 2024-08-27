const User = require("../models/User");
const Post = require("../models/Post");
const PostLike = require("../models/PostLike");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const { default: mongoose } = require("mongoose");
const Message = require("../models/Message");
const Notification = require("../models/Notification");

const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const nodemailer = require('nodemailer');



const { generateWelcomeEmail } = require('../WELCOM/emailTemplates');

const sendWelcomeEmail = async (email, username) => {
  try {
    let transporter = nodemailer.createTransport({
      // Your email SMTP configuration (e.g., Gmail, SMTP server, etc.)
      // Example:
      service: 'gmail',
      auth: {
        user: 'manoharchoppa6@gmail.com',
        pass: 'nbqfgcmxggfkuzri'
      }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"SRAW Team" <manoharchoppa6@gmail.com>',
      to: email,
      subject: 'Welcome to SRAW!',
      html: generateWelcomeEmail(username)
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      throw new Error("Email and username must be unique");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.username);

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const follow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.find({ userId, followingId });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const follow = await Follow.create({ userId, followingId });

    return res.status(200).json({ data: follow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, biography } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (typeof biography == "string") {
      user.biography = biography;
    }

    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.find({ userId, followingId });

    if (!existingFollow) {
      throw new Error("Not already following user");
    }

    await existingFollow.remove();

    return res.status(200).json({ data: existingFollow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.find({ followingId: userId });

    return res.status(200).json({ data: followers });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ userId });

    return res.status(200).json({ data: following });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("User does not exist");
    }

    const posts = await Post.find({ poster: user._id })
      .populate("poster")
      .sort("-createdAt");

    let likeCount = 0;

    posts.forEach((post) => {
      likeCount += post.likeCount;
    });

    const data = {
      user,
      posts: {
        count: posts.length,
        likeCount,
        data: posts,
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomUsers = async (req, res) => {
  try {
    let { size } = req.query;

    const users = await User.find().select("-password");

    const randomUsers = [];

    if (size > users.length) {
      size = users.length;
    }

    const randomIndices = getRandomIndices(size, users.length);

    for (let i = 0; i < randomIndices.length; i++) {
      const randomUser = users[randomIndices[i]];
      randomUsers.push(randomUser);
    }

    return res.status(200).json(randomUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getRandomIndices = (size, sourceSize) => {
  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
};


const sendMessage = async (req, res) => {
  try {
    const { content, senderId, recipientId } = req.body;

    if (!(content && senderId && recipientId)) {
      throw new Error("Content, senderId, and recipientId are required");
    }

    const message = await Message.create({
      content,
      sender: senderId,
      recipient: recipientId,
    });

    await createNotification("message", null, senderId, recipientId, message._id);

    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(400).json({ error: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username profilePicture")
      .populate("post", "title")
      .populate("comment", "content")
      .populate("message", "content")
      .sort("-createdAt");

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(400).json({ error: err.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new Error("Notification does not exist");
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(400).json({ error: err.message });
  }
};

const createNotification = async (type, postId, senderId, recipientId, commentId = null) => {
  try {
    if (senderId.toString() === recipientId.toString()) return;

    const existingNotification = await Notification.findOne({
      type,
      sender: senderId,
      recipient: recipientId,
      post: postId,
      comment: commentId,
    });

    if (!existingNotification) {
      await Notification.create({
        type,
        sender: senderId,
        recipient: recipientId,
        post: postId,
        comment: commentId,
      });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};


module.exports = {
  register,
  login,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getRandomUsers,
  updateUser,
  sendMessage,
  getNotifications,
  markNotificationAsRead,
};
