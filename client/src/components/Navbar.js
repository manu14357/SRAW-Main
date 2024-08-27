import React, { useEffect, useState,useCallback } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  AiFillFileText,
  AiFillHome,
  AiFillMessage,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineMenu,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import { getConversations } from "../api/messages";
import { socket } from "../helpers/socketHelper";
import axios from 'axios';
import FindUsers from "./FindUsersnavbar";
import srawslogo from "./Assets/srawslogo.png";
import Notifications from "./views/Notifications"; 
import NotifyView from "./views/Notifyview";
import About from "../components/Legal/About";

const Navbar = () => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const theme = useTheme();
  const username = user && user.username;
  const [search, setSearch] = useState("");
  const [messageNotifications, setMessageNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(0);
  const [openFindUsers, setOpenFindUsers] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for anchor element of menu
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout confirmation dialog
  const [openNotifications, setOpenNotifications] = useState(false); // State for notifications dialog

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) return;

    try {
      const response = await axios.get(`/api/notifications/${userId}`);
      const notificationsData = response.data;

      // Calculate unread notifications count
      const unreadNotifications = notificationsData.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);


  useEffect(() => {
    updateDimensions();
   

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [user]);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const handleLogout = async () => {
    logoutUser();
    navigate("/login");
    handleCloseMenu(); // Close menu after logout
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({ search }).toString();
    navigate(`/search?${queryParams}`);
  };

  const handleSearchIcon = () => {
    setSearchIcon(!searchIcon);
  };

  const handleOpenFindUsers = () => {
    setOpenFindUsers(true);
  };

  const handleCloseFindUsers = () => {
    setOpenFindUsers(false);
  };



  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [messageNotifications]);

  const handleReceiveMessage = (senderId, username, content) => {
    setMessageNotifications((prev) => prev + 1);

    setUnreadMessages((prevUnreadMessages) => ({
      ...prevUnreadMessages,
      [senderId]: (prevUnreadMessages[senderId] || 0) + 1,
    }));
  };



  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenNotifications = () => {
    setOpenNotifications(true);
  };

  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };

  

  return (
    <Stack
      position="sticky"
      top={0}
      zIndex={10}
      bgcolor="background.paper"
      borderBottom={`1px solid ${theme.palette.divider}`}
      mb={2}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 2,
          pb: 1,
          px: 1,
        }}
        spacing={!mobile ? 2 : 0}
      >
        <HorizontalStack>
          <img
            src={srawslogo}
            alt="Logo"
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              width: "35px",
              height: "50px",
            }}
          />
          <Typography
            variant={navbarWidth ? "h6" : "h4"}
            sx={{
              display: mobile ? "none" : "block",
              color: "#00A0FD",
              fontFamily: "Courier PS Bold Italic",
            }}
          >
            SRAWS
          </Typography>
        </HorizontalStack>

        {!navbarWidth && (
          <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, maxWidth: "40%" }}>
            <TextField
              size="small"
              label="Search"
              fullWidth
              onChange={handleChange}
              value={search}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <AiOutlineSearch />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        <HorizontalStack>
          {mobile && (
            <IconButton onClick={handleSearchIcon}>
              <AiOutlineSearch />
            </IconButton>
          )}

          <IconButton onClick={handleOpenFindUsers}>
            <Tooltip title="Total Users">
              <AiOutlineUser />
            </Tooltip>
          </IconButton>

          <IconButton component={Link} to={"/"}>
            <Tooltip title="Home">
              <AiFillHome />
            </Tooltip>
          </IconButton>

          {user && (
            <>
              <IconButton component={Link} to={"/Notifyview"}>
                <Tooltip title="Notifications">
                  <Badge badgeContent={unreadCount} color="error">
                    <AiOutlineBell />
                  </Badge>
                </Tooltip>
              </IconButton>

              <IconButton component={Link} to={"/messenger"}> {/* badgeContent={unreadCount} */}
                <Tooltip title="Messages">
                  <Badge  color="error">  
                    <AiFillMessage />
                  </Badge>
                </Tooltip>
              </IconButton>

              <IconButton component={Link} to={"/users/" + username}>
                <Tooltip title="Profile">
                  <UserAvatar width={30} height={30} username={user.username} />
                </Tooltip>
              </IconButton>
              <IconButton onClick={handleClickMenu} sx={{ fontSize: "1.5rem" }}>
                <Tooltip title="Menu">
                  <AiOutlineMenu />
                </Tooltip>
              </IconButton>
            </>
          )}

          {!user && (
            <>
              <Button variant="text" sx={{ minWidth: 80 }} href="/signup">
                Sign Up
              </Button>
              <Button variant="text" sx={{ minWidth: 65 }} href="/login">
                Login
              </Button>
            </>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
          >
            <MenuItem onClick={() => navigate("/About")}>About</MenuItem>
            <MenuItem onClick={() => navigate("/Help")}>Help</MenuItem>
            <MenuItem onClick={() => navigate("/ChatPage")}>SRAWS Community</MenuItem>
            <MenuItem onClick={() => navigate("/privacy-policy")}>Privacy Policies</MenuItem>
            <MenuItem onClick={() => navigate("/terms-of-service")}>Terms of Service</MenuItem>
            <MenuItem onClick={() => navigate("/cookie-policy")}>Cookie Policy</MenuItem>
            <MenuItem onClick={() => navigate("/copyright-policy")}>Copyright Policy</MenuItem>
            
            <MenuItem onClick={() => setOpenLogoutDialog(true)}>Logout</MenuItem>
          </Menu>
        </HorizontalStack>
      </Stack>

      

      {/* Notifications Dialog */}
      {user && (
        <Dialog
          open={openNotifications}
          onClose={handleCloseNotifications}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Notifications</DialogTitle>
          <DialogContent>
            <Notifications />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNotifications}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Find Users Dialog */}
      <Dialog
        open={openFindUsers}
        onClose={handleCloseFindUsers}
        fullWidth
        maxWidth="md"
      >
        
        <DialogContent>
          <FindUsers />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFindUsers}>Close</Button>
        </DialogActions>
      </Dialog>



            {navbarWidth && searchIcon && (
        <Box component="form" onSubmit={handleSubmit} px={2} mt={1}>
          <TextField
            size="small"
            label="Search for posts..."
            fullWidth
            onChange={handleChange}
            value={search}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <AiOutlineSearch />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </Stack>
  );
};

export default Navbar;
