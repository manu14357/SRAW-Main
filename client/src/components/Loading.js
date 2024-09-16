import { CircularProgress, Stack, Typography, Box } from "@mui/material";
import React from "react";

const Loading = ({ label }) => {
  return (
    <Stack
      alignItems="center"

      spacing={2}
      sx={{
        minHeight: '100vh',
        textAlign: 'center',
        p: 2,
        // Removed background and border-radius
        boxShadow: 1,
      }}
    >
      <CircularProgress size={60} color="primary" sx={{ mb: 1 }} />
      <Box>
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ mb: 1, fontWeight: 500 }}
        >
          {label || "Please wait, loading..."}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.875rem' }}
        >
          Your content is being prepared.
        </Typography>
      </Box>
    </Stack>
  );
};

export default Loading;
