import { Container, useMediaQuery } from "@mui/material";
import React from "react";
import SearchGridLayout from "../SearchGridLayout";
import Navbar from "../Navbar";
import PostBrowser from "../PostBrowser";
import Sidebar from "../Sidebar";
import AdContainer from "./AdContainer"; // Import AdContainer component for ads

const SearchView = () => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <Container maxWidth="xl">
      <Navbar />
      <SearchGridLayout
        left={isDesktop ? <AdContainer /> : null} // Display ads only on desktop
        center={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default SearchView;
