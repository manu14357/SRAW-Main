import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Link,
  Divider,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

const adsData = [
  {
    id: 1,
    company: "Mrcitsoft Innovations Pvt. Ltd",
    title: "Empowering Your Digital Future",
    content: "Unleash the power of innovation with our cutting-edge solutions designed to elevate your business to new heights.",
    imageUrl: "https://media.sraws.com/media/MRCITSOFT INNOVATIONS (4)_66d3df6dd88c1.png",
    websiteUrl: "https://www.mrcitsoft.com",
    contactInfo: {
      name: "",
      email: "info@mrcitsoft.com",
      phone: "",  // Empty phone number to test hiding
    },
    companyInfo: {
      description: "At Mrcitsoft Innovations Pvt Ltd, we are pioneers in delivering advanced tech solutions that drive business success. From building dynamic websites to creating intuitive mobile apps and safeguarding your digital assets, we are dedicated to transforming your vision into reality.",
      mission: "To empower businesses with innovative technology, driving growth and excellence in the digital era.",
      vision: "To be the global leader in tech innovation, transforming industries with visionary solutions.",
      services: [
        "Website Development: Crafting visually stunning and highly functional websites tailored to your brand.",
        "Mobile App Development: Designing seamless mobile experiences that connect and engage users.",
        "Cybersecurity: Protecting your digital world with state-of-the-art security solutions.",
      ],
      address: "", // Empty address to test hiding
    },
  },
  // Add more ads as needed
];

const AdContainer = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  // Function to handle opening the contact dialog
  const handleOpenContactDialog = (ad) => {
    setSelectedAd(ad);
    setDialogOpen(true);
  };

  // Function to handle closing the contact dialog
  const handleCloseContactDialog = () => {
    setSelectedAd(null);
    setDialogOpen(false);
  };

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Cycle through ads every 30 seconds
  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adsData.length);
    }, 30000);

    return () => {
      clearInterval(adInterval);
    };
  }, []);

  const currentAd = adsData[currentAdIndex];

  return (
    <>
      <Box sx={{ position: "relative", mb: 2 }}>
        <Card
          variant="outlined"
          sx={{
            p: 2,
            mb: 0,
            width: "100%",
            border: "1px solid #e0e0e0",
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
                src={currentAd.imageUrl}
                alt={currentAd.company}
                sx={{ width: 64, height: 64, marginRight: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  {currentAd.company}
                </Typography>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {currentAd.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {currentAd.content}
                </Typography>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenContactDialog(currentAd);
                  }}
                  sx={{ mt: 1, display: "inline-block" }}
                >
                  Click to learn more
                </Link>
              </Box>
            </Box>
            <Tooltip title="More Options">
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Card>

        {/* Menu for options */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
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
        <DialogTitle>
          {selectedAd ? selectedAd.title : "Advertise with Us"}
        </DialogTitle>
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
                <Typography variant="subtitle1">Description:</Typography>
                <Typography>{selectedAd.companyInfo.description}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Mission:</Typography>
                <Typography>{selectedAd.companyInfo.mission}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Vision:</Typography>
                <Typography>{selectedAd.companyInfo.vision}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Services:</Typography>
                {selectedAd.companyInfo.services.map((service, index) => (
                  <Typography key={index} variant="body2">
                    - {service}
                  </Typography>
                ))}
              </Box>
              {/* Conditionally render address if it's not empty */}
              {selectedAd.companyInfo.address && (
                <Box>
                  <Typography variant="subtitle1">Address:</Typography>
                  <Typography>{selectedAd.companyInfo.address}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle1"></Typography>
                <Typography>{selectedAd.contactInfo.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography>{selectedAd.contactInfo.email}</Typography>
              </Box>
              {/* Conditionally render phone if it's not empty */}
              {selectedAd.contactInfo.phone && (
                <Box>
                  <Typography variant="subtitle1">Phone:</Typography>
                  <Typography>{selectedAd.contactInfo.phone}</Typography>
                </Box>
              )}
              <Link
                href={selectedAd.websiteUrl}
                target="_blank"
                rel="noopener"
                sx={{ mt: 2 }}
              >
                Visit Website
              </Link>
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

export default AdContainer;
