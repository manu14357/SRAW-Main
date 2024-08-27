// AdCard.js
import React from "react";
import { Card, Typography, Box, Avatar } from "@mui/material";

const AdCard = ({ ad }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        width: "100%",
        border: "1px solid #e0e0e0", // Simple border
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={ad.imageUrl}
          alt={ad.company}
          sx={{ width: 64, height: 64, marginRight: 2 }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
            {ad.company}
          </Typography>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {ad.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {ad.content}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default AdCard;
