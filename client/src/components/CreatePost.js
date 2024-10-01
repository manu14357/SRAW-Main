import { Button, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { Helmet } from "react-helmet"; // For SEO

const CreatePost = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/posts/create");
  };

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Create New Post - Sraws</title>
        <meta 
          name="description" 
          content="Create a new post on Sraws to share your thoughts and updates with others." 
        />
        <meta property="og:title" content="Create a New Post" />
        <meta 
          property="og:description" 
          content="Share your thoughts and ideas by creating a new post on Sraws." 
        />
        <meta property="og:url" content="https://sraws.com/posts/create" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Structured Data for Create Post Page */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Create New Post",
            "description": "Create a new post on Sraws to share your thoughts and updates with others.",
            "url": "https://sraws.com/posts/create",
            "potentialAction": {
              "@type": "CreateAction",
              "target": "https://sraws.com/posts/create",
              "result": {
                "@type": "Post",
                "name": "New Post"
              }
            }
          }
        `}
      </script>

      {/* Create Post Button */}
      <Tooltip title="Create a new post" arrow>
        <Button
          variant="outlined"
          size="medium"
          onClick={handleClick}
          sx={{
            gap: "0.2rem",
            whiteSpace: "nowrap",
          }}
          aria-label="Create a new post" // Accessibility improvement
        >
          <AiOutlinePlus style={{ flexShrink: 0 }} />
          <span>Create Post</span>
        </Button>
      </Tooltip>
    </>
  );
};

export default CreatePost;
