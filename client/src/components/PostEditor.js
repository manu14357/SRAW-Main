import { createPost } from "../api/posts"; // Adjust the path based on your project structure
import {
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  LinearProgress,
  Box,
} from "@mui/material";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorAlert from "./ErrorAlert";
import { isLoggedIn } from "../helpers/authHelper";
import HorizontalStack from "./util/HorizontalStack";
import UserAvatar from "./UserAvatar";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CloseIcon from '@mui/icons-material/Close';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to Bytes

const PostEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    country: "",
    state: "",
    city: "",
    area: "",
    mediaFiles: [],
    mediaPreviews: [], // Holds file previews with type and previewUrl
    mediaError: "",
  });
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const user = isLoggedIn();

  // Validation function to check form fields
  const validate = (data) => {
    const errors = {};
    if (!data.title) {
      errors.title = "Title is required";
    } else if (data.title.length > 80) {
      errors.title = "Title should not exceed 80 characters";
    }
    if (!data.content) {
      errors.content = "Content is required";
    } else if (data.content.length > 8000) {
      errors.content = "Content should not exceed 8000 characters";
    }
    if (!data.country) {
      errors.country = "Country is required";
    }

    return errors;
  };

  // Handle form input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      setErrors(validate(updatedData));
      return updatedData;
    });
  }, []);

const handleMediaChange = (e) => {
  const newFile = e.target.files[0];
  if (!newFile) return;

  if (newFile.size > MAX_FILE_SIZE_BYTES) {
    setFormData((prevData) => ({
      ...prevData,
      mediaFiles: [],
      mediaPreviews: [],
      mediaError: `File size exceeds ${MAX_FILE_SIZE_MB} MB.`,
    }));
    return;
  }

  if (formData.mediaFiles.length >= 3) {
    setFormData((prevData) => ({
      ...prevData,
      mediaError: "You can upload a maximum of 3 files.",
    }));
    return;
  }

  const previewUrl = URL.createObjectURL(newFile);
  const type = newFile.type.startsWith('video') ? 'video' : (newFile.type.startsWith('audio') ? 'audio' : 'image');

  setFormData((prevData) => ({
    ...prevData,
    mediaFiles: [...prevData.mediaFiles, newFile],
    mediaPreviews: [...prevData.mediaPreviews, { file: newFile, previewUrl, type }],
    mediaError: "",
  }));
};

  

  // Handle media file removal
  const handleRemoveMedia = (index) => {
    setFormData((prevData) => {
      const updatedPreviews = prevData.mediaPreviews.filter((_, i) => i !== index);
      const updatedFiles = prevData.mediaFiles.filter((_, i) => i !== index);
      return {
        ...prevData,
        mediaFiles: updatedFiles,
        mediaPreviews: updatedPreviews,
        mediaError: "",
      };
    });
    setUploadProgress(0);
    setUploadComplete(false);
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Upload media files and get URLs
    const mediaUrls = await uploadMediaFiles(formData.mediaFiles);

    // Create post with form data and uploaded media URLs
    const data = await createPost({
      ...formData,
      mediaUrls
    }, user);

    setLoading(false);

    if (data && data.error) {
      setServerError(data.error);
    } else {
      navigate("/posts/" + data._id);
    }
  };

  // Function to upload media files and return URLs
  const uploadMediaFiles = async (files) => {
    const mediaUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("media[]", file); // Ensure the key matches what PHP expects
  
      try {
        const response = await axios.post('https://sraws.mrcitsoft.com/upload.php', formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
  
       
  
        if (response.data && response.data.length > 0) {
          response.data.forEach(item => {
            if (item.url) {
              mediaUrls.push(item.url);
            } else if (item.error) {
              console.error("Upload error:", item.error);
            }
          });
        }
      } catch (error) {
        console.error("Error uploading media:", error);
      }
    }
    setUploadComplete(true);
    return mediaUrls;
  };
  

  // Fetch user's geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Callback on successful geolocation
  const showPosition = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      // Fetch location data based on lat and lon
      const locationInfo = await fetchLocation(lat, lon);

      // Update form data with fetched location details
      setFormData((prevData) => ({
        ...prevData,
        country: locationInfo.country,
        state: locationInfo.state,
        city: locationInfo.city,
      }));
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Callback on geolocation error
  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.error("An unknown error occurred.");
        break;
      default:
        console.error("An unknown error occurred.");
        break;
    }
  };

  // Mock API function to fetch location data
  const fetchLocation = async (lat, lon) => {
    // Mock API endpoint to fetch location data based on lat and lon
    const response = await fetch(`http://localhost:4000/geolocation?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data.');
    }
    return await response.json();
  };

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 2 }}>
        {user && (
          <HorizontalStack spacing={2}>
            <UserAvatar width={50} height={50} username={user.username} />
            <Typography variant="h5">
              What would you like to report today, {user.username}?
            </Typography>
          </HorizontalStack>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            required
            name="title"
            margin="normal"
            onChange={handleChange}
            value={formData.title}
            error={Boolean(errors.title)}
            helperText={errors.title}
          />
          <TextField
            fullWidth
            label="Report Description"
            multiline
            rows={10}
            name="content"
            margin="normal"
            onChange={handleChange}
            value={formData.content}
            error={Boolean(errors.content)}
            helperText={errors.content}
            required
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
           Enter Report Incident Area:
          </Typography>
          <TextField
            fullWidth
            label="Country"
            required
            name="country"
            margin="normal"
            onChange={handleChange}
            value={formData.country}
            error={Boolean(errors.country)}
            helperText={errors.country}
          />
          <TextField
            fullWidth
            label="State"
            
            name="state"
            margin="normal"
            onChange={handleChange}
            value={formData.state}
            error={Boolean(errors.state)}
            helperText={errors.state}
          />
          <TextField
            fullWidth
            label="City"
            
            name="city"
            margin="normal"
            onChange={handleChange}
            value={formData.city}
            error={Boolean(errors.city)}
            helperText={errors.city}
          />
          <TextField
            fullWidth
            label="Area"
            name="area"
            margin="normal"
            onChange={handleChange}
            value={formData.area}
            error={Boolean(errors.area)}
            helperText={errors.area}
          />

        {formData.mediaError && (
            <Typography variant="body2" color="error" gutterBottom>
              {formData.mediaError}
            </Typography>
          )}
          {formData.mediaPreviews.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
  <Stack direction="row" spacing={2}>
   {formData.mediaPreviews.length > 0 && (
  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
 {formData.mediaPreviews.length > 0 && (
  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {formData.mediaPreviews.map((media, index) => (
      <Box key={index} sx={{ position: 'relative', maxWidth: '100%', maxHeight: '300px', mb: 2 }}>
        {media.type === 'image' && (
          <img
            src={media.previewUrl}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        )}
        {media.type === 'video' && (
          <video controls style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}>
            <source src={media.previewUrl} />
            Your browser does not support the video tag.
          </video>
        )}
        {media.type === 'audio' && (
          <audio controls style={{ width: '100%', borderRadius: '8px' }}>
            <source src={media.previewUrl} />
            Your browser does not support the audio tag.
          </audio>
        )}
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
          onClick={() => handleRemoveMedia(index)}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    ))}
  </Box>
)}

  </Box>
)}

  </Stack>
</Box>

          )}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Upload the Evidence
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<InsertPhotoIcon />}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Add Media
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              multiple
              hidden
              onChange={handleMediaChange}
            />
          </Button>

          {loading && (
  <Box sx={{ width: '100%', mt: 2, position: 'relative' }}>
    <LinearProgress
      variant="determinate"
      value={uploadProgress}
      sx={{
        height: '8px',
        borderRadius: '4px',
        backgroundColor: '#f5f5f5',
        '& .MuiLinearProgress-bar': {
          borderRadius: '4px',
          backgroundColor: '#3f51b5',
        },
      }}
    />
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontWeight: 'bold',
      }}
    >
      {`${uploadProgress}%`}
    </Typography>
    {uploadComplete && (
      <Typography
        variant="body2"
        color="success.main"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 'bold',
          mt: 2,
        }}
      >
        Upload complete!
      </Typography>
    )}
  </Box>
)}


          {serverError && <ErrorAlert message={serverError} />}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            Post
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default PostEditor;
