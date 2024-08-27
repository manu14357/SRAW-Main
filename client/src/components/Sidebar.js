import { Box, Stack } from "@mui/material";
import React from "react";
import FindUsers from "./FindUsers";
import Footer from "./Footer";
import TopPosts from "./TopPosts";
import AdContainer from "./views/AdContainer";

const Sidebar = () => {
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
        <AdContainer />
        <FindUsers />
        <Footer />
      </Stack>
    </Box>
  );
};

export default Sidebar;
