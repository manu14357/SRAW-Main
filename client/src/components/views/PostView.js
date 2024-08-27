import { Container, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import GoBack from "../GoBack";
import PostGridLayout from "../PostGridLayout";
import Loading from "../Loading";
import Navbar from "../Navbar";
import PostCard from "../PostCard";
import Sidebar from "../Sidebar";
import { useParams } from "react-router-dom";
import { getPost } from "../../api/posts";
import Comments from "../Comments";
import ErrorAlert from "../ErrorAlert";
import { isLoggedIn } from "../../helpers/authHelper";
import AdContainer from "./AdContainer"; // Import AdContainer component for ads

const PostView = () => {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = isLoggedIn();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const fetchPost = async () => {
    setLoading(true);
    const data = await getPost(params.id, user && user.token);
    if (data.error) {
      setError(data.error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  return (
    <Container maxWidth="xl">
      <Navbar />
      <GoBack />
      <PostGridLayout
        left={isDesktop ? <AdContainer /> : null} // Display ads only on desktop
        center={
          loading ? (
            <Loading />
          ) : post ? (
            <Stack spacing={2}>
              <PostCard post={post} key={post._id} />
              <Comments />
            </Stack>
          ) : (
            error && <ErrorAlert error={error} />
          )
        }
        right={<Sidebar />} // Sidebar
      />
    </Container>
  );
};

export default PostView;
