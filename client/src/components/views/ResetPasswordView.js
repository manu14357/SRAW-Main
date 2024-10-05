import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, CircularProgress, Box, Alert, Stack, Link, Grid } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom"; // Import useNavigate
import srawsmainlogo from "../Assets/srawsmainlogo.png"; // Import the logo
import PasswordStrengthMeter from "../PasswordStrengthMeter"; // Import PasswordStrengthMeter

const ResetPasswordView = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for password confirmation
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Extract token and email from URL parameters
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");
    const emailFromURL = params.get("email");

    // Set the state with the token and email
    if (tokenFromURL) setToken(tokenFromURL);
    if (emailFromURL) setEmail(emailFromURL);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const response = await fetch("https://api.sraws.com/api/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, email, newPassword }),
    });

    setLoading(false);
    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate("/login"); // Use navigate to redirect to login page
      }, 2000); // Optional: Delay for 2 seconds to show success message before redirecting
    } else {
      setError(data.error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100vh" }}>
      <Stack spacing={3} alignItems="center">
        {/* Logo */}
        <img src={srawsmainlogo} alt="Logo" style={{ height: 60 }} />

        <Typography variant="h4" align="center" gutterBottom color="primary">
          Reset Your Password
        </Typography>

        {/* Additional Content */}
        <Typography variant="body2" align="center" color="text.secondary">
          To keep your account secure, please enter a new password below. Ensure it meets the strength requirements!
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          If you encounter any issues, don’t hesitate to reach out to our <Link component={RouterLink} to="/help" color="primary" sx={{ fontWeight: "bold" }}>Support Team</Link>.
        </Typography>

        {/* Error or Success Message */}
        {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ width: "100%" }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Reset Token"
            fullWidth
            margin="normal"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <TextField
            label="New Password"
            fullWidth
            margin="normal"
            required
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            fullWidth
            margin="normal"
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update state for confirmation
          />

          {/* Centering the Password Strength Meter */}
          <Grid container justifyContent="center" sx={{ my: 2 }}>
            <Grid item xs={12}>
              <PasswordStrengthMeter password={newPassword} />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
          </Button>
        </Box>
      </Stack>

      {/* Footer Links */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Already have an account? Access other options below:
        </Typography>

        <Stack direction="row" justifyContent="center" spacing={2}>
          <Link
            component={RouterLink}
            to="/login"
            sx={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold", transition: "color 0.3s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#125ea1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")}
          >
            Sign In
          </Link>
          <Link
            component={RouterLink}
            to="/signup"
            sx={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold", transition: "color 0.3s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#125ea1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")}
          >
            Sign Up
          </Link>
          <Link
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold", transition: "color 0.3s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#125ea1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")}
          >
            Home
          </Link>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            © {new Date().getFullYear()} Sraws. All rights reserved.
      </Typography>
      </Box>

    </Container>
  );
};

export default ResetPasswordView;
