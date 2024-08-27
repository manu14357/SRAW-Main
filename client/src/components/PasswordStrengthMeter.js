import React from "react";
import { LinearProgress, Typography, Box } from "@mui/material";

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length > 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[@$!%*?&]/.test(password)) strength += 1;
  return strength;
};

const PasswordStrengthMeter = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  const strengthLabel =
    strength === 0
      ? "Weak"
      : strength === 1
      ? "Fair"
      : strength === 2
      ? "Good"
      : strength === 3
      ? "Strong"
      : "Very Strong";

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Password strength: {strengthLabel}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(strength / 4) * 100}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export default PasswordStrengthMeter;
