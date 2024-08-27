const mongoose = require("mongoose");
const Post = require("./Post");
const filter = require("../util/filter");

const CommentSchema = new mongoose.Schema(
  {
    commenter: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Ensure this matches the model name defined in User.js
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post", // Ensure this matches the model name defined in Post.js
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Comment", // Ensure this matches the model name defined in this file
    },
    children: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment", // Ensure this matches the model name defined in this file
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CommentSchema.post("remove", async function (doc, next) {
  const comments = await this.model("Comment").find({ parent: doc._id });

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    await comment.remove();
  }

  next();
});

CommentSchema.pre("save", function (next) {
  if (this.content.length > 0) {
    this.content = filter.clean(this.content);
  }

  next();
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
