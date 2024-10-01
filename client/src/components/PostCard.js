import React, { useState, useEffect, useRef } from "react";
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
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup
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
import Collapse from '@mui/material/Collapse';

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
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [contentHeight, setContentHeight] = useState(null); // Track content height
  const [customReason, setCustomReason] = useState('');
  const navigate = useNavigate();
  const user = isLoggedIn();
  const isAuthor = user && user.username === initialPost.poster.username;
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  const maxHeight = preview === "primary" ? 250 : null;

  const contentRef = useRef(null);

  useEffect(() => {
    const contentRefCurrent = contentRef.current;
  
    if (!contentRefCurrent) return;
  
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        setContentHeight(contentRefCurrent.clientHeight);
      });
    });
  
    resizeObserver.observe(contentRefCurrent);
  
    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  

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
    const baseUrl = "https://sraws.com";
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

  const handleReportPost = () => {
    if (user) {
      setReportDialogOpen(true);
      handleMenuClose();
    } else {
      alert("You need to be logged in to report a post.");
    }
  };

  const handleReportSubmit = async () => {
    let reason = reportReason === 'other' ? customReason : reportReason;
  
    try {
      await reportPost(post._id, user, reason); // Submitting the reason
      setSnackbarMessage('Reported successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error reporting post:", error);
      setSnackbarMessage('Error reporting');
      setSnackbarOpen(true);
    }
    setReportDialogOpen(false);
  };
  
  

  const generateEmbedCode = () => {
    const baseUrl = "https://sraws.com";
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
        <meta name="title" content={post.metaTitle} />
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
  maxWidth="md"
  sx={{
    '& .MuiDialog-paper': {
      borderRadius: '16px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: '#1976d2',
      color: '#fff',
      fontWeight: 'bold',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      textAlign: 'center',
    }}
  >
    Embed Post
  </DialogTitle>
  <DialogContent dividers sx={{ padding: { xs: '16px', sm: '24px' } }}>
    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
      Copy and paste the following HTML code to embed this post:
    </Typography>
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        p: { xs: 1, sm: 2 },
        borderRadius: '8px',
        mb: 2,
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.12)',
      }}
    >
      <TextField
        fullWidth
        multiline
        rows={4}
        value={generateEmbedCode()}
        InputProps={{
          readOnly: true,
          sx: { fontFamily: "monospace", fontSize: '0.875rem' }, // Monospace font for code
        }}
        variant="outlined"
        sx={{
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      />
    </Box>
    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
      Preview:
    </Typography>
    <Box
      sx={{
        width: '100%',
        height: { xs: '200px', sm: '300px' },
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px solid #ddd',
        position: 'relative',
      }}
    >
      <iframe
        src={generateEmbedCode().match(/src="([^"]*)"/)[1]} // Extract URL from the embed code
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        title="Post Preview"
        sx={{ borderRadius: '8px', transition: 'transform 0.3s ease' }}
        onLoad={(e) => e.currentTarget.style.transform = 'scale(1.01)'} // Slight zoom effect on load
      />
    </Box>
  </DialogContent>
  <DialogActions
    sx={{
      padding: { xs: '8px', sm: '16px' },
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: '8px', sm: '16px' },
    }}
  >
    <Button
      onClick={handleEmbedDialogClose}
      sx={{
        textTransform: 'none',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
        '&:hover': { backgroundColor: '#e0e0e0' },
        width: { xs: '100%', sm: 'auto' }, // Full width on small screens
      }}
      color="primary"
    >
      Cancel
    </Button>
    <Button
      onClick={handleCopyEmbedCode}
      sx={{
        textTransform: 'none',
        borderRadius: '8px',
        backgroundColor: '#1976d2',
        color: '#fff',
        '&:hover': { backgroundColor: '#115293' },
        width: { xs: '100%', sm: 'auto' }, // Full width on small screens
      }}
      variant="contained"
    >
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

<Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>
    <Typography variant="h6" color="primary">
      Report Post
    </Typography>
  </DialogTitle>
  <DialogContent>
    <Typography variant="body2" gutterBottom>
      Please select a reason for reporting this post:
    </Typography>
    <FormControl fullWidth>
      <RadioGroup
        aria-labelledby="report-reason-group"
        name="report-reason-group"
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
      >
        {['Spam', 'Fake', 'Harassment', 'Hate Speech', 'Misinformation', 'Other'].map((label, index) => (
          <FormControlLabel 
            key={index} 
            value={label.toLowerCase().replace(" ", "_")} 
            control={<Radio color="primary" />} 
            label={
              <Typography variant="body1" style={{ fontWeight: '500' }}>
                {label}
              </Typography>
            } 
          />
        ))}
      </RadioGroup>
    </FormControl>

    {/* Custom reason field with animation */}
    <Collapse in={reportReason === 'other'}>
      <TextField
        fullWidth
        margin="normal"
        label="Please specify your reason"
        value={customReason}
        onChange={(e) => setCustomReason(e.target.value)}
        InputLabelProps={{ style: { color: '#1976d2' } }}
        InputProps={{
          style: { borderRadius: '8px' },
        }}
      />
    </Collapse>
  </DialogContent>
  <DialogActions style={{ padding: '16px' }}>
    <Button 
      onClick={() => setReportDialogOpen(false)} 
      style={{ textTransform: 'none', borderRadius: '8px' }} 
      color="primary"
    >
      Cancel
    </Button>
    <Button 
      onClick={handleReportSubmit} 
      style={{ textTransform: 'none', borderRadius: '8px', backgroundColor: '#1976d2', color: '#fff' }} 
      variant="contained"
    >
      Report
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
