import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid #e0e0e0', mt: 'auto', py: 3, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Sraws. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Link href="/" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
                Home
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/About" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
                About
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/Help" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
                Help
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/Community-Corner" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
              Sraws Community
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/privacy-policy" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
                Privacy Policy
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/terms-of-service" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
                Terms of Service
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/cookie-policy" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
                Cookie Policy
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/copyright-policy" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } }}>
              <Typography variant="body2">
                Copyright Policy
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
