import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Grid, Divider, Box } from "@mui/material";
import UserAvatar from "../UserAvatar";
import { isLoggedIn } from "../../helpers/authHelper";
import { MdReportProblem, MdVerifiedUser } from "react-icons/md";

const UserProfile = () => {
  const user = isLoggedIn();
  
  // Array of random messages for the user
  const userMessages = [
    {
      title: "Welcome Message",
      content: `Welcome, ${user?.username}! Share your experiences and help others stay informed about scams and fraud. Together, we can stay vigilant and protected.`,
    },
    {
      title: "Stay Informed",
      content: `Hi, ${user?.username}! Stay informed by reporting scams or fraudulent activities. Every report helps the community stay safe.`,
    },
    {
      title: "Your Safety Matters",
      content: `${user?.username}, your safety matters to us! Report any scams or suspicious activities you encounter.`,
    },
    {
      title: "Protect the Community",
      content: `Help protect our community by reporting any scams, frauds, or suspicious activities, ${user?.username}.`,
    }
  ];

  // Array of random report messages
  const reportMessages = [
    {
      title: "Report Scam or Fraud",
      content: "If you encounter suspicious activities, report them immediately to help protect our community.",
    },
    {
      title: "Flag Suspicious Activity",
      content: "Notice anything unusual? Flag it right away to safeguard everyone from scams or fraud.",
    },
    {
      title: "Stay Safe",
      content: "Keep yourself and others safe by reporting scams and fraud as soon as you encounter them.",
    }
  ];

  // State for random content selection
  const [selectedUserMessage, setSelectedUserMessage] = useState(null);
  const [selectedReportMessage, setSelectedReportMessage] = useState(null);

  useEffect(() => {
    // Randomly select a user message and a report message each time component renders
    const randomUserMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
    const randomReportMessage = reportMessages[Math.floor(Math.random() * reportMessages.length)];

    setSelectedUserMessage(randomUserMessage);
    setSelectedReportMessage(randomReportMessage);
  }, []);

  return (
    <Card variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 1 }}>
      {user ? (
        <Grid container spacing={2} alignItems="center">
          {/* User Avatar */}
          <Grid item>
            <UserAvatar width={80} height={80} username={user.username} />
          </Grid>

          {/* Random User Information */}
          <Grid item xs={12} md={8}>
          <Typography 
            variant="h6" 
             gutterBottom 
             sx={{ 
             fontSize: '1.2rem', 
             letterSpacing: '0.1rem', 
             color: 'primary.main', // Custom color (blue shade)
             textTransform: 'uppercase' 
              }}
            >
              {user.username}
           </Typography>

            <Typography variant="h8" color="textSecondary">
              {selectedUserMessage?.content}
            </Typography>
          </Grid>

          {/* Report Scam/Fraud Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
            <MdReportProblem fontSize="large" sx={{ mr: 1 }} style={{ color: "#f44336" }} />
             <Typography variant="subtitle1" sx={{ fontWeight: "bold", ml: 1, color: "#f44336" }}>
                {selectedReportMessage?.title}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {selectedReportMessage?.content}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid container direction="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Guest User
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
            Please log in to report scams or frauds and contribute to our community.
          </Typography>
          {/* Login Button (Add a login link or button here if needed) */}
          <Button variant="contained" href="/login">
            Login
          </Button>
        </Grid>
      )}
    </Card>
  );
};

export default UserProfile;
