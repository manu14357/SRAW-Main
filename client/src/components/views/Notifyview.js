import { Container, useMediaQuery } from "@mui/material";
import React from "react";
import SearchGridLayout from "../SearchGridLayout";
import Navbar from "../Navbar";
import PostBrowser from "../PostBrowser";
import Sidebar from "../Sidebar";
import AdContainer from "./AdContainer"; 
import Notifications from "./Notifications";

const NotifyView = () => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <Container maxWidth="xl">
      <Navbar />
      <SearchGridLayout
        
        center={<Notifications />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default NotifyView;
