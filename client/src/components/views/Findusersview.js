import { Button, Card, Container, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getPosts } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";
import CreatePost from "../CreatePost";
import GridLayout from "../GridLayout";
import Loading from "../Loading";
import Navbar from "../Navbar";
import SortBySelect from "../SortBySelect";
import PostCard from "../PostCard";
import Findusersideleft from "../Findusersideleft";
import Findusersideright from "../Finduserssideright";
import HorizontalStack from "../util/HorizontalStack";
import PostBrowser from "../PostBrowser";
import AdContainer from "./AdContainer"; // Import the AdContainer component
import UserProfile from "./UserProfile"; // Import the UserProfile component
import ExploreGridLayout from "../ExploreGridLayout"; // Import the new ExploreGridLayout component
import TopPosts from "../TopPosts";
import { Helmet } from "react-helmet";
import FindUsers from "../FindUsersnavbar";
const Finduserview = () => {
  
  return (
    <Container maxWidth="xl">
      <Navbar />
      <ExploreGridLayout
        left={
          <Findusersideleft />
        }
        center={<FindUsers />}
        right={<Findusersideright />}
      />
    </Container>
  );
};

export default Finduserview;


