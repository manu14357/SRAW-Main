import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Menu,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Message as MessageIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO, subDays, subMonths } from 'date-fns';

// Custom style for blue color and transparent background
const iconStyle = { 
  color: '#1976d2', // Custom color for icons
  background: 'transparent', // Remove background color
  border: 'none' // Remove border if any
};

// Custom style to remove background from IconButton
const iconButtonStyle = { 
  padding: 0,
  minWidth: 0,
  borderRadius: '50%',
  background: 'transparent',
  boxShadow: 'none'
};

// Custom style for unread notifications
const unreadNotificationStyle = { 
  backgroundColor: '#e3f2fd' // Very light blue color
};

const SOCKET_SERVER_URL = 'ws://localhost:4000';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [tabOpened, setTabOpened] = useState(false);

  const openFilterMenu = Boolean(anchorEl);
  const menuRef = useRef(null);
  const tabCloseTimeoutRef = useRef(null);

  const handleClickFilterMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
    handleCloseFilterMenu();
  };

  const fetchNotifications = useCallback(async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('User ID is not available');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/notifications/${userId}`);
      const notificationsData = response.data;
      setNotifications(notificationsData);
      setNotificationCount(notificationsData.length);
    } catch (err) {
      setError(`Error fetching notifications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  fetchNotifications(); // Fetch notifications on component mount

  const intervalId = setInterval(fetchNotifications, 30000); // Refresh notifications every 30 seconds

  const socketConnection = io(SOCKET_SERVER_URL);
  setSocket(socketConnection);

  socketConnection.on('newNotification', (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setNotificationCount(prevCount => prevCount + 1);
  });

  return () => {
    clearInterval(intervalId);
    socketConnection.disconnect();
  };
}, [fetchNotifications]);

useEffect(() => {
  if (!tabOpened) {
    // Schedule mark all as read with a 60-second delay after tab is closed
    tabCloseTimeoutRef.current = setTimeout(() => {
      console.log("Marking all as read...");
      markAllAsRead(); // Add a console log to debug if this is being called
    }, 6000);
  }

  return () => {
    if (tabCloseTimeoutRef.current) {
      clearTimeout(tabCloseTimeoutRef.current);
    }
  };
}, [tabOpened]);

const markAllAsRead = async () => {
  try {
    const userId = localStorage.getItem('userId');
    console.log(`Marking all notifications as read for user ${userId}`);
    await axios.put(`/api/notifications/mark-all-read/${userId}`);
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
  }
};

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationText = (notification) => {
  const senderUsername = notification.sender ? notification.sender.username : 'Unknown user';
  switch (notification.type) {
    case 'like':
      return `${senderUsername} liked your post`;
    case 'comment':
      return `${senderUsername} commented on your post`;
    case 'message':
      return `You received a message from ${senderUsername}`;
    default:
      return 'You have a new notification';
  }
};


  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <Avatar sx={iconStyle}>
            <ThumbUpIcon sx={iconStyle} />
          </Avatar>
        );
      case 'comment':
        return (
          <Avatar sx={iconStyle}>
            <CommentIcon sx={iconStyle} />
          </Avatar>
        );
      case 'message':
        return (
          <Avatar sx={iconStyle}>
            <MessageIcon sx={iconStyle} />
          </Avatar>
        );
      default:
        return null;
    }
  };

  const groupNotificationsByDate = (notifications) => {
    const grouped = notifications.reduce((acc, notification) => {
      const date = new Date(notification.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notification);
      return acc;
    }, {});
    return Object.entries(grouped);
  };

  const getStartDate = () => {
    const now = new Date();
    switch (timeFilter) {
      case '24h':
        return subDays(now, 1);
      case 'week':
        return subDays(now, 7);
      case 'month':
        return subMonths(now, 1);
      default:
        return new Date(0); // No filter, show all
    }
  };

  const filteredNotifications = groupNotificationsByDate(
    notifications
      .filter(notification => {
        const text = getNotificationText(notification).toLowerCase();
        return text.includes(searchTerm.toLowerCase());
      })
      .filter(notification => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notification.read;
        return notification.type === filter;
      })
      .filter(notification => new Date(notification.createdAt) >= getStartDate())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleFilterChange = (filter) => {
    setFilter(filter);
    handleCloseFilterMenu();
  };

  return (
    <div
      style={{ position: 'relative' }}
      onFocus={() => setTabOpened(true)} // Set tabOpened to true on focus
      onBlur={() => setTabOpened(false)} // Set tabOpened to false on blur
    >

      <Box mb={2}>
        <Typography variant="h6">Notifications: {notificationCount}</Typography>
      </Box>
      <Tooltip title="Filters">
        <IconButton onClick={handleClickFilterMenu} sx={iconButtonStyle}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseFilterMenu}
        PaperProps={{ style: { maxHeight: '200px', width: '200px' } }}
        ref={menuRef}
      >
        <MenuItem onClick={() => handleTimeFilterChange('24h')}>Last 24 hours</MenuItem>
        <MenuItem onClick={() => handleTimeFilterChange('week')}>Last week</MenuItem>
        <MenuItem onClick={() => handleTimeFilterChange('month')}>Last month</MenuItem>
        <Divider />
        <MenuItem onClick={() => handleFilterChange('all')}>All Notifications</MenuItem>
        <MenuItem onClick={() => handleFilterChange('like')}>Likes</MenuItem>
        <MenuItem onClick={() => handleFilterChange('comment')}>Comments</MenuItem>
        <MenuItem onClick={() => handleFilterChange('message')}>Messages</MenuItem>
        <MenuItem onClick={() => handleFilterChange('unread')}>Unread</MenuItem>
      </Menu>

      <List>
        {filteredNotifications.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No notifications
          </Typography>
        ) : (
          filteredNotifications.map(([date, notificationsForDate], index) => (
            <React.Fragment key={index}>
              <Typography variant="subtitle1" color="textSecondary" style={{ margin: '16px 0' }}>
                {date}
              </Typography>
              {notificationsForDate.map(notification => (
                <ListItem
                  key={notification._id}
                  button
                  onClick={() => markAsRead(notification._id)}
                  style={notification.read ? {} : unreadNotificationStyle}
                >
                  <ListItemAvatar>
                    {getNotificationIcon(notification)}
                  </ListItemAvatar>
                  <ListItemText
                    primary={getNotificationText(notification)}
                    secondary={formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                  />
                </ListItem>
              ))}
            </React.Fragment>
          ))
        )}
      </List>
    </div>
  );
};

export default Notifications;
