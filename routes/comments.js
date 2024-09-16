const express = require("express");
const router = express.Router();
const commentControllers = require("../controllers/commentControllers");
const { verifyToken } = require("../middleware/auth");

// Existing routes for updating, creating, deleting, and fetching comments
router.patch("/:id", verifyToken, commentControllers.updateComment);
router.post("/:id", verifyToken, commentControllers.createComment);
router.delete("/:id", verifyToken, commentControllers.deleteComment);
router.get("/post/:id", commentControllers.getPostComments);
router.get("/user/:id", commentControllers.getUserComments);

// New route for replying to a comment
router.post("/reply", verifyToken, commentControllers.replyToComment);

module.exports = router;
