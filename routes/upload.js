const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

router.post('/upload', verifyToken, upload.single('media'), async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const data = await s3.upload(params).promise();

    res.json({ mediaUrl: data.Location });
  } catch (err) {
    console.error('Error uploading media:', err);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

module.exports = router;
