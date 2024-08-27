import { useTheme, useMediaQuery } from "@mui/material";
import {
  Avatar,
  Button,
  Card,
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Box,
  Chip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdShare, MdContentCopy } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa";
import QRCode from "qrcode.react";
import { isLoggedIn } from "../helpers/authHelper";
import ContentUpdateEditor from "./ContentUpdateEditor";
import Loading from "./Loading";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [socialPointsDialogOpen, setSocialPointsDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const currentUser = isLoggedIn();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const iconColor = theme.palette.primary.main;
  const qrCodeColor = "#00aaff"; // Light blue color for QR code
  const socialPointsColor = "#007bff"; // Highlight color for social points

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);
      setShareUrl(`http://localhost:3000/users/${props.profile.user.username}`);
    }
  }, [props.profile]);

  const handleShareDialogOpen = () => {
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handleSocialPointsDialogOpen = () => {
    setSocialPointsDialogOpen(true);
  };

  const handleSocialPointsDialogClose = () => {
    setSocialPointsDialogOpen(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => setCopySuccess("URL copied to clipboard!"))
      .catch((error) => setCopySuccess("Failed to copy URL."));
  };

  return (
    <Card sx={{ width: '100%', maxWidth: isMobile ? '100%' : 600 }}>
      {user ? (
        <Stack alignItems="center" spacing={2} sx={{ p: 2 }}>
          <Box my={1}>
            <UserAvatar width={150} height={150} username={user.username} />
          </Box>

          <Typography variant="h5">{user.username}</Typography>

          {props.editing ? (
            <Box sx={{ width: '100%' }}>
              <ContentUpdateEditor
                handleSubmit={props.handleSubmit}
                originalContent={user.biography}
                validate={props.validate}
              />
            </Box>
          ) : user.biography ? (
            <Typography textAlign="center" variant="body1">
              <b>Bio: </b>
              {user.biography}
            </Typography>
          ) : (
            <Typography variant="body1">
              <i>No bio yet</i>
            </Typography>
          )}

          {/* Social Points Display with Highlight */}
          <Box mt={2} sx={{ textAlign: "center", mb: 2 }}>
            <Chip
              label={`Social Points: ${Math.floor(user.socialPoints)}`}
              color="primary"
              sx={{
                backgroundColor: socialPointsColor,
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "0.9rem" : "1rem",
                padding: "6px 16px 12px 16px",
                borderRadius: "16px",
                cursor: "pointer",
                mx: "auto", // Center horizontally
                display: "inline-block",
                textAlign: "center"
              }}
              onClick={handleSocialPointsDialogOpen} // Open dialog on click
            />
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
              onClick={handleSocialPointsDialogOpen}
            >
              How to Earn Social Points
            </Typography>
          </Box>

          {currentUser && user._id === currentUser.userId && (
            <Box>
              <Button
                startIcon={<AiFillEdit color={iconColor} />}
                onClick={props.handleEditing}
                sx={{ width: isMobile ? '100%' : 'auto' }}
              >
                {props.editing ? <>Cancel</> : <>Edit bio</>}
              </Button>
            </Box>
          )}

          {currentUser && user._id !== currentUser.userId && (
            <Button
              variant="outlined"
              onClick={props.handleMessage}
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              Message
            </Button>
          )}

          <HorizontalStack>
            <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
              Likes <b>{props.profile.posts.likeCount}</b>
            </Typography>
            <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
              Posts <b>{props.profile.posts.count}</b>
            </Typography>
          </HorizontalStack>

          <Box mt={2}>
            <IconButton onClick={handleShareDialogOpen}>
              <MdShare color={iconColor} />
            </IconButton>
          </Box>

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
                <Stack spacing={2} direction={isMobile ? "column" : "row"}>
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
                  sx={{ mt: 2, width: '100%' }}
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

          {/* Dialog for Social Points */}
          <Dialog open={socialPointsDialogOpen} onClose={handleSocialPointsDialogClose}>
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
              <Button onClick={handleSocialPointsDialogClose}>Close</Button>
            </DialogActions>
          </Dialog>

        </Stack>
      ) : (
        <Loading />
      )}
    </Card>
  );
};

export default Profile;
