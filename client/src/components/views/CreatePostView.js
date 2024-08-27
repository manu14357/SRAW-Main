// CreatePostView.js
import { Container } from "@mui/material";
import React from "react";
import GoBack from "../GoBack";
import CreatePostGridLayout from "../CreatePostGridLayout";
import Navbar from "../Navbar";
import PostEditor from "../PostEditor";

const CreatePostView = () => {
  return (
    <Container maxWidth="xl">
      <Navbar />
      <GoBack />
      <CreatePostGridLayout left={<PostEditor />} />
    </Container>
  );
};

export default CreatePostView;
