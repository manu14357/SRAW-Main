import React from 'react';
import { Typography, Container, Box, Divider } from '@mui/material';
import Navbar from './Navbar'; // Adjust the path based on your project structure
import Footer from './Footer'; // Adjust the path based on your project structure
import { Helmet } from 'react-helmet';

const CookiePolicy = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>Cookie Policy - Your Website Name</title>
        <meta name="description" content="Learn about the types of cookies we use, how we use them, and how you can manage your cookie preferences." />
        <meta name="keywords" content="Cookie Policy, Cookies, Privacy, User Data, Website Policy" />
        <meta name="author" content="Your Website Name" />
        <link rel="canonical" href="https://www.yourwebsite.com/cookie-policy" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Cookie Policy - Your Website Name" />
        <meta property="og:description" content="Understand the types of cookies we use on our website and how they impact your experience." />
        <meta property="og:url" content="https://www.yourwebsite.com/cookie-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.yourwebsite.com/path/to/image.jpg" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cookie Policy - Your Website Name" />
        <meta name="twitter:description" content="Learn about the cookies we use and how you can manage them." />
        <meta name="twitter:image" content="https://www.yourwebsite.com/path/to/image.jpg" />
      </Helmet>
      <Navbar />
      <Container maxWidth="md" sx={{ flexGrow: 1 }}>
        <Box sx={{ py: 5 }}>
        <Typography variant="h2" gutterBottom align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Cookie Policy
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph align="center">
            Effective Date: August 16, 2024
          </Typography>
          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              1. Introduction
            </Typography>
            <Typography variant="body1" paragraph>
              Cookies are small text files that are stored on your device when you visit a website. They help us improve user experience by remembering user settings and preferences.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              2. Types of Cookies We Use
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Essential Cookies:</strong> Necessary for the basic functioning of the platform.<br />
              <strong>Performance Cookies:</strong> Collect information about how users interact with the platform.<br />
              <strong>Functionality Cookies:</strong> Remember user preferences and settings.<br />
              <strong>Targeting Cookies:</strong> Used to deliver relevant advertisements to users.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              3. How We Use Cookies
            </Typography>
            <Typography variant="body1" paragraph>
              We use cookies to:
              <ul>
                <li>Authenticate users.</li>
                <li>Track user preferences.</li>
                <li>Monitor and analyze usage and trends.</li>
                <li>Deliver targeted advertisements.</li>
              </ul>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              4. Managing Cookies
            </Typography>
            <Typography variant="body1" paragraph>
              Users can manage their cookie preferences through their browser settings. Disabling cookies may affect the functionality of the platform.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              5. Changes to This Cookie Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update this Cookie Policy from time to time. We will notify users of any changes by posting the new Cookie Policy on our website.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              6. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              Email: support@example.com<br />
              Community Forum: [Insert forum link]
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              Advanced Legal Section
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Data Retention</strong><br />
              Cookies and related data will be retained for as long as necessary to fulfill the purposes outlined in this policy. Users can delete cookies at any time through their browser settings.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Third-Party Cookies</strong><br />
              We may allow third-party service providers to place cookies on your device for analytics and advertising purposes. These third parties have their own privacy policies and cookie policies.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>User Consent</strong><br />
              By using our platform, you consent to our use of cookies as described in this policy. If you do not consent, you may disable cookies through your browser settings.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" paragraph>
              If you have any questions or concerns about our use of cookies, please contact us at the above email address.
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
