import React from 'react';
import { Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import CommunityChat from '../CommunityChat'; // Import the CommunityChat component

const ChatPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <CommunityChat />
      </Container>
      <Footer />
    </div>
  );
};

export default ChatPage;
