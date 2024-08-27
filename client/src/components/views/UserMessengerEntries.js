import React from 'react';
import { Stack, Typography, Avatar } from '@mui/material';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const UserMessengerEntries = ({ conversations, setConservant, loading }) => {
  return (
    <Stack sx={{ height: '100%', overflowY: 'auto', padding: 2 }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : conversations.length === 0 ? (
        <Typography>No conversations found.</Typography>
      ) : (
        conversations.map((conversation) => (
          <Stack
            key={conversation._id}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              px: 2,
              py: 1,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
            onClick={() => setConservant(conversation.recipient)}
          >
            <Avatar>
              <AiOutlineUser />
            </Avatar>
            <Typography variant="subtitle1">
              <Link to={`/users/${conversation.recipient.username}`}>
                <b>{conversation.recipient.username}</b>
              </Link>
            </Typography>
          </Stack>
        ))
      )}
    </Stack>
  );
};

export default UserMessengerEntries;
