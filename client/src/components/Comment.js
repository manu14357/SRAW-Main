import { Button, IconButton, Typography, useTheme, Menu, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { AiFillEdit, AiOutlineLine, AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";
import CommentEditor from "./CommentEditor";
import ContentDetails from "./ContentDetails";
import HorizontalStack from "./util/HorizontalStack";
import { deleteComment, updateComment } from "../api/posts";
import ContentUpdateEditor from "./ContentUpdateEditor";
import Markdown from "./Markdown";
import { MdCancel } from "react-icons/md";
import { BsReplyFill } from "react-icons/bs";
import Moment from "react-moment";
import { BiTrash,BiDotsHorizontal } from "react-icons/bi";

const Comment = (props) => {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const { depth, addComment, removeComment, editComment } = props;
  const commentData = props.comment;
  const [minimised, setMinimised] = useState(depth % 4 === 3);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(commentData || {});
  const [anchorEl, setAnchorEl] = useState(null);
  const user = isLoggedIn();
  const isAuthor = user && user.userId === comment?.commenter?._id;
  const navigate = useNavigate();

  const handleSetReplying = () => {
    if (isLoggedIn()) {
      setReplying(!replying);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;

    if (comment && comment._id) {
      try {
        await updateComment(comment._id, user, { content });
        const newCommentData = { ...comment, content, edited: true };
        setComment(newCommentData);
        editComment(newCommentData);
        setEditing(false);
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (comment && comment._id) {
      try {
        await deleteComment(comment._id, user);
        removeComment(comment);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditing(!editing);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    handleDelete();
    handleMenuClose();
  };

  let style = {
    backgroundColor: theme.palette.grey[100],
    borderRadius: 1.5,
    mb: theme.spacing(2),
    padding: theme.spacing(0),
  };

  if (depth % 2 === 1) {
    style.backgroundColor = "white";
  }

  if (!comment || !comment.commenter) {
    return null; // or a fallback UI indicating loading state or missing data
  }

  return (
    <Box sx={style}>
      <Box
        sx={{
          pl: theme.spacing(2),
          pt: theme.spacing(1),
          pb: theme.spacing(1),
          pr: 1,
        }}
      >
        {props.profile ? (
          <Box>
            <Typography variant="h6">
              <Link underline="hover" to={`/posts/${comment.post?._id}`}>
                {comment.post?.title}
              </Link>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <Moment fromNow>{comment.createdAt}</Moment>{" "}
              {comment.edited && <>(Edited)</>}
            </Typography>
          </Box>
        ) : (
          <HorizontalStack justifyContent="space-between">
            <HorizontalStack>
              <ContentDetails
                username={comment.commenter.username}
                createdAt={comment.createdAt}
                edited={comment.edited}
              />
              <IconButton
                color="primary"
                onClick={() => setMinimised(!minimised)}
              >
                {minimised ? (
                  <AiOutlinePlus size={15} />
                ) : (
                  <AiOutlineLine size={15} />
                )}
              </IconButton>
            </HorizontalStack>
            {!minimised && (
              <HorizontalStack spacing={1}>
                <IconButton
                  variant="text"
                  size="small"
                  onClick={handleSetReplying}
                >
                  {!replying ? (
                    <BsReplyFill color={iconColor} />
                  ) : (
                    <MdCancel color={iconColor} />
                  )}
                </IconButton>
                {user && (isAuthor || user.isAdmin) && (
                  <IconButton
                    variant="text"
                    size="small"
                    onClick={handleMenuClick}
                  >
                    <BiDotsHorizontal color={iconColor} />
                  </IconButton>
                )}
              </HorizontalStack>
            )}
          </HorizontalStack>
        )}

        {!minimised && (
          <Box sx={{ mt: 1 }} overflow="hidden">
            {!editing ? (
              <Markdown content={comment.content} />
            ) : (
              <ContentUpdateEditor
                handleSubmit={handleSubmit}
                originalContent={comment.content}
              />
            )}

            {replying && !minimised && (
              <Box sx={{ mt: 2 }}>
                <CommentEditor
                  comment={comment}
                  addComment={addComment}
                  setReplying={setReplying}
                  label="What are your thoughts on this comment?"
                />
              </Box>
            )}
            {Array.isArray(comment.children) && comment.children.length > 0 && (
              <Box sx={{ pt: theme.spacing(2) }}>
                {comment.children.map((reply) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    depth={depth + 1}
                    addComment={addComment}
                    removeComment={removeComment}
                    editComment={editComment}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <AiFillEdit color={iconColor} style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <BiTrash color={theme.palette.error.main} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Comment;
