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

// Sample data for multiple ads
const adsData = [
  {
    id: 1,
    company: "Tech Solutions Inc.",
    title: "Innovative Tech Solutions",
    content: "Discover our innovative tech solutions.",
    imageUrl: "https://via.placeholder.com/150",
    websiteUrl: "https://www.example.com/ad1",
    contactInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 123-456-7890",
    },
    companyInfo: {
      description: "Tech Solutions Inc. is a leading provider of innovative tech solutions. We specialize in software development, IT consulting, and digital transformation services.",
      mission: "To empower businesses through innovative technology solutions.",
      vision: "To be the global leader in tech innovation.",
      services: ["Software Development", "IT Consulting", "Digital Transformation"],
      address: "1234 Tech Lane, Innovation City, TX 75001",
    },
  },
  {
    id: 2,
    company: "Global Innovations",
    title: "Global Innovations",
    content: "Explore our global innovations.",
    imageUrl: "https://via.placeholder.com/150",
    websiteUrl: "https://www.example.com/ad2",
    contactInfo: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 987-654-3210",
    },
    companyInfo: {
      description: "Global Innovations is at the forefront of global advancements, offering cutting-edge solutions in various industries including healthcare, finance, and education.",
      mission: "To drive global progress through innovative solutions.",
      vision: "A world where innovation drives progress in every industry.",
      services: ["Healthcare Solutions", "Financial Services", "Educational Tools"],
      address: "4321 Innovation Blvd, Progress City, CA 90210",
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
            border: "1px solid #e0e0e0", // Simple border
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
                <Typography>{selectedAd.companyInfo.services.join(", ")}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Address:</Typography>
                <Typography>{selectedAd.companyInfo.address}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Contact Name:</Typography>
                <Typography>{selectedAd.contactInfo.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography>{selectedAd.contactInfo.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Phone:</Typography>
                <Typography>{selectedAd.contactInfo.phone}</Typography>
              </Box>
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
                Email: ads@example.com
              </Typography>
              <Typography variant="body1">Phone: +1 800-123-4567</Typography>
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
