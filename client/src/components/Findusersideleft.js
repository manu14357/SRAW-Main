import { Box, Stack } from "@mui/material";
import React from "react";
import FindUsers from "./FindUsers";
import Footer from "./Footer";
import TopPosts from "./TopPosts";
import AdContainer from "./views/AdContainer";
import UserProfile from "./views/UserProfile";


const Findusersideleft = () => {
    const username = "exampleUser"; // Replace with actual username
  return (
    <Box
      sx={{
        position: "sticky",
        top: 90,
        maxHeight: "calc(100vh - 80px)", // Adjusted to full height minus offset
        overflowY: "auto", // Enable vertical scrolling
        "&::-webkit-scrollbar": {
          width: "0px", // Remove scrollbar space
          background: "transparent", // Optional: Makes scrollbar invisible
        },
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      <Stack spacing={2}>
      <UserProfile username={username} />
      </Stack>
    </Box>
  );
};

export default Findusersideleft;
