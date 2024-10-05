import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Divider,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getRandomUsers } from "../api/users";
import Loading from "./Loading";
import UserEntry from "./UserEntry";
import HorizontalStack from "./util/HorizontalStack";
import { Helmet } from "react-helmet"; // Import Helmet for SEO

const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getRandomUsers({ size: 100000 }); // Adjust size as needed
    setLoading(false);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users
    ? users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Helmet for page-level SEO */}
      <Helmet>
        <title>Find Users - Sraws</title>
        <meta
          name="description"
          content="Search and discover users on Sraws. Connect with people and explore their profiles."
        />
        <meta property="og:title" content="Find Users" />
        <meta
          property="og:description"
          content="Explore and connect with users on Sraws."
        />
        <meta property="og:url" content="https://sraws.com" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Card>
        <Stack spacing={2}>
          <HorizontalStack justifyContent="space-between">
            <HorizontalStack>
              <AiOutlineUser />
              <Typography variant="h6">Find Users</Typography>
            </HorizontalStack>
          </HorizontalStack>

          <Divider />

          {/* Search input field */}
          <TextField
            size="small"
            label="Search Users"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
            aria-label="Search for users"
          />

          {/* Display users based on search */}
          {loading ? (
            <Loading />
          ) : (
            <Stack spacing={2}>
              {filteredUsers.map((user) => (
                <React.Fragment key={user.username}>
                  <Helmet>
                    {/* Helmet for individual user SEO */}
                    <title>{`${user.username} - Profile on Sraws`}</title>
                    <meta
                      name="description"
                      content={`View the profile of ${user.username} on Sraws. Connect with them and explore their activities.`}
                    />
                    <meta
                      property="og:title"
                      content={`${user.username}'s Profile`}
                    />
                    <meta
                      property="og:description"
                      content={`Explore the profile of ${user.username} on Sraws.`}
                    />
                    <meta
                      property="og:url"
                      content={`https://sraws.com/users/${user.username}`}
                    />
                    <meta property="og:type" content="profile" />
                  </Helmet>

                  {/* Structured Data for individual user */}
                  <script type="application/ld+json">
                    {`
                      {
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "${user.username}",
                        "url": "https://sraws.com/users/${user.username}",
                        "description": "Profile of ${user.username} on Sraws."
                      }
                    `}
                  </script>

                  {/* User entry component */}
                  <UserEntry username={user.username} />
                </React.Fragment>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
};

export default FindUsers;
