import { Avatar, Tooltip, Box } from "@mui/material";
import React from "react";

const UserAvatar = ({ username, height, width, online }) => {
  return (
    <Tooltip >
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          sx={{
            height: height,
            width: width,
            backgroundColor: "lightgray",
            border: "2px solid transparent" // Transparent border to avoid shifting
          }}
          src={`https://robohash.org/${username}`}
        >
          {username ? username.charAt(0) : "?"}
        </Avatar>
        {online && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              height: 12,
              width: 12,
              borderRadius: '50%',
              backgroundColor: 'green',
              border: '2px solid white',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default UserAvatar;
