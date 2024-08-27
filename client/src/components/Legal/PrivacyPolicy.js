import React from 'react';
import { Typography, Container, Box, Divider, Link } from '@mui/material';
import Navbar from './Navbar'; // Adjust the path based on your project structure
import Footer from './Footer'; // Adjust the path based on your project structure
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Helmet>
        <title>Privacy Policy - SRAWS</title>
        <meta name="description" content="Read the privacy policy for SRAWS, detailing how we collect, use, and store your data." />
        <meta name="keywords" content="Privacy Policy, Data Protection, User Information, SRAWS" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://sraws.mrcitsoft.com/privacy-policy" />
      </Helmet>
      <Navbar />
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" gutterBottom align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Privacy Policy
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph align="center">
            Effective Date: August 16, 2024
          </Typography>
          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              1. Information We Collect
            </Typography>
            <Typography variant="h6" gutterBottom>
              1.1 User Information
            </Typography>
            <Typography variant="body1" paragraph>
              We collect various types of information from users, including:
            </Typography>
            <ul>
              <li><strong>Email Address:</strong> Used for user authentication, communication, and notifications.</li>
              <li><strong>User Reviews:</strong> Feedback and reviews provided by users regarding current scams.</li>
              <li><strong>Post Content:</strong> Titles, content, media, and location information added by users when posting on our platform.</li>
            </ul>
            
            <Typography variant="h6" gutterBottom>
              1.2 Information Provided by Users
            </Typography>
            <ul>
              <li><strong>Login Information:</strong> Usernames and passwords for account creation and access.</li>
              <li><strong>Contact Information:</strong> Email addresses and other contact details provided during account setup.</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              1.3 Finding Friends Access
            </Typography>
            <Typography variant="body1" paragraph>
              Users can search for and connect with other users on the platform, enabling communication and collaboration.
            </Typography>

            <Typography variant="h6" gutterBottom>
              1.4 Analytics Information
            </Typography>
            <Typography variant="body1" paragraph>
              We collect analytics data to understand user interaction and improve our services. This includes:
            </Typography>
            <ul>
              <li>Device information (type, operating system, browser).</li>
              <li>Usage data (pages visited, time spent on the platform, interactions).</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              1.5 Cookies and Similar Technologies
            </Typography>
            <Typography variant="body1" paragraph>
              We use cookies and similar technologies to:
            </Typography>
            <ul>
              <li>Track user activity and preferences.</li>
              <li>Enhance user experience by remembering settings.</li>
              <li>Provide personalized content and advertisements.</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              1.6 Log File Information
            </Typography>
            <Typography variant="body1" paragraph>
              Our servers automatically collect log file information, including:
            </Typography>
            <ul>
              <li>IP addresses.</li>
              <li>Browser types.</li>
              <li>Referring/exit pages.</li>
              <li>Date/time stamps.</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              1.7 Device Identifiers
            </Typography>
            <Typography variant="body1" paragraph>
              We collect unique device identifiers to:
            </Typography>
            <ul>
              <li>Enhance security.</li>
              <li>Improve service functionality.</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              1.8 Metadata
            </Typography>
            <Typography variant="body1" paragraph>
              Metadata includes technical data associated with user content, such as:
            </Typography>
            <ul>
              <li>Date and time of content creation.</li>
              <li>Device and application used to create the content.</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We use the information we collect to:
            </Typography>
            <ul>
              <li>Provide, maintain, and improve our services.</li>
              <li>Respond to user inquiries and provide customer support.</li>
              <li>Monitor and analyze usage and trends.</li>
              <li>Personalize user experience.</li>
              <li>Communicate with users about updates, promotions, and news.</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              2.1 Parties with Whom We May Share Information
            </Typography>
            <Typography variant="body1" paragraph>
              We may share user information with:
            </Typography>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf.</li>
              <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              2.2 Parties with Whom You May Choose to Share Your User Content
            </Typography>
            <Typography variant="body1" paragraph>
              Users can choose to share their content with others on the platform, such as:
            </Typography>
            <ul>
              <li>Scam reports.</li>
              <li>Comments.</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              2.3 What Happens in the Event of a Change of Control
            </Typography>
            <Typography variant="body1" paragraph>
              If we are involved in a merger, acquisition, or sale of all or a portion of our assets, user information may be transferred as part of that transaction.
            </Typography>

            <Typography variant="h6" gutterBottom>
              2.4 Responding to Legal Requests and Preventing Harm
            </Typography>
            <Typography variant="body1" paragraph>
              We may access, preserve, and share your information in response to a legal request if we believe that disclosure is required by law.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              3. How We Store Your Information
            </Typography>
            <Typography variant="h6" gutterBottom>
              3.1 Storage Locations
            </Typography>
            <Typography variant="body1" paragraph>
              User data is stored in secure databases, including MongoDB and Hostinger.
            </Typography>

            <Typography variant="h6" gutterBottom>
              3.2 Storage and Processing
            </Typography>
            <Typography variant="body1" paragraph>
              Data is processed using secure technologies, such as PHP.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              4. Your Account Information and Profile/Privacy Settings
            </Typography>
            <Typography variant="h6" gutterBottom>
              4.1 Account Type
            </Typography>
            <Typography variant="body1" paragraph>
              Public accounts are visible to all users on the platform.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.2 How Long We Keep User Content
            </Typography>
            <Typography variant="body1" paragraph>
              We retain user content for as long as necessary to fulfill the purposes for which it was collected.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              5. Children's Privacy
            </Typography>
            <Typography variant="body1" paragraph>
              We do not knowingly collect or solicit personal information from children under the age of 13. If we become aware that we have collected personal information from a child under age 13, we will delete that information.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              6. Other Websites and Services
            </Typography>
            <Typography variant="body1" paragraph>
              Our platform may contain links to other websites or services. We are not responsible for the privacy practices or content of those third-party sites.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              7. Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update this Privacy Policy from time to time. We will notify users of significant changes by posting the new policy on our website.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              8. Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </Typography>
            <Typography variant="body1" paragraph>
              Contact us: <Link href="mailto:support@sraws.com" color="inherit">support@sraws.com</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
