const User = require("../models/User");
const Post = require("../models/Post");
const PostLike = require("../models/PostLike");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const { default: mongoose } = require("mongoose");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const crypto = require('crypto');


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
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.info_team,
        pass: process.env.info_password
      }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Sraws Team" <info@team.sraws.com>',
      to: email,
      subject: 'Welcome to Sraws!',
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
    const { usernameOrEmail, password } = req.body; // Updated field name

    if (!(usernameOrEmail && password)) {
      throw new Error("All input required");
    }

    // Normalize email if input appears to be an email address
    const normalizedEmail = usernameOrEmail.toLowerCase();
    const isEmailInput = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);

    let user;

    if (isEmailInput) {
      // Authenticate using email
      user = await User.findOne({ email: normalizedEmail });
    } else {
      // Authenticate using username
      user = await User.findOne({ username: usernameOrEmail });
    }

    if (!user) {
      throw new Error("Username/Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Username/Email or password incorrect");
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

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    // Save the reset token and its expiration to the user record
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Set up your email transporter with Hostinger's SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.info_team,
        pass: process.env.info_password
      }
    });

    // Create the email content
    const mailOptions = {
      from: 'info@team.sraws.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #007bff; /* Change this to your brand color */
                color: #ffffff;
                padding: 10px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                margin: 20px 0;
                color: #333333; /* Text color for better readability */
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                margin-top: 20px;
              }
              a {
                background-color: #007bff; /* Button background color */
                color: white; /* Button text color */
                padding: 10px 15px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 10px;
                font-weight: bold; /* Bold text for button */
              }
              a:hover {
                background-color: #0056b3; /* Darker shade on hover */
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hi,</p>
                <p>You requested a password reset for your account associated with the email address <strong>${email}</strong>.</p>
                <p>Please click the button below to reset your password:</p>
                <a href="http://localhost:3000/reset-password?token=${resetToken}&email=${email}">
                  Reset Password
                </a>
                <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                <p>For any issues or questions, feel free to contact our support team.</p>
                <p>Thank you for being a valued member of our community!</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Sraws. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
    
    

    // Send the email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({ error: 'Error sending email.' });
  }
};




const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    // Verify the token and find the user by email
    const user = await User.findOne({ email });
    if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
      return res.status(400).json({ error: 'Invalid token or email.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // Update the password
    user.resetToken = undefined; // Clear the reset token after use
    user.resetTokenExpiration = undefined; // Clear the expiration
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully!' });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Error resetting password.' });
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
  sendPasswordResetEmail,
  resetPassword,
};
