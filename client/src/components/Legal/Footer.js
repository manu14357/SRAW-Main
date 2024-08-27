import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid #e0e0e0', mt: 'auto', py: 3, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Link href="/" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
                Home
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/About" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
                About
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/Help" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
                Help
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/ChatPage" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
                SRAWS Community
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/privacy-policy" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
                Privacy Policy
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/terms-of-service" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
                Terms of Service
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/cookie-policy" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
                Cookie Policy
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/copyright-policy" color="textSecondary" underline="hover">
              <Typography variant="body2" color="textSecondary">
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
