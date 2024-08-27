// ShareButton.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FaShareAlt } from 'react-icons/fa';

const ShareButton = ({ onClick }) => (
  <Tooltip title="Share" arrow>
    <IconButton
      size="small"
      onClick={onClick}
      sx={{ marginBottom: (theme) => theme.spacing(1) }}
    >
      <FaShareAlt color="#007bff" /> {/* Blue color for the icon */}
    </IconButton>
  </Tooltip>
);

export default ShareButton;
