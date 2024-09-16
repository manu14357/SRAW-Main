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
  CircularProgress,
  Tooltip,
  Slide
} from '@mui/material';
import QRCodeWithLogo from './QRCodeWithLogo'; // Adjust import if necessary
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope, FaFacebookMessenger } from 'react-icons/fa';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShareDialog = ({ open, onClose, link, postSummary }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    setLoading(true);
    navigator.clipboard.writeText(link).then(() => {
      setLoading(false);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs" // Reduced width for desktop mode
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px', padding: '20px' } }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.4rem',
            backgroundColor: 'blue',
            color: '#fff',
            padding: '12px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        >
          Share This Post
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} alignItems="center">
            <Typography variant="body1" align="center" sx={{ fontSize: '1.1rem', fontWeight: 'medium' }}>
              Share this post with others:
            </Typography>
            {postSummary && (
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ fontStyle: 'italic', maxWidth: '80%', marginBottom: '16px' }}
              >
                {postSummary}
              </Typography>
            )}
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mb={3}>
              {[{
                href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
                label: 'Facebook',
                icon: <FaFacebook color="#ffffff" />,
                bgColor: '#3b5998',
                hoverColor: '#334d84'
              }, {
                href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
                label: 'Twitter',
                icon: <FaTwitter color="#ffffff" />,
                bgColor: '#1da1f2',
                hoverColor: '#0d95e8'
              }, {
                href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
                label: 'LinkedIn',
                icon: <FaLinkedin color="#ffffff" />,
                bgColor: '#0077b5',
                hoverColor: '#005c99'
              }, {
                href: `https://wa.me/?text=${encodeURIComponent(link)}`,
                label: 'WhatsApp',
                icon: <FaWhatsapp color="#ffffff" />,
                bgColor: '#25D366',
                hoverColor: '#1ebc6d'
              }, {
                href: `https://www.messenger.com/t/?link=${encodeURIComponent(link)}`,
                label: 'Messenger',
                icon: <FaFacebookMessenger color="#ffffff" />,
                bgColor: '#0084ff',
                hoverColor: '#0073e6'
              }].map(({ href, label, icon, bgColor, hoverColor }, index) => (
                <Tooltip key={index} title={label} arrow>
                  <IconButton
                    component="a"
                    href={href}
                    target="_blank"
                    aria-label={label}
                    sx={{ bgcolor: bgColor, '&:hover': { bgcolor: hoverColor }, transition: 'background-color 0.3s', p: 1.5 }}
                  >
                    {icon}
                  </IconButton>
                </Tooltip>
              ))}
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
              sx={{ height: 48, fontWeight: 'bold', mb: 2, borderRadius: '8px' }}
            >
              {loading ? <CircularProgress size={24} color="primary.main" /> : 'Copy Link'}
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="outlined" sx={{ borderRadius: '8px' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Link copied to clipboard!"
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ borderRadius: '8px' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDialog;
