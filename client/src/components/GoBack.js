import { Typography, Link as MuiLink } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const GoBack = () => {
  return (
    <Typography
      sx={{
        mb: 2,
        position: "sticky",
        top: 10,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <MuiLink
        component={Link}
        to="/"
        color="primary"
        variant="body1"
        sx={{ textDecoration: 'none', fontWeight: 'bold' }}
        aria-label="Go back to posts"
      >
        &lt;&lt; Go back to posts
      </MuiLink>
    </Typography>
  );
};

export default GoBack;
