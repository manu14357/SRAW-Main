import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import axios from 'axios';
import io from 'socket.io-client';

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
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.sraws.com/api/chat/messages');
        setChatMessages(response.data || []);
        setFilteredChatMessages(response.data || []);
      } catch (error) {
        console.error('Error fetching chat messages', error);
        setSnackbarMessage('Failed to load messages.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (chatSearch) {
      setFilteredChatMessages(chatMessages.filter(msg => msg.text.toLowerCase().includes(chatSearch.toLowerCase())));
    } else {
      setFilteredChatMessages(chatMessages);
    }
  }, [chatSearch, chatMessages]);

  // WebSocket setup
  useEffect(() => {
    const socket = io('/'); // Connect to the server
    socket.on('chatMessage', (newMessage) => {
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      setFilteredChatMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChatMessageSend = async () => {
    setLoading(true);
    try {
      await axios.post('https://api.sraws.com/api/chat/send', { message, sender: userName || 'Anonymous' });
      const newMessage = { text: message, sender: userName || 'You', createdAt: new Date(), replies: [] };
      setMessage('');
      setUserName('');
      setSelectedMessage(null);
      setSnackbarMessage('Message sent!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Failed to send message.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleChatReply = async (messageId) => {
    setLoading(true);
    try {
      await axios.post('https://api.sraws.com/api/chat/reply', { messageId, reply: { message }, sender: userName || 'Anonymous' });
      setMessage('');
      setUserName('');
      setSelectedMessage(null);
      setSnackbarMessage('Reply sent!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Failed to send reply.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box alignItems="center" sx={{ width: '100%', maxWidth: 6000, margin: 'auto', mt: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ fontSize: '2.4rem', color: 'primary.main' }}>
        Sraws Community
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
        {loading ? (
          <CircularProgress sx={{ alignSelf: 'center', mt: 2 }} />
        ) : (
          filteredChatMessages.map((msg) => (
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
          ))
        )}
        <div ref={chatEndRef} />
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
        disabled={loading}
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
