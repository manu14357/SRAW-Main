import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import axios from 'axios';
import io from 'socket.io-client';
import { Helmet } from "react-helmet"; // For SEO meta tags

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

  useEffect(() => {
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

  const refreshMessages = async () => {
    await fetchChatMessages(); // Refresh the chat messages after sending
  };

  const handleChatMessageSend = async () => {
    setLoading(true);
    try {
      await axios.post('https://api.sraws.com/api/chat/send', { message, sender: userName || 'Anonymous' });
      setMessage(''); // Clear message input
      setUserName(''); // Clear username input
      setSelectedMessage(null); // Reset reply state
      setSnackbarMessage('Message sent!');
      setSnackbarSeverity('success');
      await refreshMessages(); // Refresh the chat messages
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
      await refreshMessages(); // Refresh the chat messages
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
      
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Sraws Community Chat - Join the Conversation</title>
        <meta name="description" content="Join the Sraws community chat to discuss various topics with other members. Get quick replies, engage in discussions, and more." />
        <meta property="og:title" content="Sraws Community Chat" />
        <meta property="og:description" content="Engage with others in real-time conversations on Sraws Community." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sraws.com/static/chat-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

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

              {/* Schema.org structured data for each message */}
              <script type="application/ld+json">
                {`
                {
                  "@context": "https://schema.org",
                  "@type": "Comment",
                  "text": "${msg.text}",
                  "author": {
                    "@type": "Person",
                    "name": "${msg.sender}"
                  },
                  "datePublished": "${new Date(msg.createdAt).toISOString()}",
                  "inLanguage": "en",
                  "interactionType": "https://schema.org/CommentAction",
                  "mainEntityOfPage": "https://sraws.com/Community-Corner"
                }
                `}
              </script>

              {msg.replies && msg.replies.length > 0 && (
                <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #ddd' }}>
                  {msg.replies.map((reply, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{reply.sender}</Typography>
                      <Typography variant="body2">{reply.text}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(reply.createdAt).toLocaleString()}</Typography>
                      
                      {/* Schema for replies */}
                      <script type="application/ld+json">
                        {`
                        {
                          "@context": "https://schema.org",
                          "@type": "Comment",
                          "text": "${reply.text}",
                          "author": {
                            "@type": "Person",
                            "name": "${reply.sender}"
                          },
                          "datePublished": "${new Date(reply.createdAt).toISOString()}",
                          "inLanguage": "en",
                          "interactionType": "https://schema.org/CommentAction",
                          "mainEntityOfPage": "https://sraws.com/Community-Corner"
                        }
                        `}
                      </script>
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
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={() => (selectedMessage ? handleChatReply(selectedMessage) : handleChatMessageSend())}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : selectedMessage ? 'Send Reply' : 'Send Message'}
      </Button>

      {/* Snackbar for notifications */}
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
