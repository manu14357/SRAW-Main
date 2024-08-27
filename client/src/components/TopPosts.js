import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Stack, Typography, Button } from "@mui/material";
import { getPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import Loading from "./Loading";
import { MdLeaderboard, MdVisibility } from "react-icons/md";

const TopPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [displayCount, setDisplayCount] = useState(5); // Initial display count
  const user = isLoggedIn();
  const [showMore, setShowMore] = useState(false); // State to manage Show More or Show Less

  const fetchPosts = async () => {
    try {
      const query = { sortBy: "-likeCount" };
      const data = await getPosts(user && user.token, query);

      if (data && data.data) {
        const topPosts = data.data.slice(0, 10); // Limit to top 10 posts
        setPosts(topPosts);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching top posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggleDisplay = () => {
    setShowMore(!showMore);
    setDisplayCount(showMore ? 5 : 10); // Toggle between 5 and 10 posts
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MdLeaderboard fontSize="large" />
          <Typography variant="h6">Top Posts</Typography>
        </Stack>
        {!loading ? (
          posts.length > 0 ? (
            <Stack spacing={1}>
              {posts.slice(0, displayCount).map((post) => (
                <Card key={post._id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="column" spacing={1}>
                    <Typography
                      variant="subtitle1"
                      component={RouterLink}
                      to={`/posts/${post._id}`} // Replace with your actual route path
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <MdVisibility fontSize="small" />
                      <Typography variant="body2">{post.viewCount}</Typography>
                    </Stack>
                  </Stack>
                </Card>
              ))}
              {posts.length > 5 && (
                <Button variant="text" onClick={handleToggleDisplay}>
                  {showMore ? "Show Less" : "Show More"}
                </Button>
              )}
            </Stack>
          ) : (
            <Typography>No top posts found.</Typography>
          )
        ) : (
          <Loading />
        )}
      </Stack>
    </Card>
  );
};

export default TopPosts;
