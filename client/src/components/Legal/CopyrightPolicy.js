import React from 'react';
import { Typography, Container, Box, Divider } from '@mui/material';
import Navbar from './Navbar'; // Adjust the path based on your project structure
import Footer from './Footer'; // Adjust the path based on your project structure
import { Helmet } from 'react-helmet';

const CopyrightPolicy = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>Copyright Policy - Sraws</title>
        <meta name="description" content="Read our copyright policy to understand how we handle intellectual property rights, reporting copyright infringements, and more." />
        <meta name="keywords" content="Copyright Policy, Intellectual Property, DMCA, Infringements, Legal" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.sraws.com/copyright-policy" />
        <meta property="og:title" content="Copyright Policy - Sraws" />
        <meta property="og:description" content="Learn about our copyright policy, how to report infringements, and what actions we take to protect intellectual property rights." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.sraws.com/copyright-policy" />
        <meta property="og:image" content="" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Copyright Policy - Sraws" />
        <meta name="twitter:description" content="Learn about our copyright policy, how to report infringements, and what actions we take to protect intellectual property rights." />

      </Helmet>
      <Navbar />
      <Container maxWidth="md" sx={{ flexGrow: 1 }}>
        <Box sx={{ py: 5 }}>
        <Typography variant="h2" gutterBottom align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Copyright Policy
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph align="center">
            Effective Date: August 16, 2024
          </Typography>
          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              1. Respect for Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              We respect the intellectual property rights of others and expect our users to do the same. Users are prohibited from posting content that infringes on the copyrights of others.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              2. Reporting Copyright Infringements
            </Typography>
            <Typography variant="body1" paragraph>
              If you believe that your copyrighted work has been posted on our platform without authorization, you may notify us by providing the following information:
              <ul>
                <li>A description of the copyrighted work that has been infringed.</li>
                <li>The URL or location on our platform where the infringing material is located.</li>
                <li>Your contact information (name, address, email address).</li>
                <li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner.</li>
                <li>A statement that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner.</li>
              </ul>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              3. Removal of Infringing Material
            </Typography>
            <Typography variant="body1" paragraph>
              Upon receiving a valid copyright infringement notification, we will remove the infringing material and take appropriate action against the user responsible for the infringement.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              4. Repeat Infringers
            </Typography>
            <Typography variant="body1" paragraph>
              We have a policy of terminating the accounts of users who repeatedly infringe on the copyrights of others.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              5. Counter-Notification
            </Typography>
            <Typography variant="body1" paragraph>
              If you believe that your content was removed by mistake or misidentification, you may submit a counter-notification. Your counter-notification must include:
              <ul>
                <li>A description of the material that was removed and its location before removal.</li>
                <li>A statement under penalty of perjury that you have a good faith belief that the material was removed as a result of mistake or misidentification.</li>
                <li>Your contact information (name, address, email address).</li>
                <li>A statement that you consent to the jurisdiction of the federal court in your district, and that you will accept service of process from the person who provided the original infringement notification.</li>
              </ul>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              6. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
                Email: support@team.sraws.com<br />
                Community Forum: <a href="https://sraws.com/ChatPage" target="_blank" rel="noopener noreferrer">SRAWS Community</a>
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            Advanced Legal Section
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" paragraph>
              <strong>Safe Harbor Provision</strong><br />
              We comply with the safe harbor provisions of the Digital Millennium Copyright Act (DMCA). We are not liable for infringing content posted by users if we are unaware of the infringement and act promptly to remove infringing material upon receiving a valid notification.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Indemnification</strong><br />
              Users agree to indemnify and hold us harmless from any claims, damages, or expenses arising from their violation of this copyright policy.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>No Liability for User Issues</strong><br />
              We are not responsible for any problems or issues that arise from the use of the platform. Users acknowledge and agree that they use the platform at their own risk, and we disclaim any liability for any loss, damage, or harm arising from the use of the platform.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" paragraph>
              If you have any questions or concerns about this Copyright Policy, please contact us using the information provided above.
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default CopyrightPolicy;
