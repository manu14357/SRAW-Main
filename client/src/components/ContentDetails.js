import { Avatar, Typography, Tooltip } from "@mui/material";
import React from "react";
import HorizontalStack from "./util/HorizontalStack";
import Moment from "react-moment";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai"; // Ensure to install this icon library

const ContentDetails = ({ username, createdAt, edited, preview, isAdmin }) => {
  return (
    <HorizontalStack sx={{ alignItems: 'center' }}>
      <UserAvatar width={30} height={30} username={username} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        <Link
          color="inherit"
          underline="hover"
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
