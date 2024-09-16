import React from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import { Close } from "@mui/icons-material";

const ErrorAlert = ({ error, onClose, open }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={error}
    >
      <Alert
        variant="filled"
        severity="error"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert;
