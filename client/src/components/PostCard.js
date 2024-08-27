import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Tooltip,
  Snackbar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import { Box } from "@mui/system";
import { FaCheckCircle } from 'react-icons/fa';
import { AiFillCheckCircle, AiFillEdit, AiFillMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { deletePost, likePost, unlikePost, updatePost, reportPost } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import ContentDetails from "./ContentDetails";
import LikeBox from "./LikeBox";
import PostContentBox from "./PostContentBox";
import HorizontalStack from "./util/HorizontalStack";
import ContentUpdateEditor from "./ContentUpdateEditor";
import Markdown from "./Markdown";
import "./postCard.css";
import { MdCancel } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { FaShareAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Linkify from "react-linkify";
import { Helmet } from "react-helmet";
import ShareContainer from "./Share/ShareContainer";
import MediaCarousel from './MediaCarousel';

// Function to identify URLs and wrap them in a styled component
const renderContentWithLinks = (content) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return parts.map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};



const PostCard = ({ post: initialPost, preview, removePost }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [post, setPost] = useState(initialPost);
  const [likeCount, setLikeCount] = useState(initialPost.likeCount);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(null); // Track content height

  const navigate = useNavigate();
  const user = isLoggedIn();
  const isAuthor = user && user.username === initialPost.poster.username;
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  const maxHeight = preview === "primary" ? 250 : null;

  useEffect(() => {
    let resizeObserver;
    const contentRefCurrent = contentRef.current;
  
    const handleResize = () => {
      if (contentRefCurrent) {
        setContentHeight(contentRefCurrent.clientHeight);
      }
    };
  
    // Initialize ResizeObserver
    if (contentRefCurrent) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(contentRefCurrent);
    }
  
    // Cleanup function
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []); // Depend on contentRef to handle changes
  

  const contentRef = React.useRef(null);

  const handleDeletePost = async () => {
    setLoading(true);
    await deletePost(post._id, isLoggedIn());
    setLoading(false);
    if (preview) {
      removePost(post);
    } else {
      navigate("/");
    }
  };

  const handleEditPost = (e) => {
    e.stopPropagation();
    setEditing(!editing);
    handleMenuClose(); // Close the menu when editing is toggled
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    await updatePost(post._id, isLoggedIn(), { content });
    setPost({ ...post, content, edited: true });
    setEditing(false);
  };

  const handleLike = async (liked) => {
    if (liked) {
      setLikeCount(likeCount + 1);
      await likePost(post._id, user);
    } else {
      setLikeCount(likeCount - 1);
      await unlikePost(post._id, user);
    }
  };

  const generateShareLink = () => {
    const baseUrl = "http://localhost:3000";
    return `${baseUrl}/posts/${post._id}`;
  };

const handleShare = () => {
  const shareLink = generateShareLink();
  navigator.clipboard.writeText(shareLink);
  setSnackbarMessage('Link copied successfully'); // Set the snackbar message
  setSnackbarOpen(true);
};


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };



const [snackbarMessage, setSnackbarMessage] = useState('');

const handleReportPost = async () => {
  if (user) {
    try {
      await reportPost(post._id, user);
      setSnackbarMessage('Reported successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error reporting post:", error);
      setSnackbarMessage('Error reporting');
      setSnackbarOpen(true);
    }
  } else {
    alert("You need to be logged in to report a post.");
  }
  handleMenuClose();
};

  

  const generateEmbedCode = () => {
    const baseUrl = "http://localhost:3000";
    const embedUrl = `${baseUrl}/posts/${post._id}`;
    const iframeCode = `<iframe src="${embedUrl}" width="400" height="300"></iframe>`;
    return iframeCode;
  };

  const handleEmbedPost = () => {
    setEmbedDialogOpen(true);
    handleMenuClose();
  };

  const handleEmbedDialogClose = () => {
    setEmbedDialogOpen(false);
  };

 const handleCopyEmbedCode = () => {
  const iframeCode = generateEmbedCode();
  navigator.clipboard.writeText(iframeCode);
  setEmbedDialogOpen(false);
  setSnackbarMessage("Embed link copied successfully!"); // Update snackbar message
  setSnackbarOpen(true);
};


  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <Card sx={{ padding: 0 }} className="post-card">
     <Helmet>
        <meta charSet="utf-8" />
        <title>SRAWS - Scam Reporting & Alert Platform</title>
        
        <meta name="title" content={post.metaTitle}/>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.metaKeywords} />
      </Helmet>
      <Box className={preview}>
        <HorizontalStack spacing={0} alignItems="initial">
          <Stack
            justifyContent="end"
            alignItems="center"
            spacing={1}
            sx={{
              backgroundColor: "grey.100",
              width: "50px",
              padding: theme.spacing(1),
            }}
          >
            <Tooltip title="More options" arrow>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ marginBottom: theme.spacing(1) }}
              >
                <BsThreeDotsVertical color={iconColor} />
              </IconButton>
            </Tooltip>
             <ShareContainer link={generateShareLink()} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isAuthor && (
                <MenuItem onClick={handleEditPost}>
                  {editing ? "Cancel Edit" : "Edit"}
                </MenuItem>
              )}
              {isAuthor && (
                <MenuItem onClick={openConfirmDialog}>
                  Delete
                </MenuItem>
              )}
              <MenuItem onClick={handleEmbedPost}>Embed this post</MenuItem>
              <MenuItem onClick={handleReportPost}>Report this post</MenuItem>
      
            </Menu>
           
            <LikeBox
              likeCount={likeCount}
              liked={post.liked}
              onLike={handleLike}
            />
          </Stack>

          <PostContentBox
            clickable={preview}
            post={post}
            editing={editing}
            maxHeight={maxHeight}
          >
            <HorizontalStack justifyContent="space-between">
            <ContentDetails
               username={post.poster.username}
               createdAt={post.createdAt}
               edited={post.edited}
              preview={preview === "secondary"}
              isAdmin={post.poster.isAdmin} // Pass isAdmin prop here
             />

            </HorizontalStack>

            {post.address && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                     {`${post.address.area ? `${post.address.area}, ` : ''}${post.address.city ? `${post.address.city}, ` : ''}${post.address.state ? `${post.address.state}, ` : ''}${post.address.country}`}
                </Typography>
            )}


            <Typography
              variant="h6"
              gutterBottom
              sx={{
                overflow: "hidden",
                mt: 0,
                maxHeight: 125,
                fontWeight: "bold",
              }}
              className="title"
            >
              {post.title}
            </Typography>
           <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
    <a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
      {decoratedText}
    </a>
  )}
>
  {editing ? (
    <ContentUpdateEditor
      handleSubmit={handleSubmit}
      originalContent={post.content}
    />
  ) : (
    <Box
      maxHeight={maxHeight}
      overflow="hidden"
      className="content"
      ref={contentRef}
      style={{ whiteSpace: "pre-wrap" }} // Ensure spaces and line breaks are preserved
    >
      {renderContentWithLinks(post.content)}
    </Box>
  )}
</Linkify>

<Box>
  {post.mediaUrls && post.mediaUrls.length > 0 && (
    <MediaCarousel mediaUrls={[...new Set(post.mediaUrls)]} />
  )}
</Box>








            <HorizontalStack alignItems="center" mt={1}>
                <AiFillMessage style={{ color: '#1976d2' }} /> {/* Blue color */}
                     <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontWeight: "bold", ml: 1 }} // Add left margin for spacing
                       >
                       {post.commentCount}
                      </Typography>
             </HorizontalStack>

          </PostContentBox>
        </HorizontalStack>
        <Dialog
  open={embedDialogOpen}
  onClose={handleEmbedDialogClose}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Embed Post</DialogTitle>
  <DialogContent dividers>
    <Typography variant="body1" gutterBottom>
      Copy and paste the following HTML code to embed this post:
    </Typography>
    <Box sx={{ backgroundColor: "#f2f2f2", p: 2, borderRadius: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={generateEmbedCode()}
        InputProps={{
          readOnly: true,
          sx: { fontFamily: "monospace" }, // Use monospace font for code
        }}
        variant="outlined"
      />
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleEmbedDialogClose} color="primary">
      Close
    </Button>
    <Button onClick={handleCopyEmbedCode} color="primary" variant="contained">
      Copy Embed Code
    </Button>
  </DialogActions>
</Dialog>
        <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this post?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeletePost} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>


<Snackbar
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  message={snackbarMessage}
  action={
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => setSnackbarOpen(false)}
    >
      <MdCancel fontSize="small" />
    </IconButton>
  }
/>


      </Box>
    </Card>
  );
};

export default PostCard;
