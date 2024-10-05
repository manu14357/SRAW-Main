import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Stack, Typography, Button, Box } from "@mui/material";
import { getPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import Loading from "./Loading";
import { MdLeaderboard, MdVisibility } from "react-icons/md";
import { Helmet } from "react-helmet"; // Import Helmet for SEO

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
    <>
      {/* Helmet for page-level SEO */}
      <Helmet>
      <title>Sraws - Scam Reporting & Alert Platform</title>
        <meta
          name="description"
          content="Check out the top posts on Sraws. See what's trending and popular among the users."
        />
        <meta property="og:title" content="Top Posts" />
        <meta
          property="og:description"
          content="Explore the most liked and viewed posts on Sraws."
        />
        <meta property="og:url" content="https://sraws.com" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Card
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: "5px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MdLeaderboard fontSize="large" color="primary" />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Top Posts
            </Typography>
          </Stack>
          {!loading ? (
            posts.length > 0 ? (
              <Stack spacing={2}>
                {posts.slice(0, displayCount).map((post) => (
                  <React.Fragment key={post._id}>
                    {/* Helmet for individual post SEO */}
                    <Helmet>
                      <title>Sraws - Scam Reporting & Alert Platform</title>
                      <meta
                        name="description"
                        content={`Read "${post.title}" on Sraws. ${post.content.substring(
                          0,
                          150
                        )}...`}
                      />
                      <meta
                        property="og:title"
                        content={`${post.title} - Top Post`}
                      />
                      <meta
                        property="og:description"
                        content={`${post.content.substring(0, 150)}...`}
                      />
                      <meta property="og:url" content={`https://www.sraws.com/posts/${post ? post.slug : ''}/${post._id}`} />
 
                      <meta property="og:type" content="article" />
                      <meta name="robots" content="index, follow" />
                    </Helmet>

                    {/* Post Entry */}
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid #E0E0E0",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                        bgcolor: "background.paper",
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                          bgcolor: "background.default",
                        },
                      }}
                    >
                      <Stack direction="column" spacing={1}>
                        <Typography
                          variant="subtitle1"
                          component={RouterLink}
                          to={`/posts/${post._id}`}
                          color="primary"
                          sx={{
                            fontWeight: "bold",
                            textDecoration: "none",
                            ":hover": {
                              textDecoration: "underline",
                              color: "primary.main",
                            },
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mb: 1 }}
                        >
                          {post.content.length > 100
                            ? post.content.substring(0, 100) + "..."
                            : post.content}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <MdVisibility fontSize="small" color="text.secondary" />
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {post.viewCount}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </React.Fragment>
                ))}
                {posts.length > 5 && (
                  <Button
                    variant="outlined"
                    onClick={handleToggleDisplay}
                    sx={{
                      mt: 2,
                      alignSelf: "flex-start",
                      color: "primary.main",
                      borderColor: "primary.main",
                    }}
                  >
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
    </>
  );
};

export default TopPosts;
