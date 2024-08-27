import React from "react";
import { Card, Typography, Button, Grid, Divider, Box } from "@mui/material";
import UserAvatar from "../UserAvatar";
import { isLoggedIn } from "../../helpers/authHelper";
import { MdReportProblem } from "react-icons/md";

const UserProfile = () => {
  const user = isLoggedIn();

  return (
    <Card variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 1 }}>
      {user ? (
        <Grid container spacing={2} alignItems="center">
          {/* User Avatar */}
          <Grid item>
            <UserAvatar width={80} height={80} username={user.username} />
          </Grid>

          {/* User Information */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Welcome, {user.username}! You can report scams or fraud here. Stay vigilant against fraudulent activities.
            </Typography>
          </Grid>

          {/* Report Scam/Fraud */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MdReportProblem fontSize="large" sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", ml: 1 }}>
                Report Scam or Fraud
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              If you encounter suspicious activities, report them immediately to help protect our community.
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
