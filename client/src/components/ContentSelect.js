import { MenuItem, Select, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import HorizontalStack from "./util/HorizontalStack";
import { Helmet } from "react-helmet"; // For SEO meta tags

const ContentSelect = () => {
  const [content, setContent] = useState("post");

  useEffect(() => {
    // Perform any side effects here if necessary when content type changes
  }, [content]);

  return (
    <HorizontalStack spacing={1}>
      {/* Helmet for SEO */}
      <Helmet>
        <title>{content === "post" ? "Posts" : "Comments"} - Sraws</title>
        <meta 
          name="description" 
          content={`Browse ${content === "post" ? "posts" : "comments"} in the Sraws.`} 
        />
        <meta property="og:title" content={content === "post" ? "Browse Posts" : "Browse Comments"} />
        <meta property="og:description" content={`Explore ${content === "post" ? "posts" : "comments"} shared by the Sraws Users.`} />
      </Helmet>

      <Typography>Content:</Typography>
      <Select
        size="small"
        value={content}
        sx={{ minWidth: 150 }}
        onChange={(e) => setContent(e.target.value)}
      >
        <MenuItem value={"post"}>Posts</MenuItem>
        <MenuItem value={"comment"}>Comments</MenuItem>
      </Select>

      {/* Structured Data for the selected content type */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "${content === "post" ? "BlogPosting" : "Comment"}",
            "headline": "${content === "post" ? "Explore Posts" : "Explore Comments"}",
            "description": "${content === "post" ? "Browse through community posts" : "Browse through community comments"}",
            "author": {
              "@type": "Organization",
              "name": "Sraws",
              "url": "https://sraws.com"
            }
          }
        `}
      </script>
    </HorizontalStack>
  );
};

export default ContentSelect;
