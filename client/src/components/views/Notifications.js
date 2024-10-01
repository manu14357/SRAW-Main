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
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Message as MessageIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO, subDays, subMonths } from 'date-fns';
import ReplyIcon from '@mui/icons-material/Reply'; // Example icon for replies

import UserAvatar from '../UserAvatar';

// Custom styles
const styles = {
  container: {
    position: 'relative',
    padding: '16px',
    backgroundColor: '#fff', // Lighter background for modern look
    borderRadius: '12px',
    maxWidth: '700px',
    margin: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #e0e0e0', // Soft divider for structure
    paddingBottom: '8px',
  },
  searchField: {
    marginBottom: '16px',
    width: '100%', // Full width for cleaner input
    backgroundColor: '#f9f9f9', // Lighter search background
    borderRadius: '8px',
  },
  filterButton: {
    padding: '8px',
    borderRadius: '50%',
    background: '#f1f1f1', // Soft background for icons
    boxShadow: 'none',
    '&:hover': {
      background: '#e0e0e0',
    },
  },
  unreadNotification: {
    backgroundColor: '#e8f4fc', // Subtle highlight for unread notifications
    borderRadius: '8px',
    marginBottom: '8px',
  },
  listItem: {
    borderRadius: '10px',
    marginBottom: '12px',
    padding: '12px 16px',
    backgroundColor: '#fafafa',
    transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transitions
    '&:hover': {
      backgroundColor: '#f1f1f1',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Subtle hover shadow
    },
  },
  timestamp: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  },
  listItemAvatar: {
    minWidth: '48px',
  },
  listItemText: {
    overflowWrap: 'break-word',
    marginRight: '12px',
  },
};


const SOCKET_SERVER_URL = 'wss://api.sraws.com:4000';

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

  const handleFilterChange = (filter) => {
    setFilter(filter);
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
      const response = await axios.get(`https://api.sraws.com/api/notifications/${userId}`);
      const notificationsData = response.data;
      if (Array.isArray(notificationsData)) {
        setNotifications(notificationsData);
        setNotificationCount(notificationsData.length);
      } else {
        setError('Unexpected data format');
      }
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
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => {
      clearInterval(intervalId);
      socketConnection.disconnect();
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (!tabOpened) {
      tabCloseTimeoutRef.current = setTimeout(() => {
        markAllAsRead();
      }, 8000);
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
      await axios.put(`https://api.sraws.com/api/notifications/mark-all-read/${userId}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`https://api.sraws.com/api/notifications/${notificationId}/read`);
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
      case 'reply':
        return `${senderUsername} replied to your comment`;
      default:
        return 'You have a new notification';
    }
  };
  
  const getNotificationIcon = (notification) => {
    const iconStyle = { color: '#1976d2' }; // Set the blue color here
  
    switch (notification.type) {
      case 'like':
        return <ThumbUpIcon sx={iconStyle} />;
      case 'comment':
        return <CommentIcon sx={iconStyle} />;
      case 'message':
        return <MessageIcon sx={iconStyle} />;
      case 'reply':
        return <ReplyIcon sx={iconStyle} />; // Icon for replies
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
      .filter((notification) => {
        const text = getNotificationText(notification).toLowerCase();
        return text.includes(searchTerm.toLowerCase());
      })
      .filter((notification) => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notification.read;
        return notification.type === filter;
      })
      .filter((notification) => new Date(notification.createdAt) >= getStartDate())
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

  return (
    <div style={styles.container}
      onFocus={() => setTabOpened(true)} 
      onBlur={() => setTabOpened(false)}
    >
      <div style={styles.header}>
        <Typography variant="h6">Notifications ({notificationCount})</Typography>
        <Tooltip title="Filters">
          <IconButton onClick={handleClickFilterMenu} sx={styles.filterButton}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TextField
        placeholder="Search notifications..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={styles.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={styles.searchIcon} />
            </InputAdornment>
          ),
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseFilterMenu}
        PaperProps={{ style: styles.menuPaper }}
        ref={menuRef}
      >
        <MenuItem onClick={() => handleTimeFilterChange('24h')}>Last 24 hours</MenuItem>
        <MenuItem onClick={() => handleTimeFilterChange('week')}>Last week</MenuItem>
        <MenuItem onClick={() => handleTimeFilterChange('month')}>Last month</MenuItem>
        <Divider />
        <MenuItem onClick={() => handleFilterChange('all')}>All</MenuItem>
        <MenuItem onClick={() => handleFilterChange('unread')}>Unread</MenuItem>
        <MenuItem onClick={() => handleFilterChange('like')}>Likes</MenuItem>
        <MenuItem onClick={() => handleFilterChange('comment')}>Comments</MenuItem>
        <MenuItem onClick={() => handleFilterChange('message')}>Messages</MenuItem>
      </Menu>

      <List>
        {filteredNotifications.map(([date, notifications]) => (
          <div key={date}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ marginTop: '16px', fontWeight: 'bold' }}>
              {date}
            </Typography>
            {notifications.map((notification) => (
              <ListItem
                key={notification._id}
                alignItems="flex-start"
                style={notification.read ? {} : styles.unreadNotification}
                sx={styles.listItem}
                onClick={() => {
                  if (notification.type === 'message') {
                    window.location.href = 'https://sraws.com/messenger';
                  } else if (notification.type === 'like' || notification.type === 'comment') {
                    const postId = notification.post ? notification.post._id : null;
                    const commentId = notification.comment ? notification.comment._id : null;

                    if (postId) {
                      let url = `https://sraws.com/posts/${postId}`;
                      if (notification.type === 'comment' && commentId) {
                        url += `#comment-${commentId}`;
                      }
                      window.location.href = url;
                    }
                  }
                  markAsRead(notification._id);
                }}
              >

                <ListItemAvatar>
                  <UserAvatar
                    username={notification.sender ? notification.sender.username : 'Unknown'}
                    height={40}
                    width={40}
                    online={notification.sender ? notification.sender.online : false}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: !notification.read ? 'bold' : 'normal' }}
                    >
                      {getNotificationText(notification)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={styles.timestamp}>
                      {formatDistanceToNow(parseISO(notification.createdAt)) + ' ago'}
                    </Typography>
                  }
                  sx={styles.listItemText}
                />
                <ListItemAvatar sx={styles.listItemAvatar}>
                  <Avatar sx={{ backgroundColor: 'transparent' }}>
                    {getNotificationIcon(notification)}
                  </Avatar>
                </ListItemAvatar>
              </ListItem>
            ))}
          </div>
        ))}
      </List>
    </div>
  );
};

export default Notifications;

