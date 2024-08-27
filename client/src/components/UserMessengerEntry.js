import { MenuItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";
import UserAvatar from "./UserAvatar";
import moment from "moment";

const UserMessengerEntry = (props) => {
  // Ensure recipient exists before accessing its properties
  const recipient = props.conversation.recipient || {};
  const username = recipient.username || 'Unknown User'; // Default username if recipient is missing
  const selected = props.conservant && props.conservant.username === username;

  const handleClick = () => {
    props.setConservant(recipient);
  };

  return (
    <MenuItem
      onClick={handleClick}
      sx={{ padding: 2 }}
      divider
      disableGutters
      selected={selected}
    >
      <ListItemAvatar>
        <UserAvatar height={45} width={45} username={username} />
      </ListItemAvatar>
      <ListItemText
        primary={username}
        secondary={
          props.conversation.lastMessageAt
            ? moment(props.conversation.lastMessageAt).fromNow()
            : 'No messages yet'
        }
      />
    </MenuItem>
  );
};

export default UserMessengerEntry;
