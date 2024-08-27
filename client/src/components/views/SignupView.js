import React, { useState } from "react";
import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  FormHelperText,
  Grid,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Box } from "@mui/system";
import PasswordStrengthMeter from "../PasswordStrengthMeter"; // Assuming PasswordStrengthMeter is in the same directory
import { signup } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { isLength, isEmail, contains } from "validator";
import srawsmainlogo from "../Assets/srawsmainlogo.png";
const SignupView = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length !== 0 || !formData.agreeToTerms) return;

    setLoading(true);
    const data = await signup(formData);
    setLoading(false);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Username must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Username must not contain spaces";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords must match";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Must be a valid email address";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms of service";
    }

    setErrors(errors);

    return errors;
  };

  return (
    <Container maxWidth={"xs"} sx={{ mt: { xs: 2, md: 6 } }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2" color="text.secondary">
          <Link to="/" href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
             <img src={srawsmainlogo} alt="Logo" style={{ height: 60 }} />
          </Link>
        </Typography>
        <Typography variant="h5" gutterBottom color="primary" align="center">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                required
                autoFocus
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username !== undefined}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                required
                autoComplete="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email !== undefined}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                fullWidth
                required
                autoComplete="new-password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password !== undefined}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                fullWidth
                required
                autoComplete="new-password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword !== undefined}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordStrengthMeter password={formData.password} />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                required
                error={errors.agreeToTerms !== undefined}
                component="fieldset"
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreeToTerms}
                        onChange={handleCheckboxChange}
                        name="agreeToTerms"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{" "}
                        <Link
                          href="/terms-of-service"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms of Service
                        </Link>
                      </Typography>
                    }
                  />
                </FormGroup>
                {errors.agreeToTerms && (
                  <FormHelperText>{errors.agreeToTerms}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
              {serverError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {serverError}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Divider />
        </Box>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <RouterLink to="/login" color="inherit">
              Login
            </RouterLink>
          </Typography>
      </Stack>
    </Container>
  );
};

export default SignupView;
