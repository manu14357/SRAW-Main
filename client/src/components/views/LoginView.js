import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Link,
  Alert, // Import Alert for better error display
} from "@mui/material";
import { login } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../Copyright";
import srawsmainlogo from "../Assets/srawsmainlogo.png";

const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (serverError) setServerError(""); // Clear error on input change
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, rememberMe: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation for empty fields
    if (!formData.usernameOrEmail || !formData.password) {
      setLoading(false);
      setServerError("Please enter both username/email and password.");
      return;
    }

    // Check if username/email and password are the same
    if (formData.usernameOrEmail === formData.password) {
      setLoading(false);
      setServerError("Username/Email and password cannot be the same.");
      return;
    }

    const data = await login(formData);
    setLoading(false);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2" color="text.secondary">
          <Link to="/" href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={srawsmainlogo} alt="Logo" style={{ height: 60 }} />
          </Link>
        </Typography>

        <Typography variant="h4" color="primary" align="center">
          Login
        </Typography>
        
        {/* Error Alert */}
        {serverError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label="Username or Email Address"
            fullWidth
            margin="normal"
            autoComplete="username"
            autoFocus
            required
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
          />
          {/* Forgot Password Link */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ alignSelf: "flex-end", marginTop: 1 }}
          >
            <RouterLink
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#125ea1")} // Darker shade on hover
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")} // Original color
            >
              Forgot your password?
            </RouterLink>
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.rememberMe}
                onChange={handleCheckboxChange}
                name="rememberMe"
                color="primary"
              />
            }
            label="Remember Me"
            sx={{ alignSelf: "flex-start" }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account yet?{" "}
            <RouterLink
              to="/signup"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold",
                marginLeft: "4px",
              }}
            >
              Sign Up
            </RouterLink>
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            By logging in, you agree to our{" "}
            <RouterLink
              to="/terms-of-service"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold",
              }}
            >
              Terms of Service
            </RouterLink>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@sraw.com"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold",
                display: "block",
                marginTop: "8px",
              }}
            >
              support@sraw.com
            </a>
          </Typography>
        </Box>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Link
            component={RouterLink}
            to="/help"
            sx={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold", transition: "color 0.3s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#125ea1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")}
          >
            Help
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
      </Stack>
      
    </Container>
  );
};

export default LoginView;
