import React from 'react';
import { Typography, Container, Box, Divider, Grid, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { motion } from 'framer-motion'; // Import framer-motion for animations
import Navbar from './Navbar'; // Adjust the path based on your project structure
import Footer from './Footer'; // Adjust the path based on your project structure
import { Helmet } from 'react-helmet'; 

// Define animations using framer-motion
const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1 }
};

const slideInUpAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 }
};

// Background gradient style
const backgroundStyle = {
  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
};

// Card Styles
const cardStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  p: 4,
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
  height: '100%',
  textAlign: 'center',
  color: '#555',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
    backgroundColor: '#f0f4f8',
  }
};

const iconStyles = {
  fontSize: 60,
  color: '#0288d1',
  mb: 2,
};

const About = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden', ...backgroundStyle }}>
      <Helmet>
        <title>About SRAWS - Report Scams & Fraudulent Activities</title>
        <meta name="description" content="Learn about SRAWS, a platform that empowers communities by reporting and alerting about scams and fraudulent activities." />
        <meta name="keywords" content="SRAWS, scam reports, fraud prevention, scam alerts, community safety, report scams, avoid scams" />
        <meta name="author" content="SRAWS Team" />
        <link rel="canonical" href="https://yourwebsite.com/about" />
        <meta property="og:title" content="About SRAWS - Report Scams & Fraudulent Activities" />
        <meta property="og:description" content="Empowering communities by reporting and alerting about scams and fraudulent activities." />
        <meta property="og:url" content="https://yourwebsite.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://yourwebsite.com/path-to-your-image.jpg" />
      </Helmet>
      <Navbar />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Box sx={{ py: 5 }}>
          {/* Header Section */}
          <motion.div {...fadeInAnimation}>
            <Typography variant="h3" gutterBottom align="center" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
              About SRAWS
            </Typography>
            <Typography variant="h6" align="center" sx={{ mb: 4, color: '#555', fontStyle: 'italic' }}>
              Empowering communities by reporting and alerting about scams and fraudulent activities.
            </Typography>
          </motion.div>

          <Divider sx={{ my: 4, borderColor: '#ddd' }} />

          {/* Vision */}
          <motion.div {...slideInUpAnimation}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
              Our Vision
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#555', textAlign: 'center', px: { xs: 2, sm: 4 } }}>
              To create a world where individuals and communities are empowered with reliable information and resources to protect themselves from scams and fraudulent activities. We envision a transparent, informed society where scams are reported and resolved efficiently, fostering trust and safety for all.
            </Typography>
          </motion.div>

          <Divider sx={{ my: 4, borderColor: '#ddd' }} />

          {/* Mission */}
          <motion.div {...slideInUpAnimation}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#555', textAlign: 'center', px: { xs: 2, sm: 4 } }}>
              Our mission is to provide a robust platform where users can report, discuss, and track scams and fraudulent activities. We aim to enhance public awareness and offer actionable insights to prevent and address scams. Through community collaboration and cutting-edge technology, we strive to protect and inform individuals across the globe.
            </Typography>
          </motion.div>

          <Divider sx={{ my: 4, borderColor: '#ddd' }} />

          {/* How SRAWS Works */}
          <motion.div {...slideInUpAnimation}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
              How SRAWS Works
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={cardStyles}>
                  <InfoOutlinedIcon sx={iconStyles} />
                  <Typography variant="h6" sx={{ mb: 1, color: '#3f51b5' }}>
                    Report Scams
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Share detailed reports about scams and fraudulent activities. Provide descriptions, locations, and media to alert others.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ensure your report is comprehensive and accurate to help others avoid similar scams.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={cardStyles}>
                  <VisibilityOutlinedIcon sx={iconStyles} />
                  <Typography variant="h6" sx={{ mb: 1, color: '#3f51b5' }}>
                    View Reports
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Browse through a list of scam reports submitted by users. Filter by location, date, and type for relevant information.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stay informed and avoid potential scams by reviewing reports in your area.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={cardStyles}>
                  <NotificationsOutlinedIcon sx={iconStyles} />
                  <Typography variant="h6" sx={{ mb: 1, color: '#3f51b5' }}>
                    Receive Alerts
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Get notified when you are near high-risk areas based on recent scam reports.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    This feature is coming soon! Stay tuned for updates and improvements.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={cardStyles}>
                  <GroupAddOutlinedIcon sx={iconStyles} />
                  <Typography variant="h6" sx={{ mb: 1, color: '#3f51b5' }}>
                    Engage
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Interact with posts by commenting, voting on their helpfulness, and sharing them with others.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Your feedback helps us improve and makes our community stronger.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </motion.div>

          <Divider sx={{ my: 4, borderColor: '#ddd' }} />

          {/* Get Involved */}
          <motion.div {...fadeInAnimation}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
              Get Involved
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#555', textAlign: 'center', px: { xs: 2, sm: 4 } }}>
              Ready to make a difference? Here’s how you can get involved:
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={cardStyles}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#0288d1' }}>
                    Report Scams
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Share your experiences and alert others about scams.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Contribute to a safer community by reporting scams and fraudulent activities.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={cardStyles}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#0288d1' }}>
                    Spread Awareness
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Share our platform with friends and family to increase awareness.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Help us reach more people and make a greater impact.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={cardStyles}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#0288d1' }}>
                    Volunteer
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Join our team and contribute your skills to our mission.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Contact us to learn more about volunteering opportunities.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button variant="contained" color="primary" href="/signup">
                Sign Up
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default About;
