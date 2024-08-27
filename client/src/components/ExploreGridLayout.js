// ExploreGridLayout.jsx
import { Grid } from "@mui/material";
import React from "react";

const ExploreGridLayout = ({ left, center, right }) => {
  return (
    <Grid container spacing={3}>
      {/* Left Side (Hidden on mobile, shown on desktop) */}
      <Grid item xs={12} md={3.3} sx={{ display: { xs: "none", md: "block" } }}>
        {left}
      </Grid>

      {/* Center (Main Content) */}
      <Grid item xs={12} md={5.5}>
        {center}
      </Grid>

      {/* Right Side (Hidden on mobile, shown on desktop) */}
      <Grid item xs={12} md={3.2} sx={{ display: { xs: "none", md: "block" } }}>
        {right}
      </Grid>
      
    </Grid>
  );
};

export default ExploreGridLayout;
