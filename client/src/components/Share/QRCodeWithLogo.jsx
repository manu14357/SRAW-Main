// QRCodeWithLogo.jsx
import React from 'react';
import QRCode from 'qrcode.react';
import { Box } from '@mui/material';

const QRCodeWithLogo = ({ value }) => {
  return (
    <Box display="flex" justifyContent="center">
      <QRCode value={value} size={128} bgColor="#ffffff" fgColor="#000000" />
    </Box>
  );
};

export default QRCodeWithLogo;
