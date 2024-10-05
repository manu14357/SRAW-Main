import React, { useState } from "react";
import { Container, TextField, Button, Typography, CircularProgress, Box, Alert, Stack, Link } from "@mui/material";
import srawsmainlogo from "../Assets/srawsmainlogo.png"; // Import the logo
import { Link as RouterLink } from "react-router-dom"; // Use RouterLink for navigation

const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation for empty email
    if (!email) {
      setLoading(false);
      setError("Please enter your email address.");
      return;
    }

    const response = await fetch("https://api.sraws.com/api/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
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
          Forgot Password
        </Typography>

        {/* Additional Content */}
        <Typography variant="body2" align="center" color="text.secondary">
          Don’t worry! It happens to the best of us. Simply enter your registered email address, and we’ll send you instructions on how to reset your password.
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Please make sure you check your inbox and spam folder for the password reset email. 
          If you don't receive the email in a few minutes, feel free to try again.
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Need more help? Contact our <Link component={RouterLink} to="/help" color="primary" sx={{ fontWeight: "bold" }}>Support Team</Link>.
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
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
          </Button>
        </Box>
      </Stack>

      {/* Footer Links */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Need help signing in? Check our other options below:
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

export default ForgotPasswordView;
