import axios from 'axios';
import { BASE_URL } from "../config";

// Function to fetch a post by its ID
const getPost = async (postId, token) => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts/${postId}`, {
      headers: {
        "x-access-token": token,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Function to create a new post
const createPost = async (post, user) => {
  try {
    const res = await axios.post(`${BASE_URL}api/posts`, post, {
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Failed to create post:', err);
    return { error: err.response.data.message || 'Failed to create post' };
  }
};

// Function to update a post by its ID
const updatePost = async (postId, user, data) => {
  try {
    const res = await axios.patch(`${BASE_URL}api/posts/${postId}`, data, {
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Function to delete a post by its ID
const deletePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

// Function to get a list of posts with query parameters
const getPosts = async (token, query) => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts`, {
      headers: {
        "x-access-token": token,
      },
      params: query,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Function to get posts liked by a user
const getUserLikedPosts = async (likerId, token, query) => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts/liked/${likerId}`, {
      headers: {
        "x-access-token": token,
      },
      params: query,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Function to like a post
const likePost = async (postId, user) => {
  try {
    const res = await axios.post(`${BASE_URL}api/posts/like/${postId}`, null, {
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Function to unlike a post
const unlikePost = async (postId, user) => {
  try {
    const res = await axios.delete(`${BASE_URL}api/posts/like/${postId}`, {
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const getComments = async (params) => {
  try {
    const { id } = params;
    const res = await fetch(BASE_URL + "api/comments/post/" + id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUserComments = async (params) => {
  try {
    const { id, query } = params;
    const res = await fetch(
      BASE_URL + "api/comments/user/" + id + "?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const createComment = async (comment, params, user) => {
  try {
    const { id } = params;
    const res = await fetch(BASE_URL + "api/comments/" + id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(comment),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateComment = async (commentId, user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/comments/" + commentId, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteComment = async (commentId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/comments/" + commentId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};
// Function to like a comment
const likeComment = async (commentId, user) => {
  try {
    const res = await axios.post(`${BASE_URL}api/comments/like/${commentId}`, {
      userId: user.userId,
    }, {
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Function to unlike a comment
const unlikeComment = async (commentId, user) => {
  try {
    const res = await axios.delete(`${BASE_URL}api/comments/like/${commentId}`, {
      headers: {
        "x-access-token": user.token,
      },
      data: {
        userId: user.userId,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Function to get users who liked a post
const getUserLikes = async (postId, anchor) => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts/like/${postId}/users`, {
      params: { anchor },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};



const reportPost = async (postId, user) => {
  if (!user || !user.token) {
    throw new Error('User is not logged in');
  }

  try {
    const response = await axios.post(`/api/posts/${postId}/report`, { reporter: user.username }, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error reporting post:', error);
    throw error;
  }
};

const getUserPosts = async (userId, token) => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts/user/${userId}`, {
      headers: {
        "x-access-token": token,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("media", file);

  try {
    const response = await fetch("http://localhost/uploads/upload.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.url;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};


// Example API functions (replace with actual implementation)
const getNotifications = async () => {
  try {
    const response = await fetch("/api/notifications");
    const data = await response.json();
    return data.notifications;
  } catch (error) {
    throw new Error("Error fetching notifications:", error);
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: "PUT",
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    throw new Error("Error marking notification as read:", error);
  }
};


export {
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getUserComments,
  getUserLikedPosts,
  getComments,
  createComment,
  deleteComment,
  updateComment,
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  getUserLikes,
  reportPost,
  getUserPosts,
  uploadMedia,
  markNotificationAsRead,
 getNotifications,

};
