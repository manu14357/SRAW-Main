import { Avatar, Typography, Tooltip } from "@mui/material";
import React from "react";
import HorizontalStack from "./util/HorizontalStack";
import Moment from "react-moment";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai"; // Ensure to install this icon library
import { Helmet } from "react-helmet"; // For advanced SEO

const ContentDetails = ({ username, createdAt, edited, preview, isAdmin }) => {
  const postDate = new Date(createdAt).toISOString();

  return (
    <HorizontalStack sx={{ alignItems: 'center' }}>
      {/* Add SEO meta tags for better visibility */}
      <Helmet>
        <title>{username}'s post - Sraws</title>
        <meta name="description" content={`${username}'s post, posted ${edited ? "and edited " : ""}on ${new Date(createdAt).toLocaleDateString()}`} />
        <meta property="og:title" content={`${username}'s post`} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={`${username}'s post created ${new Date(createdAt).toLocaleString()}`} />
      </Helmet>

      {/* Schema.org structured data for better SEO */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Comment",
            "author": {
              "@type": "Person",
              "name": "${username}",
              "url": "https://sraws.com/users/${username}"
            },
            "datePublished": "${postDate}",
            ${edited ? `"dateModified": "${new Date().toISOString()}",` : ""}
            "text": "User comment or post content goes here",
            "publisher": {
              "@type": "Organization",
              "name": "Sraws",
              "url": "https://sraws.com"
            }
          }
        `}
      </script>

      {/* User Avatar and details */}
      <UserAvatar width={30} height={30} username={username} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        <Link
          style={{ color: 'blue', textDecoration: 'none' }} // Apply inline styles here
          onClick={(e) => {
            e.stopPropagation();
          }}
          to={`/users/${username}`}
        >
          {username}
          {isAdmin && (
            <Tooltip title="Verified User">
              <AiFillCheckCircle style={{ color: 'green', marginLeft: '8px' }} />
            </Tooltip>
          )}
        </Link>
        {!preview && (
          <>
            {" "}
            · <Moment fromNow>{createdAt}</Moment> {edited && <>(Edited)</>}
          </>
        )}
      </Typography>
    </HorizontalStack>
  );
};

export default ContentDetails;
