import React from 'react';
import { Box, Typography, Link, Container, IconButton, Divider, useScrollTrigger, Zoom } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, KeyboardArrowUp } from '@mui/icons-material';
import srawsmainlogo from "./Assets/srawsmainlogo.png";

const Footer = () => {
  // Function to handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to display back to top button when scrolled down
  function ScrollTop(props) {
    const trigger = useScrollTrigger();

    return (
      <Zoom in={trigger}>
        <IconButton onClick={scrollToTop} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          <KeyboardArrowUp />
        </IconButton>
      </Zoom>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'transparent', textAlign: 'center', borderTop: '1px solid #e0e0e0', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 1 }}>
          <img src={srawsmainlogo} alt="Logo" style={{ height: 50 }} />
        </Box>
        <Typography variant="body2" component="div" sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
          <Link href="/" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            Home
          </Link>
          <Link href="/Help" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            Help
          </Link>
          <Link href="/about" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            About
          </Link>
          <Link href="/ChatPage" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            SRAWS Community
          </Link>
          <Link href="/privacy-policy" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            Terms of Service
          </Link>
          <Link href="/cookie-policy" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            Cookie Policy
          </Link>
          <Link href="/copyright-policy" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' }, color: 'text.primary' }}>
            Copyright Policy
          </Link>
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <IconButton href="https://www.facebook.com" target="_blank" rel="noopener" sx={{ color: 'text.primary', mx: 1 }}>
            <Facebook />
          </IconButton>
          <IconButton href="https://www.twitter.com" target="_blank" rel="noopener" sx={{ color: 'text.primary', mx: 1 }}>
            <Twitter />
          </IconButton>
          <IconButton href="https://www.instagram.com" target="_blank" rel="noopener" sx={{ color: 'text.primary', mx: 1 }}>
            <Instagram />
          </IconButton>
          <IconButton href="https://www.linkedin.com" target="_blank" rel="noopener" sx={{ color: 'text.primary', mx: 1 }}>
            <LinkedIn />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
          Contact us: <Link href="mailto:contact@sraws.com" color="inherit">contact@sraws.com</Link>
        </Typography>
        <Typography variant="caption" color="text.primary">
          &copy; {new Date().getFullYear()} SRAWS. All rights reserved. 
        </Typography>
      </Container>
      <ScrollTop />
    </Box>
  );
};

export default Footer;
