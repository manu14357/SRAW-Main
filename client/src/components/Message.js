import { Card, Link as MuiLink, Typography, useTheme } from "@mui/material";
import React from "react";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import { Timestamp } from "firebase/firestore";

const Message = (props) => {
  const username = props.conservant.username;
  const message = props.message;
  const theme = useTheme();

  let messageStyle = {
    alignSelf: "flex-start", // Default style for messages sent by 'to'
  };

  if (message.direction === "from") {
    messageStyle = {
      alignSelf: "flex-end", // Align to the right for messages sent by 'from'
    };
  }

  const renderMessageContent = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <MuiLink key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </MuiLink>
        );
      } else {
        return <Typography key={index} component="span">{part}</Typography>;
      }
    });
  };

  return (
    <HorizontalStack
      sx={{
        paddingY: 1,
        width: "100%",
        justifyContent: message.direction === "from" ? "flex-end" : "flex-start",
      }}
      spacing={2}
      alignItems="flex-end"
    >
      {message.direction === "to" && (
        <UserAvatar username={username} height={30} width={30} />
      )}

      <Card
        sx={{
          ...messageStyle,
          borderWidth: "0.01px",
          borderColor: theme.palette.divider, // Light border color
          borderStyle: "solid",
          paddingY: "10px",
          maxWidth: "70%",
          paddingX: 2,
          wordBreak: 'break-word', // Ensure long words or URLs wrap correctly
          borderRadius: '8px', // Small border radius
        }}
      >
        {renderMessageContent()}
      </Card>
    </HorizontalStack>
  );
};

export default Message;
