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
} from "@mui/material";
import { login } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import ErrorAlert from "../ErrorAlert";
import Copyright from "../Copyright";
import srawsmainlogo from "../Assets/srawsmainlogo.png";
const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, rememberMe: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if email or password is empty
    if (!formData.email || !formData.password) {
      setLoading(false);
      setServerError("Please enter both email and password.");
      return;
    }

    // Check if email and password are the same
    if (formData.email === formData.password) {
      setLoading(false);
      setServerError("Email and password cannot be the same.");
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
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            required
            id="email"
            name="email"
            value={formData.email}
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
          <ErrorAlert error={serverError} />
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
        <Box mt={1}>
          <Copyright />
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginView;
