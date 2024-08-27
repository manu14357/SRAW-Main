const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const PostLike = require("../models/PostLike");
const paginate = require("../util/paginate");
const Notification = require('../models/Notification');
const cooldown = new Set();

USER_LIKES_PAGE_SIZE = 9;

const POINTS_PER_POST = 5;
const POINTS_PER_LIKE = 2;
const POINTS_PER_COMMENT = 3;
const POINTS_DEDUCTION = 2;

const createPost = async (req, res) => {
  try {
    const { title, content, userId, country, state, city, area, mediaUrls, metaTitle, metaDescription, metaKeywords } = req.body;

    // Check if title, content, and userId are provided
    if (!(title && content && userId)) {
      throw new Error("Title, content, and userId are required");
    }

    // Check cooldown status for the user
    if (cooldown.has(userId)) {
      throw new Error("You are posting too frequently. Please try again shortly.");
    }

    // Add user to cooldown set and remove after 30 seconds
    cooldown.add(userId);
    setTimeout(() => {
      cooldown.delete(userId);
    }, 30000);

    // Ensure mediaUrls is an array, default to empty array if not provided
    const validatedMediaUrls = Array.isArray(mediaUrls) ? mediaUrls : [];

    // Generate default SEO values if not provided
    const defaultMetaTitle = `${title} - Your Website Name`;
    const defaultMetaDescription = `${content.substring(0, 160)}...`;
    const defaultMetaKeywords = `${title}, ${city}, ${state}, ${country}`;

    // Create a new post instance
    const post = await Post.create({
      title,
      content,
      poster: userId,
      address: {
        country,
        state,
        city,
        area,
      },
      mediaUrls: validatedMediaUrls,
   
      metaDescription: metaDescription || defaultMetaDescription,
      metaKeywords: metaKeywords || defaultMetaKeywords,
    });
    await User.findByIdAndUpdate(userId, { $inc: { socialPoints: POINTS_PER_POST } });
    // Respond with the created post
    res.status(201).json(post);
  } catch (err) {
    // Handle errors and respond with appropriate status code
    console.error("Error creating post:", err);
    res.status(400).json({ error: err.message });
  }
};



const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Post does not exist");
    }

    const post = await Post.findById(postId)
      .populate("poster", "-password")
      .lean();

    if (!post) {
      throw new Error("Post does not exist");
    }

    // Increment view count
    await Post.findByIdAndUpdate(postId, { $inc: { viewCount: 1 } });

    if (userId) {
      await setLiked([post], userId);
    }

    await enrichWithUserLikePreview([post]);

    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { userId } = req.body;
    let { page, sortBy, author, search } = req.query;

    // Default values if not provided
    sortBy = sortBy || "-createdAt";
    page = parseInt(page, 10) || 1;

    // Build the initial query object
    let query = {};

    // Handle search functionality
    if (search) {
      const searchWords = search.split(" ");
      const searchRegex = new RegExp(searchWords.join("|"), "i");
    
      query.$or = [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { "address.country": { $regex: searchRegex } },
        { "address.state": { $regex: searchRegex } },
        { "address.city": { $regex: searchRegex } },
        { "address.area": { $regex: searchRegex } },
      ];
    }
    

    // Handle author filtering
    if (author) {
      const user = await User.findOne({ username: author });
      if (user) {
        query.poster = user._id;
      } else {
        return res.status(404).json({ error: "Author not found" });
      }
    }

    // Fetch posts matching the query with pagination
    const pageSize = 10;
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / pageSize);
    const skip = (page - 1) * pageSize;

    let posts = await Post.find(query)
      .populate("poster", "-password")
      .sort(sortBy)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Check if user ID is provided to set liked status
    if (userId) {
      await setLiked(posts, userId);
    }

    // Enrich posts with user like preview
    await enrichWithUserLikePreview(posts);

    // Return JSON response with data and pagination info
    return res.json({
      data: posts,
      currentPage: page,
      totalPages,
      totalCount: totalPosts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, userId, isAdmin, country, state, city, area, mediaUrls, metaTitle, metaDescription, metaKeywords } = req.body;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    // Check if the user is authorized to update the post
    if (post.poster != userId && !isAdmin) {
      throw new Error("Not authorized to update post");
    }

    // Update post fields if they are provided
    if (title) post.title = title;
    if (content) post.content = content;
    if (country) post.address.country = country;
    if (state) post.address.state = state;
    if (city) post.address.city = city;
    if (area) post.address.area = area;
    if (Array.isArray(mediaUrls)) post.mediaUrls = mediaUrls;

    // Generate default SEO values if not provided
    post.metaTitle = metaTitle || `${post.title} - Your Website Name`;
    post.metaDescription = metaDescription || `${post.content.substring(0, 160)}...`;
    post.metaKeywords = metaKeywords || `${post.title}, ${post.address.city}, ${post.address.state}, ${post.address.country}`;

    post.edited = true;

    // Save the updated post
    await post.save();

    return res.json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(400).json({ error: err.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, isAdmin } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.poster != userId && !isAdmin) {
      throw new Error("Not authorized to delete post");
    }

    await post.remove();

    await Comment.deleteMany({ post: post._id });
    // Deduct points from the user who created the post
    await User.findByIdAndUpdate(post.poster, { $inc: { socialPoints: -POINTS_PER_POST } });


    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const setLiked = async (posts, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const userPostLikes = await PostLike.find(searchCondition); //userId needed

  posts.forEach((post) => {
    userPostLikes.forEach((userPostLike) => {
      if (userPostLike.postId.equals(post._id)) {
        post.liked = true;
      }
    });
  });
};



const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Post does not exist");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    const alreadyLiked = await PostLike.findOne({ postId, userId });

    if (alreadyLiked) {
      throw new Error("Already liked this post");
    }

    const postLike = await PostLike.create({ postId, userId });
    post.likeCount++;
    await post.save();

    // Award points to the user who liked the post
    await User.findByIdAndUpdate(userId, { $inc: { socialPoints: POINTS_PER_LIKE } });

    await createNotification("like", postId, userId, post.poster);

    res.json(postLike);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};



const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Post does not exist");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    const alreadyLiked = await PostLike.findOne({ postId, userId });

    if (!alreadyLiked) {
      throw new Error("You have not liked this post");
    }

    await alreadyLiked.remove();

    post.likeCount--;
    await post.save();

    // Deduct points from the user
    await User.findByIdAndUpdate(userId, { $inc: { socialPoints: -POINTS_DEDUCTION } });


    return res.json({ message: "Unliked post successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const enrichWithUserLikePreview = async (posts) => {
  const userLikePreviews = await Promise.all(
    posts.map(async (post) => {
      const latestUserLike = await PostLike.find({ postId: post._id })
        .sort("-createdAt")
        .limit(1)
        .populate("userId", "username");
      if (latestUserLike.length > 0) {
        post.latestUserLike = latestUserLike[0].userId.username;
      }
      return post;
    })
  );
  return userLikePreviews;
};

const getUserLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const postLikes = await PostLike.find({ postId })
      .populate("userId", "username")
      .sort("-createdAt");

    return res.json(postLikes);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getUserLikedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, sortBy } = req.query;

    let sortCondition = "-createdAt";
    if (sortBy) sortCondition = sortBy;

    const userPostLikes = await PostLike.find({ userId: id })
      .populate({
        path: "postId",
        populate: {
          path: "poster",
          select: "-password",
        },
      })
      .sort(sortCondition);

    const count = userPostLikes.length;

    const paginatedUserPostLikes = paginate(userPostLikes, USER_LIKES_PAGE_SIZE, page);

    return res.json({
      data: paginatedUserPostLikes.map((userPostLike) => userPostLike.postId),
      count,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

// controllers/PostController.js



// Example: Creating a notification for when someone likes a post
const createLikeNotification = async (postId, senderId, recipientId) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: 'like',
      postId: postId
    });
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    throw err;
  }
};

// Example API functions (replace with actual implementation)
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
  createPost,
  getPost,
  updatePost,
  deletePost,
  getPosts,
  likePost,
  unlikePost,
  getUserLikes,
  getUserLikedPosts,
  createLikeNotification,
};
