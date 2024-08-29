// ShareDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Alert,
  TextField,
  CircularProgress
} from '@mui/material';
import QRCodeWithLogo from './QRCodeWithLogo'; // Adjust import if necessary
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope, FaFacebookMessenger } from 'react-icons/fa';

const ShareDialog = ({ open, onClose, link, postSummary }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleCopy = () => {
    setLoading(true);
    navigator.clipboard.writeText(link).then(() => {
      setLoading(false);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const handleEmailShare = () => {
    const mailtoLink = `mailto:${encodeURIComponent(email)}?subject=Check this out&body=${encodeURIComponent(link)}`;
    window.open(mailtoLink, '_blank');
    setEmail('');
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Share Post</DialogTitle>
        <DialogContent>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h6" align="center">
              Share this post:
            </Typography>
            {postSummary && (
              <Typography variant="body2" color="textSecondary" align="center">
                {postSummary}
              </Typography>
            )}
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mb={3}>
              <IconButton
                component="a"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
                target="_blank"
                aria-label="Share on Facebook"
                sx={{ bgcolor: '#3b5998', '&:hover': { bgcolor: '#334d84' } }}
              >
                <FaFacebook color="#ffffff" />
              </IconButton>
              <IconButton
                component="a"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`}
                target="_blank"
                aria-label="Share on Twitter"
                sx={{ bgcolor: '#1da1f2', '&:hover': { bgcolor: '#0d95e8' } }}
              >
                <FaTwitter color="#ffffff" />
              </IconButton>
              <IconButton
                component="a"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`}
                target="_blank"
                aria-label="Share on LinkedIn"
                sx={{ bgcolor: '#0077b5', '&:hover': { bgcolor: '#005c99' } }}
              >
                <FaLinkedin color="#ffffff" />
              </IconButton>
              <IconButton
                component="a"
                href={`https://wa.me/?text=${encodeURIComponent(link)}`}
                target="_blank"
                aria-label="Share on WhatsApp"
                sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1ebc6d' } }}
              >
                <FaWhatsapp color="#ffffff" />
              </IconButton>
              <IconButton
                component="a"
                href={`mailto:?subject=Check this out&body=${encodeURIComponent(link)}`}
                target="_blank"
                aria-label="Share via Email"
                sx={{ bgcolor: '#D44638', '&:hover': { bgcolor: '#b83d30' } }}
              >
                <FaEnvelope color="#ffffff" />
              </IconButton>
              <IconButton
                component="a"
                href={`https://www.messenger.com/t/?link=${encodeURIComponent(link)}`}
                target="_blank"
                aria-label="Share via Messenger"
                sx={{ bgcolor: '#0084ff', '&:hover': { bgcolor: '#0073e6' } }}
              >
                <FaFacebookMessenger color="#ffffff" />
              </IconButton>
            </Box>
            <Box display="flex" justifyContent="center" mb={3}>
              <QRCodeWithLogo value={link} />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopy}
              fullWidth
              disabled={loading}
              sx={{ height: 48, fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Copy Link'}
            </Button>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEmailShare}
              fullWidth
              disabled={!email}
              sx={{ height: 48, fontWeight: 'bold' }}
            >
              Share via Email
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Link copied to clipboard!"
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDialog;
