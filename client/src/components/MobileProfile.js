import { useTheme } from "@emotion/react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  Box
} from "@mui/material";
import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdCancel, MdShare, MdContentCopy } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa";
import QRCode from "qrcode.react";
import { isLoggedIn } from "../helpers/authHelper";
import ContentUpdateEditor from "./ContentUpdateEditor";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const MobileProfile = (props) => {
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for Social Points dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false); // State for Share Profile dialog
  const [shareUrl, setShareUrl] = useState(""); // State for dynamically generated share URL
  const [copySuccess, setCopySuccess] = useState(""); // State for copy-to-clipboard feedback
  const currentUser = isLoggedIn();
  const theme = useTheme();
  const iconColor = theme.palette.primary.main; // This is the share icon color
  const qrCodeColor = "#00aaff"; // Light blue color for the QR code

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);
    }
  }, [props.profile]);

  useEffect(() => {
    if (user) {
      setShareUrl(`http://localhost:3000/users/${user.username}`);
    }
  }, [user]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleShareDialogOpen = () => {
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => setCopySuccess("URL copied to clipboard!"))
      .catch((error) => setCopySuccess("Failed to copy URL."));
  };

  return (
    <>
      <Card sx={{ display: { sm: "block", md: "none" }, mb: 2, p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          <HorizontalStack alignItems="center" spacing={2} justifyContent="space-between">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <UserAvatar width={50} height={50} username={user.username} />
              <Typography variant="h6" sx={{ ml: 1 }}>
                {user.username}
              </Typography>
            </Box>
            <Box>
              {currentUser && user._id === currentUser.userId && (
                <IconButton onClick={props.handleEditing} sx={{ mr: 1 }}>
                  {props.editing ? (
                    <MdCancel color={iconColor} />
                  ) : (
                    <AiFillEdit color={iconColor} />
                  )}
                </IconButton>
              )}
              <IconButton onClick={handleShareDialogOpen}>
                <MdShare color={iconColor} />
              </IconButton>
            </Box>
          </HorizontalStack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2} direction="row" justifyContent="center">
            <Stack alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                Likes
              </Typography>
              <Typography variant="h6" color="text.primary">
                <b>{props.profile.posts.likeCount}</b>
              </Typography>
            </Stack>
            <Stack alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                Posts
              </Typography>
              <Typography variant="h6" color="text.primary">
                <b>{props.profile.posts.count}</b>
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2} direction="row" justifyContent="center">
            <Stack alignItems="center" sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ cursor: "pointer", fontWeight: 'bold', color: theme.palette.secondary.main }}
                onClick={handleDialogOpen} // Open dialog on click
              >
                Social Points
              </Typography>
              <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold' }}>
                <b>{Math.floor(user.socialPoints)}</b>
              </Typography>
                          <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: "bold",
                borderRadius: "4px",
                padding: "4px 8px",
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(0, 123, 255, 0.1)", // Light blue background on hover
                  color: "primary.main",
                },
                display: "inline-block",
                mt: 1
              }}
              onClick={handleDialogOpen}
            >
              How to Earn Social Points
            </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>
            {user.biography ? (
              <Typography variant="body1" sx={{ mt: 2 }}>
                <b>Bio: </b>
                {user.biography}
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                <i>
                  No bio yet{" "}
                  {currentUser && user._id === currentUser.userId && (
                    <span>- Tap on the edit icon to add your bio</span>
                  )}
                </i>
              </Typography>
            )}

            {currentUser && user._id !== currentUser.userId && (
              <Button variant="outlined" onClick={props.handleMessage} sx={{ mt: 2 }}>
                Message
              </Button>
            )}

            {props.editing && (
              <Box mt={2}>
                <ContentUpdateEditor
                  handleSubmit={props.handleSubmit}
                  originalContent={user.biography}
                  validate={props.validate}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </Card>

      {/* Dialog for Social Points */}
<Dialog open={dialogOpen} onClose={handleDialogClose}>
  <DialogTitle>How to Earn Social Points</DialogTitle>
  <DialogContent>
    <Typography variant="body1">
      You can earn Social Points through various activities on the platform:
      <ul>
        <li><b>Post a new post:</b> Earn 5 points for each post you create.</li>
        <li><b>Like a post:</b> Earn 2 points for each like you give on any post.</li>
        <li><b>Comment on a post:</b> Earn 3 points for each comment you make on a post.</li>
      </ul>
      <Typography variant="body2">
        For more information, check out our <a href="/help">Help Center</a>.
      </Typography>
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDialogClose}>Close</Button>
  </DialogActions>
</Dialog>


      {/* Dialog for Share Profile */}
      <Dialog open={shareDialogOpen} onClose={handleShareDialogClose} maxWidth="sm">
        <DialogTitle>Share Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems="center">
            <QRCode
              value={shareUrl}
              size={128}
              fgColor={qrCodeColor} // Light blue color for QR code
              bgColor="#F9F9F9"
            />
            <Typography variant="body1" sx={{ mt: 1 }}>
              Share this profile using the options below:
            </Typography>
            <Stack spacing={2} direction="row">
              <Tooltip title="Share on WhatsApp">
                <IconButton
                  component="a"
                  href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                >
                  <FaWhatsapp color={iconColor} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share on Facebook">
                <IconButton
                  component="a"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                >
                  <FaFacebookF color={iconColor} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share on Twitter">
                <IconButton
                  component="a"
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                >
                  <FaTwitter color={iconColor} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share on Instagram">
                <IconButton
                  component="a"
                  href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                >
                  <FaInstagram color={iconColor} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCopyToClipboard}
              sx={{ mt: 2 }}
            >
              <MdContentCopy /> Copy URL
            </Button>
            {copySuccess && <Typography variant="body2" color="success.main">{copySuccess}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MobileProfile;
