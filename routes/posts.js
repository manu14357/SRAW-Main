const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const { verifyToken, optionallyVerifyToken } = require("../middleware/auth");

router.get("/", optionallyVerifyToken, postControllers.getPosts);
router.post("/", verifyToken, postControllers.createPost);

router.get("/:id", optionallyVerifyToken, postControllers.getPost);
router.patch("/:id", verifyToken, postControllers.updatePost);
router.delete("/:id", verifyToken, postControllers.deletePost);

router.post("/like/:id", verifyToken, postControllers.likePost);
router.delete("/like/:id", verifyToken, postControllers.unlikePost);
router.get(
  "/liked/:id",
  optionallyVerifyToken,
  postControllers.getUserLikedPosts
);
router.get("/like/:postId/users", postControllers.getUserLikes);




const Report = require('../models/Report');

router.post('/:postId/report', async (req, res) => {
  try {
    const { postId } = req.params;
    const { reporter } = req.body;

    const report = new Report({
      post: postId,
      reporter: reporter,
      reportedAt: new Date(),
    });

    await report.save();

    res.status(200).json({ message: 'Post reported successfully' });
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).json({ error: 'An error occurred while reporting the post' });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Set SEO meta tags
    const pageTitle = `${post.title} - Your Website Name`;
    const pageDescription = `${post.title} - ${post.content.substring(0, 160)}...`; // Limit description to 160 characters
    const pageKeywords = `${post.title}, ${post.tags.join(", ")}, ${post.author}`; // Example assuming post.tags and post.author exist

    res.render("postDetail", { post, pageTitle, pageDescription, pageKeywords });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});








module.exports = router;
