import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Divider,
  Stack,
  Typography,
  TextField, // Import TextField component from MUI
} from "@mui/material";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getRandomUsers } from "../api/users";
import Loading from "./Loading";
import UserEntry from "./UserEntry";
import HorizontalStack from "./util/HorizontalStack";

const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getRandomUsers({ size: 10000 }); // Adjust size as needed
    setLoading(false);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users
    ? users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
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
        />

        {/* Display users based on search */}
        {loading ? (
          <Loading />
        ) : (
          <Stack spacing={2}>
            {filteredUsers.map((user) => (
              <UserEntry username={user.username} key={user.username} />
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default FindUsers;
