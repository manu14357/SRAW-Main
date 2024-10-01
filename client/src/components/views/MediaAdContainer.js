import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
import { Helmet } from "react-helmet";

const adsData = [
  {
    id: 1,
    company: "Mrcitsoft Innovations Pvt. Ltd",
    title: "🚀 Get Your Professional Website for Just ₹1499! 🚀",
    content:
      "🚀 Take your business online with a professional, modern website for just ₹1499! 🌐 Get a fully customized, responsive, and SEO-friendly website tailored to your needs. Limited-time offer! ✅ Don't miss out – contact us today to get started and watch your business grow! 📈",
    profileImageUrl:
      "https://media.sraws.com/media/MRCITSOFT%20INNOVATIONS%20(4)_66d3df6dd88c1.png",
    media: {
      type: "image",
      url: "https://media.sraws.com/media/manu_1226/White-Purple-Blue-Modern-Website-Development-Facebook-Post_66f92a8badd3f.png",
    },
    websiteUrl: "https://www.mrcitsoft.com",
    contactInfo: {
      name: "Mrcitsoft Innovations Pvt Ltd",
      email: "info@mrcitsoft.com",
      phone: "+91-7032032612",
    },
  },
  // Add more ads as needed
];

const MediaAdContainer = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const videoRefs = useRef([]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenContactDialog = (ad) => {
    setSelectedAd(ad);
    setDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setSelectedAd(null);
    setDialogOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  return (
    <>

      <Helmet>
        <title>Promotional Ads - Boost Your Business | Sraws</title>
        <meta
          name="description"
          content="Check out the latest ads promoting various businesses. Learn more about affordable professional services and special offers!"
        />
        <meta name="keywords" content="ads, business promotion, website design, SEO, marketing" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Professional Ads and Promotions" />
        <meta property="og:description" content="Explore promotional offers for professional websites and business services." />
      </Helmet>
      {adsData.map((ad) => (
        <Box key={ad.id} sx={{ position: "relative", mb: 2 }}>
          {/* Promoted Label */}


          <Card
            variant="outlined"
            sx={{
              p: 2,
              mb: 0,
              width: "100%",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={ad.profileImageUrl}
                  alt={ad.company}
                  sx={{ width: 64, height: 64, marginRight: 2, borderRadius: '50%' }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 0.1, fontWeight: 'bold' }}>
                    {ad.company}
                  </Typography>
                  <Typography
                  variant="caption" // Changed to caption for smaller text
                      sx={{
                          mb: 0.5,
                          fontWeight: 'bold',
                          color: 'primary.main', 
                          }}
                    >
                   Promoted
                   </Typography>
                </Box>
              </Box>
              <Tooltip title="More Options">
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                {ad.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "black", mb: 1 }}>
                {ad.content}
              </Typography>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenContactDialog(ad);
                }}
                sx={{ display: "inline-block" }}
              >
                <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                  Learn More
                </Button>
              </Link>
            </Box>

            {/* Media Section */}
            <Box sx={{ mb: 2 }}>
              {ad.media.type === "image" ? (
                <img
                  src={ad.media.url}
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
                  src={ad.media.url}
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
                handleOpenContactDialog(ad);
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
      ))}

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
                Email: ads@sraws.com
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

MediaAdContainer.propTypes = {
  ads: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      company: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      profileImageUrl: PropTypes.string.isRequired,
      media: PropTypes.shape({
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
      websiteUrl: PropTypes.string.isRequired,
      contactInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string,
      }).isRequired,
    })
  ),
};

export default MediaAdContainer;
