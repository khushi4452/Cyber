const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ✅ Absolute upload directory (BYOD requirement)
const uploadDir = 'C:/CyberSecure_Workspace';

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer configuration to store files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/**
 * @route POST /api/uploads
 * @desc Upload a file to C:/CyberSecure_Workspace
 */
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  return res.json({
    success: true,
    message: 'File uploaded successfully',
    file: req.file.filename,
    path: req.file.path
  });
});

/**
 * @route GET /api/uploads
 * @desc List uploaded files from C:/CyberSecure_Workspace
 */
router.get('/', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to read upload directory' });
    }

    return res.json({ success: true, files });
  });
});

module.exports = router;
