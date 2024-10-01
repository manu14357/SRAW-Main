import React from 'react';
import { Typography, Container, Box, Divider } from '@mui/material';
import Navbar from './Navbar'; // Adjust the path based on your project structure
import Footer from './Footer'; // Adjust the path based on your project structure
import { Helmet } from 'react-helmet';

const TermsOfService = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>Terms of Service | Sraws</title>
        <meta name="description" content="Read our Terms of Service to understand your rights and responsibilities when using our platform." />
        <meta name="keywords" content="Terms of Service, user agreement, platform rules, legal terms" />
        <meta property="og:title" content="Terms of Service | Sraws" />
        <meta property="og:description" content="Read our Terms of Service to understand your rights and responsibilities when using our platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sraws.com/terms-of-service" />
        <meta property="og:image" content="" />
        <meta property="og:image:alt" content="Terms of Service" />
      </Helmet>
      <Navbar />
      <Container maxWidth="md" sx={{ flexGrow: 1 }}>
        <Box sx={{ py: 5 }}>
        <Typography variant="h2" gutterBottom align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Terms of Service
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph align="center">
            Effective Date: August 16, 2024
          </Typography>
          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing and using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              2. Changes to Terms
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on our website. Your continued use of the platform after such changes have been made constitutes your acceptance of the new terms.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              3. User Accounts
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>3.1 Account Creation</strong><br />
              To access certain features of the platform, you must create an account. You agree to provide accurate and complete information during the registration process and to keep your account information updated.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>3.2 Account Responsibilities</strong><br />
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              4. User Conduct
            </Typography>
            <Typography variant="body1" paragraph>
              You agree to use the platform only for lawful purposes and in accordance with these terms. You agree not to:
            </Typography>
            <ul>
              <li>Use the platform in any manner that could disable, overburden, damage, or impair the platform.</li>
              <li>Upload, post, or transmit any material that infringes on the intellectual property rights of others.</li>
              <li>Harass, abuse, or harm another person.</li>
              <li>Use any robot, spider, or other automated means to access the platform for any purpose.</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              5. Content
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>5.1 Your Content</strong><br />
              You retain ownership of the content you post on the platform. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, copy, modify, and display your content in connection with the operation of the platform.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>5.2 Our Content</strong><br />
              All content provided on the platform is for general information purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the content.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              6. Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              All intellectual property rights in the platform and its content are owned by us or our licensors. You may not use, copy, or distribute any content without our prior written permission.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              7. Termination
            </Typography>
            <Typography variant="body1" paragraph>
              We may terminate or suspend your account and access to the platform at our sole discretion, without prior notice or liability, for any reason, including if you breach these terms.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              8. Disclaimers
            </Typography>
            <Typography variant="body1" paragraph>
              The platform is provided on an "as is" and "as available" basis. We disclaim all warranties of any kind, whether express or implied, including the warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              9. Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
              To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </Typography>
            <ul>
              <li>Your use or inability to use the platform.</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein.</li>
              <li>Any interruption or cessation of transmission to or from the platform.</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the platform by any third party.</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the platform.</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              10. Indemnification
            </Typography>
            <Typography variant="body1" paragraph>
              You agree to indemnify and hold us harmless from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the platform or your violation of these terms.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              11. Governing Law
            </Typography>
            <Typography variant="body1" paragraph>
              These terms will be governed by and construed in accordance with the laws, without regard to its conflict of law principles.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              12. Dispute Resolution
            </Typography>
            <Typography variant="body1" paragraph>
              Any disputes arising out of or relating to these terms or the platform will be resolved through binding arbitration in accordance with the rules.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
              13. General Terms
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>13.1 Entire Agreement</strong><br />
              These terms constitute the entire agreement between you and us regarding the platform and supersede all prior agreements.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>13.2 Waiver and Severability</strong><br />
              Our failure to enforce any right or provision of these terms will not be considered a waiver of those rights. If any provision of these terms is held to be invalid or unenforceable, the remaining provisions will remain in effect.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>13.3 Assignment</strong><br />
              You may not assign or transfer these terms, by operation of law or otherwise, without our prior written consent. Any attempt by you to assign or transfer these terms without such consent will be null and of no effect. We may assign or transfer these terms at our sole discretion, without restriction.
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default TermsOfService;
