import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { Link } from "react-router-dom";
import { getRandomUsers } from "../api/users";
import Loading from "./Loading";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import UserEntry from "./UserEntry";
import { Helmet } from "react-helmet"; // For SEO

const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getRandomUsers({ size: 5 });
    setLoading(false);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClick = () => {
    fetchUsers();
  };

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
      <title>Sraws - Scam Reporting & Alert Platform</title>
        <meta
          name="description"
          content="Discover random users on Sraws. Connect with people and explore their profiles."
        />
        <meta property="og:title" content="Find Random Users" />
        <meta
          property="og:description"
          content="Explore and connect with random users on Sraws Community."
        />
        <meta property="og:url" content="https://sraws.com" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Structured Data for Find Users Page */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Find Users",
            "description": "Discover random users on Sraws. Connect with people and explore their profiles.",
            "url": "https://sraws.com",
            "potentialAction": {
              "@type": "ViewAction",
              "target": "https://sraws.com",
              "result": {
                "@type": "Person",
                "name": "Random User"
              }
            }
          }
        `}
      </script>

      {/* Main Component Content */}
      <Card>
        <Stack spacing={2}>
          <HorizontalStack justifyContent="space-between">
            <HorizontalStack>
              <AiOutlineUser />
              <Typography>Find Users Randomly</Typography>
            </HorizontalStack>
            <IconButton
              sx={{ padding: 0 }}
              disabled={loading}
              onClick={handleClick}
              aria-label="Refresh user list" // Accessibility improvement
            >
              <MdRefresh />
            </IconButton>
          </HorizontalStack>

          <Divider />

          {loading ? (
            <Loading />
          ) : (
            users &&
            users.map((user) => (
              <UserEntry username={user.username} key={user.username} />
            ))
          )}
        </Stack>
      </Card>
    </>
  );
};

export default FindUsers;
