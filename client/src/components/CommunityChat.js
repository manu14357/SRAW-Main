import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import axios from 'axios';
import { HelmetProvider, Helmet } from 'react-helmet-async';

const CommunityChat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [filteredChatMessages, setFilteredChatMessages] = useState([]);
  const [chatSearch, setChatSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [userName, setUserName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const chatEndRef = useRef(null); // Reference to scroll to the bottom

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await axios.get('/api/chat/messages');
        setChatMessages(response.data || []); // Ensure chatMessages is always an array
        setFilteredChatMessages(response.data || []); // Initialize with all chat messages
      } catch (error) {
        console.error('Error fetching chat messages', error);
      }
    };

    fetchChatMessages();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages are updated
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Filter chat messages based on search input
    if (chatSearch) {
      setFilteredChatMessages(chatMessages.filter(msg => msg.text.toLowerCase().includes(chatSearch.toLowerCase())));
    } else {
      setFilteredChatMessages(chatMessages);
    }
  }, [chatSearch, chatMessages]);

  const handleChatMessageSend = async () => {
    try {
      await axios.post('/api/chat/send', { message, sender: userName || 'Anonymous' });
      const newMessage = { text: message, sender: userName || 'You', createdAt: new Date(), replies: [] };
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      setFilteredChatMessages(prevMessages => [...prevMessages, newMessage]); // Update filtered messages
      setMessage('');
      setUserName('');
      setSelectedMessage(null);
      setSnackbarMessage('Message sent!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to send message.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleChatReply = async (messageId) => {
    try {
      await axios.post('/api/chat/reply', { messageId, reply: { message }, sender: userName || 'Anonymous' });
      setChatMessages(prevMessages => prevMessages.map(msg =>
        msg._id === messageId ? { ...msg, replies: [...(msg.replies || []), { text: message, sender: userName || 'Anonymous', createdAt: new Date() }] } : msg
      ));
      setFilteredChatMessages(prevMessages => prevMessages.map(msg =>
        msg._id === messageId ? { ...msg, replies: [...(msg.replies || []), { text: message, sender: userName || 'Anonymous', createdAt: new Date() }] } : msg
      )); // Update filtered messages
      setMessage('');
      setUserName('');
      setSelectedMessage(null);
      setSnackbarMessage('Reply sent!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to send reply.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box alignItems="center" sx={{ width: '100%', maxWidth: 6000, margin: 'auto', mt: 4 }}>


      <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ fontSize: '2.4rem' ,color: 'primary.main'}}>
        SRAWS Community
      </Typography>

      <TextField
        fullWidth
        label="Search Chat Messages"
        variant="outlined"
        value={chatSearch}
        onChange={(e) => setChatSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 1,
          height: 450,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          mb: 2
        }}
      >
        {filteredChatMessages.map((msg) => (
          <Box key={msg._id} sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{msg.sender}</Typography>
            <Typography variant="body2">{msg.text}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(msg.createdAt).toLocaleString()}</Typography>

            {msg.replies && msg.replies.length > 0 && (
              <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #ddd' }}>
                {msg.replies.map((reply, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{reply.sender}</Typography>
                    <Typography variant="body2">{reply.text}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(reply.createdAt).toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
            )}
            <Button
              startIcon={<ReplyIcon />}
              onClick={() => {
                setSelectedMessage(msg._id);
                setMessage('');
              }}
            >
              Reply
            </Button>
          </Box>
        ))}
        <div ref={chatEndRef} /> {/* Empty div to scroll into view */}
      </Box>

      <TextField
        fullWidth
        label="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Your Name (Optional)"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        type="button"
        onClick={selectedMessage ? () => handleChatReply(selectedMessage) : handleChatMessageSend}
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
      >
        {selectedMessage ? 'Reply' : 'Send'}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommunityChat;
