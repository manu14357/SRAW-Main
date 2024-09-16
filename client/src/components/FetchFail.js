import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

const FetchFail = ({ onRetry }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 4, textAlign: "center" }}
    >
      <ErrorOutline color="error" sx={{ fontSize: 60 }} />
      <Typography color="text.secondary" variant="h6" sx={{ mt: 2 }}>
        Something went wrong!
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
        Please try again later or contact support if the issue persists.
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};

export default FetchFail;
