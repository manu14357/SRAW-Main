import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import { useForm, Controller } from 'react-hook-form';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import Navbar from './Legal/Navbar';
import Footer from './Legal/Footer';
import { Helmet } from 'react-helmet';

const Help = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [chatMessages, setChatMessages] = useState([]);
  const [filteredChatMessages, setFilteredChatMessages] = useState([]);
  const [chatSearch, setChatSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null); // For reply functionality
  const [userName, setUserName] = useState(''); // For user name input
  const [expanded, setExpanded] = useState(false);
  const chatEndRef = useRef(null); // Reference to scroll to the bottom

  const { handleSubmit, control, reset } = useForm();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('https://api.sraws.com/api/feedback/all');
        setFeedbacks(response.data);
        setFilteredFeedbacks(response.data); // Initialize with all feedbacks
      } catch (error) {
        console.error('Error fetching feedbacks', error);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await axios.get('https://api.sraws.com/api/chat/messages');
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
    // Filter feedbacks based on search input
    if (feedbackSearch) {
      setFilteredFeedbacks(feedbacks.filter(feedback => feedback.title.toLowerCase().includes(feedbackSearch.toLowerCase()) || feedback.feedback.toLowerCase().includes(feedbackSearch.toLowerCase())));
    } else {
      setFilteredFeedbacks(feedbacks);
    }
  }, [feedbackSearch, feedbacks]);

  useEffect(() => {
    // Filter chat messages based on search input
    if (chatSearch) {
      setFilteredChatMessages(chatMessages.filter(msg => msg.text.toLowerCase().includes(chatSearch.toLowerCase())));
    } else {
      setFilteredChatMessages(chatMessages);
    }
  }, [chatSearch, chatMessages]);

  const handleFeedbackSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post('https://api.sraws.com/api/feedback/submit', {
        name: data.name,
        title: data.title,
        feedback: editorState.getCurrentContent().getPlainText(),
      });
      setSnackbarMessage('Your feedback has been submitted!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      reset();
      setEditorState(EditorState.createEmpty());
      setOpenFeedbackDialog(false);
      const response = await axios.get('https://api.sraws.com/api/feedback/all');
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data); // Update filtered feedbacks
    } catch (error) {
      setSnackbarMessage('Failed to submit feedback.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleChatMessageSend = async () => {
    try {
      await axios.post('https://api.sraws.com/api/chat/send', { message, sender: userName || 'Anonymous' });
      const newMessage = { text: message, sender: userName || 'You', createdAt: new Date(), replies: [] };
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      setFilteredChatMessages(prevMessages => [...prevMessages, newMessage]); // Update filtered messages
      setMessage('');
      setUserName('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error sending chat message', error);
    }
  };

  const handleChatReply = async (messageId) => {
    try {
      await axios.post('https://api.sraws.com/api/chat/reply', { messageId, reply: { message }, sender: userName || 'Anonymous' });
      setChatMessages(prevMessages => prevMessages.map(msg =>
        msg._id === messageId ? { ...msg, replies: [...(msg.replies || []), { text: message, sender: userName || 'Anonymous', createdAt: new Date() }] } : msg
      ));
      setFilteredChatMessages(prevMessages => prevMessages.map(msg =>
        msg._id === messageId ? { ...msg, replies: [...(msg.replies || []), { text: message, sender: userName || 'Anonymous', createdAt: new Date() }] } : msg
      )); // Update filtered messages
      setMessage('');
      setUserName('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error sending chat reply', error);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString(); // Format timestamp as desired
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>Help Center - SRAWS</title>
        <meta name="description" content="Find answers to frequently asked questions about SRAWS, including how to report scams, search for users, and more." />
        <meta property="og:title" content="Help Center - SRAWS" />
        <meta property="og:description" content="Find answers to frequently asked questions about SRAWS, including how to report scams, search for users, and more." />
        <meta property="og:url" content="https://sraws.mrcitsoft.com/help" />
        <meta property="og:image" content="URL_TO_IMAGE" />
        <link rel="canonical" href="https://sraws.mrcitsoft.com/help" />
      </Helmet>
    <Navbar />
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
    
      <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ fontSize: '2.4rem' ,color: 'primary.main'}}>
        Help Center
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Frequently Asked Questions
        </Typography>
<Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>What is SRAWS?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      SRAWS (Scam Reporting & Alert Website) is a platform that allows users to  share details about their experiences related to scams, frauds, and other negative incidents. The platform aims to raise awareness and help users stay informed about potential dangers in their areas.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>How do I report a scam?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      To report a scam, simply visit the "Report" page, fill out the form with details about the scam, including the location and any media (photos or videos) you have, and submit your report. Create an account to track your reports.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel17'} onChange={handleAccordionChange('panel17')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Does the Report page automatically fetch my location?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, the Report page automatically fetches your location. However, you can manually edit the location details if needed before submitting the report.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel19'} onChange={handleAccordionChange('panel19')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Can I search for other users on the platform?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, you can search for other users and connect with them through the message chat function on the platform.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel20'} onChange={handleAccordionChange('panel20')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>How can I get more information about a reported post?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      If you need more information about a reported post, you can directly message the poster or leave a comment on their post.
    </Typography>
  </AccordionDetails>
</Accordion>



<Accordion expanded={expanded === 'panel18'} onChange={handleAccordionChange('panel18')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>How many media files can I upload with a post?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Users can upload up to 3 media files (images, videos, or audios) with a single post.
    </Typography>
  </AccordionDetails>
</Accordion>


<Accordion expanded={expanded === 'panel21'} onChange={handleAccordionChange('panel21')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>How will I receive notifications?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Notifications will be sent to the email address you used to sign up, and you can also check them on the Notifications page within the SRAWS platform.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel22'} onChange={handleAccordionChange('panel22')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>How do I earn Social Points on the platform?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      You can earn Social Points by engaging in various activities on the platform:
      <ul>
        <li>Post a new post: Earn 5 points for each post you create.</li>
        <li>Like a post: Earn 2 points for each like you give on any post.</li>
        <li>Comment on a post: Earn 3 points for each comment you make on a post.</li>
      </ul>
    </Typography>
  </AccordionDetails>
</Accordion>


<Accordion expanded={expanded === 'panel23'} onChange={handleAccordionChange('panel23')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>Can I share posts or user profiles on other platforms?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, you can share posts or user profiles on other platforms, including social media, using a QR code or direct link.
    </Typography>
  </AccordionDetails>
</Accordion>


<Accordion expanded={expanded === 'panel24'} onChange={handleAccordionChange('panel24')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>Can I add or edit my bio on my profile?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, you can add or edit your bio in your profile settings at any time.
    </Typography>
  </AccordionDetails>
</Accordion>



<Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>Can I remain anonymous when reporting a scam?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, you have the option to submit scam reports anonymously. However, if you choose to create an account, you can track your submissions and receive updates on your reports.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>How does the alert system work?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      The alert system notifies you when you enter areas with reported scams. These alerts are based on the location data from your device, ensuring you stay informed about potential risks nearby.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>What type of scams can I report?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      You can report any type of scam, including online fraud, phishing attempts, phone scams, in-person scams, and more. We encourage you to provide as much detail as possible to help others avoid falling victim to similar scams.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel25'} onChange={handleAccordionChange('panel25')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>What should I do if I have doubts or questions?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      If you have any doubts or questions, you can message in the SRAWS Community Chat, either anonymously or with your name. The entire community will see your message, and anyone can reply to you through the chat page.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel26'} onChange={handleAccordionChange('panel26')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>How can I provide feedback on the platform?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      You can provide feedback by visiting the Help page and clicking on the "Provide Feedback" button. Here, you can write and submit your feedback.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel27'} onChange={handleAccordionChange('panel27')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>What are Top Posts on the Home page?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      The Home page features Top Posts, which are highlighted based on their like count, allowing you to see the most popular content first.
    </Typography>
  </AccordionDetails>
</Accordion>


<Accordion expanded={expanded === 'panel6'} onChange={handleAccordionChange('panel6')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>How can I find scam reports in my area?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      You can search for scam reports by location using the search bar on the homepage. You can also browse reports using filters such as date, type of scam, and location.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel7'} onChange={handleAccordionChange('panel7')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>Is the information on SRAWS verified?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      While SRAWS relies on user-generated content, we take steps to ensure the credibility of reports. However, we recommend that users exercise caution and conduct their own due diligence when assessing the information provided.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel8'} onChange={handleAccordionChange('panel8')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>Can I interact with other users on the platform?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, you can comment on scam reports, Like on their helpfulness, and share them with others. If you have an account, you can also message other users to discuss reports in more detail.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel9'} onChange={handleAccordionChange('panel9')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>What should I do if I receive a scam alert?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      If you receive a scam alert, it’s important to stay vigilant. Avoid engaging with potential scammers, do not share personal information, and report any suspicious activity to local authorities or on our platform.
    </Typography>
  </AccordionDetails>
</Accordion>



<Accordion expanded={expanded === 'panel11'} onChange={handleAccordionChange('panel11')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>How is my data used and stored?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Your data is stored securely on our servers and is used only to improve your experience on the platform. We do not share your personal information with third parties without your consent. For more details, please refer to our Privacy Policy.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel12'} onChange={handleAccordionChange('panel12')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>How do I contact SRAWS if I have more questions or issues?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      If you have any further questions or encounter any issues, you can contact us through the "Help" page, or send us an email at support@team.sraws.com. We're here to help!
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel13'} onChange={handleAccordionChange('panel13')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>What should I do if I need to report an urgent scam or criminal activity?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      If you encounter an urgent scam or criminal activity, please contact your local law enforcement immediately. SRAWS is a platform for sharing information, but it is not a substitute for emergency services.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel14'} onChange={handleAccordionChange('panel14')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>Can I remove or edit my scam report after submission?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, if you have an account, you can log in and edit or delete your scam reports.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel15'} onChange={handleAccordionChange('panel15')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>Are there any rules or guidelines for submitting a scam report?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Yes, we ask that all users adhere to our community guidelines, which prohibit the submission of false information, offensive content, or any other material that violates our Terms of Service. Violating these rules may result in the removal of your content and possible account suspension.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel16'} onChange={handleAccordionChange('panel16')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1"sx={{ fontWeight: 'bold' }}>What are the legal implications of using SRAWS?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      By using SRAWS, you agree to our Terms of Service, which outlines your rights and responsibilities as a user. SRAWS does not assume liability for the content submitted by users, and we encourage you to report any violations or concerns.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion expanded={expanded === 'panel28'} onChange={handleAccordionChange('panel28')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>How can I contact support if I need more help?</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      If you need further assistance or have more questions, please contact our support team at: 
      <a href="mailto:support@team.sraws.com">support@team.sraws.com</a>.
    </Typography>
  </AccordionDetails>
</Accordion>


        {/* Add more FAQs as needed */}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 4 }}
        onClick={() => setOpenFeedbackDialog(true)}
      >
        Provide Feedback
      </Button>

      <Dialog open={openFeedbackDialog} onClose={() => setOpenFeedbackDialog(false)}>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit(handleFeedbackSubmit)} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Your Name (Optional)"
                  {...field}
                />
              )}
            />
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Feedback Title"
                  {...field}
                />
              )}
            />
            <Box sx={{ mb: 2 }}>
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                toolbarClassName="demo-toolbar"
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ fontSize: '2.4rem' ,color: 'primary.main'}}>
        User Feedback's
      </Typography>
      <TextField
        fullWidth
        label="Search Feedbacks"
        variant="outlined"
        value={feedbackSearch}
        onChange={(e) => setFeedbackSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {filteredFeedbacks.length ? (
        filteredFeedbacks.map((feedback) => (
          <Box key={feedback._id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
            <Typography variant="h6">{feedback.title}</Typography>
            <Typography variant="body2" color="textSecondary">{feedback.feedback}</Typography>
            <Typography variant="caption" color="textSecondary">{formatTimestamp(feedback.createdAt)}</Typography>
          </Box>
        ))
      ) : (
        <Typography>No feedbacks found.</Typography>
      )}


<Box sx={{ mt: 4, textAlign: 'center' }}>
  <Typography variant="h6" gutterBottom>
    Need More Help?
  </Typography>
  <Typography>
    If you have any questions or need further assistance, please reach out to our support team at:
  </Typography>
  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
    <a href="mailto:support@sraws.com">support@team.sraws.com</a>
  </Typography>
</Box>



      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    <Footer />
    </div>
  );
};

export default Help;
