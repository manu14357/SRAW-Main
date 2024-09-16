import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  Avatar,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

const adsData = [
  {
    id: 1,
    company: "Mrcitsoft Innovations Pvt. Ltd",
    title: "Empowering Your Digital Future",
    content: "Unleash the power of innovation with our cutting-edge solutions designed to elevate your business to new heights.",
    profileImageUrl: "https://media.sraws.com/media/MRCITSOFT INNOVATIONS (4)_66d3df6dd88c1.png",
    media: {
      type: "video", // or "image"
      url: "https://sraws.mrcitsoft.com/media/mriti_668ab0c699e13.mp4", // Media URL (image or video)
    },
    websiteUrl: "https://www.mrcitsoft.com",
    contactInfo: {
      name: "",
      email: "info@mrcitsoft.com",
      phone: "",
    },
  },
  // Add more ads as needed
];

const MediaAdContainer = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const videoRefs = useRef([]);

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle opening the contact dialog
  const handleOpenContactDialog = (ad) => {
    setSelectedAd(ad);
    setDialogOpen(true);
  };

  // Handle closing the contact dialog
  const handleCloseContactDialog = () => {
    setSelectedAd(null);
    setDialogOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target;
        if (entry.isIntersecting) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });
    }, { threshold: 0.5 });

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  const currentAd = adsData[0]; // For demo purposes, using the first ad

  return (
    <>
      <Box sx={{ position: "relative", mb: 2 }}>
        <Card
          variant="outlined"
          sx={{
            p: 2,
            mb: 0,
            width: "100%",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            // Removed hover effect
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                src={currentAd.profileImageUrl}
                alt={currentAd.company}
                sx={{ width: 64, height: 64, marginRight: 2, borderRadius: '50%' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                  {currentAd.company}
                </Typography>
                <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                  {currentAd.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  {currentAd.content}
                </Typography>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenContactDialog(currentAd);
                  }}
                  sx={{ display: "inline-block" }}
                >
                  <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                    Learn More
                  </Button>
                </Link>
              </Box>
            </Box>
            <Tooltip title="More Options">
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Media Section */}
          <Box sx={{ mb: 2 }}>
            {currentAd.media.type === "image" ? (
              <img
                src={currentAd.media.url}
                alt="Ad Media"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 8,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <video
                ref={(el) => videoRefs.current.push(el)}
                src={currentAd.media.url}
                controls
                style={{
                  width: "100%",
                  borderRadius: 8,
                  height: 'auto',
                }}
              />
            )}
          </Box>
        </Card>

        {/* Menu for options */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleOpenContactDialog(currentAd);
              handleMenuClose();
            }}
          >
            About Ad Info
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleOpenContactDialog(null);
              handleMenuClose();
            }}
          >
            Advertise with Us
          </MenuItem>
        </Menu>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseContactDialog}>
        <DialogTitle>{selectedAd ? selectedAd.title : "Advertise with Us"}</DialogTitle>
        <DialogContent>
          {selectedAd ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ mb: 0 }}>
                <Typography variant="body1">{selectedAd.content}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle1">Company:</Typography>
                <Typography>{selectedAd.company}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Website:</Typography>
                <Link href={selectedAd.websiteUrl} target="_blank" rel="noopener">
                  {selectedAd.websiteUrl}
                </Link>
              </Box>
              <Box>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography>{selectedAd.contactInfo.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Phone:</Typography>
                {selectedAd.contactInfo.phone ? (
                  <Typography>{selectedAd.contactInfo.phone}</Typography>
                ) : (
                  <Typography>No phone number provided</Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1">
                Interested in advertising with us? Contact us at:
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Email: ads@team.sraws.com
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MediaAdContainer;
