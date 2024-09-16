import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Slide,
  useScrollTrigger,
} from '@mui/material';

import { Menu, Close, Home, Info, Policy, Security, Help, Gavel } from '@mui/icons-material';

import { styled } from '@mui/system';
import srawsmainlogo from "../Assets/srawsmainlogo.png";
import HelpOutline from '@mui/icons-material/HelpOutline';

// Styled components
const WhiteAppBar = styled(AppBar)({
  background: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  zIndex: 1201,
  position: 'sticky',
  top: 0,
  transition: 'background 0.3s ease, box-shadow 0.3s ease',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontWeight: '500',
  padding: '10px 20px',
  margin: '0 8px',
  position: 'sticky',
  borderRadius: '8px',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease',
  },
  '&.active': {
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

const SidebarHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#f9f9f9',
});

const SidebarTitle = styled(Typography)({
  flexGrow: 1,
  fontWeight: 'bold',
  fontSize: '20px',
  display: 'block', // Ensure the title is visible
  color: '#333', // Optional: Set a color for the title
});

const SidebarListItem = styled(ListItem)({
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '16px',
  color: '#000',  // Text color for white background
  '&:hover': {
    backgroundColor: '#f0f0f0',
    transition: 'background-color 0.3s ease',
  },
  '&.active': {
    backgroundColor: '#e0e0e0',
    color: '#000',
  },
});

const Sidebar = ({ open, onClose }) => (
  <Drawer anchor="right" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: '250px', backgroundColor: '#ffffff' } }}>
    <Box sx={{ width: '250px', height: '100%', backgroundColor: '#ffffff' }}>
      <SidebarHeader>
        <SidebarTitle variant="h6">Menu</SidebarTitle> {/* Sidebar title hidden */}
        
        <IconButton color="inherit" edge="end" onClick={onClose}>
          <Close sx={{ color: '#333' }} />
        </IconButton>
      </SidebarHeader>
      <Divider />
      <List>
        <SidebarListItem button component="a" href="/" onClick={onClose}>
          <Home sx={{ marginRight: '10px' }} />
          <ListItemText primary="Home" />
        </SidebarListItem>
        <SidebarListItem button component="a" href="/Help" onClick={onClose}>
           <HelpOutline sx={{ marginRight: '10px' }} />
           <ListItemText primary="Help" />
        </SidebarListItem>

        <SidebarListItem button component="a" href="/About" onClick={onClose}>
          <Info sx={{ marginRight: '10px' }} />
          <ListItemText primary="About" />
        </SidebarListItem>
        <SidebarListItem button component="a" href="/privacy-policy" onClick={onClose}>
          <Policy sx={{ marginRight: '10px' }} />
          <ListItemText primary="Privacy Policy" />
        </SidebarListItem>
        <SidebarListItem button component="a" href="/terms-of-service" onClick={onClose}>
          <Security sx={{ marginRight: '10px' }} />
          <ListItemText primary="Terms of Service" />
        </SidebarListItem>
        <SidebarListItem button component="a" href="/cookie-policy" onClick={onClose}>
          <Help sx={{ marginRight: '10px' }} />
          <ListItemText primary="Cookie Policy" />
        </SidebarListItem>
        <SidebarListItem button component="a" href="/copyright-policy" onClick={onClose}>
          <Gavel sx={{ marginRight: '10px' }} />
          <ListItemText primary="Copyright Policy" />
        </SidebarListItem>
      </List>
    </Box>
  </Drawer>
);

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
  <AppBar
      position="sticky"
      sx={{ top: 0, zIndex: 1100, backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
    <div>
     
        <WhiteAppBar>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/" color="inherit" underline="none">
                  <img src={srawsmainlogo} alt="Logo" style={{ height: 50 }} />
                </Link>
              </Typography>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <NavButton href="/" className={window.location.pathname === '/' ? 'active' : ''} onClick={handleLinkClick}>
                  Home
                </NavButton>
                <NavButton href="/About" className={window.location.pathname === '/About' ? 'active' : ''} onClick={handleLinkClick}>
                  About
                </NavButton>
                <NavButton href="/Help" className={window.location.pathname === '/Help' ? 'active' : ''} onClick={handleLinkClick}>
                  Help
                </NavButton>
                
                
                <NavButton href="/privacy-policy" className={window.location.pathname === '/privacy-policy' ? 'active' : ''} onClick={handleLinkClick}>
                  Privacy Policy
                </NavButton>
                <NavButton href="/terms-of-service" className={window.location.pathname === '/terms-of-service' ? 'active' : ''} onClick={handleLinkClick}>
                  Terms of Service
                </NavButton>
                <NavButton href="/cookie-policy" className={window.location.pathname === '/cookie-policy' ? 'active' : ''} onClick={handleLinkClick}>
                  Cookie Policy
                </NavButton>
                <NavButton href="/copyright-policy" className={window.location.pathname === '/copyright-policy' ? 'active' : ''} onClick={handleLinkClick}>
                  Copyright Policy
                </NavButton>
              </Box>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label={sidebarOpen ? "close sidebar" : "open sidebar"}
                  edge="end"
                  onClick={toggleSidebar}
                  sx={{ display: { md: 'none' }, ml: 2 }}
                >
                  {sidebarOpen ? <Close sx={{ color: '#333' }} /> : <Menu sx={{ color: '#333' }} />}
                </IconButton>
              )}
            </Toolbar>
          </Container>
        </WhiteAppBar>
      

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
    </AppBar>
  );
};

export default Navbar;
