import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, Stack, Typography, Button, Box } from "@mui/material";
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
    <Card variant="outlined" sx={{ p: 2, borderRadius: '5px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MdLeaderboard fontSize="large" color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Top Posts</Typography>
        </Stack>
        {!loading ? (
          posts.length > 0 ? (
            <Stack spacing={2}>
              {posts.slice(0, displayCount).map((post) => (
                <Box 
                  key={post._id} 
                  sx={{ 
                    p: 2, 
                    border: '1px solid #E0E0E0', 
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', 
                    borderRadius: '8px', 
                    bgcolor: 'background.paper', 
                    transition: '0.3s', 
                    '&:hover': { 
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', 
                      bgcolor: 'background.default' 
                    } 
                  }}
                >
                  <Stack direction="column" spacing={1}>
                    <Typography
                      variant="subtitle1"
                      component={RouterLink}
                      to={`/posts/${post._id}`} // Replace with your actual route path
                      color="primary"
                      sx={{ 
                        fontWeight: 'bold', 
                        textDecoration: 'none', 
                        ':hover': { textDecoration: 'underline', color: 'primary.main' } // Underline on hover
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <MdVisibility fontSize="small" color="text.secondary" />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{post.viewCount}</Typography>
                    </Stack>
                  </Stack>
                </Box>
              ))}
              {posts.length > 5 && (
                <Button 
                  variant="outlined" 
                  onClick={handleToggleDisplay} 
                  sx={{ 
                    mt: 2, 
                    alignSelf: 'flex-start', 
                    color: 'primary.main', 
                    borderColor: 'primary.main',
                   
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
  );
};

export default TopPosts;
