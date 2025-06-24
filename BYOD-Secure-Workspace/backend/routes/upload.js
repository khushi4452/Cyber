// 📁 backend/routes/upload.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // ✅ For encryption

const router = express.Router();

// ✅ Absolute upload directory (BYOD requirement)
const uploadDir = 'C:/CyberSecure_Workspace';

// ✅ Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Symmetric encryption config (use .env in production)
const ENCRYPTION_KEY = crypto.createHash('sha256').update('byod-secret-key').digest();
const IV_LENGTH = 16; // For AES, this is always 16

// ✅ Encrypt file buffer using AES-256-CBC
function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]); // prepend IV for decryption
}

// ✅ Decrypt buffer (used by frontend to view)
function decryptBuffer(buffer) {
  const iv = buffer.slice(0, IV_LENGTH);
  const encryptedText = buffer.slice(IV_LENGTH);
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  return Buffer.concat([decipher.update(encryptedText), decipher.final()]);
}

// ✅ Multer config for encrypted (memory storage)
const memoryStorage = multer.memoryStorage();
const uploadEncrypted = multer({ storage: memoryStorage });

// ✅ Multer config for raw (disk storage)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, file.originalname);
  }
});
const uploadRaw = multer({ storage: diskStorage });

/**
 * @route POST /api/uploads
 * @desc Encrypt and store uploaded file
 */
router.post('/', uploadEncrypted.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const encryptedBuffer = encryptBuffer(req.file.buffer);
  const encryptedName = Date.now() + '-' + req.file.originalname + '.enc';
  const filePath = path.join(uploadDir, encryptedName);

  fs.writeFile(filePath, encryptedBuffer, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to save encrypted file' });
    }

    return res.json({
      success: true,
      message: 'File encrypted and uploaded successfully',
      file: encryptedName,
      path: filePath
    });
  });
});

/**
 * @route GET /api/uploads
 * @desc List all encrypted files
 */
router.get('/', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to read upload directory' });
    }

    const fileList = files.map((filename) => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        originalname: filename.split('-').slice(1).join('-'),
        size: stats.size,
        uploadedAt: stats.birthtime
      };
    });

    return res.json({ success: true, files: fileList });
  });
});

/**
 * @route GET /api/uploads/:filename
 * @desc Decrypt and serve file content
 */
router.get('/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  const isDownload = req.query.download === 'true'; // ← we'll use this from frontend

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to read file' });
    }

    try {
      const decrypted = decryptBuffer(data);
       const content = decrypted.toString('utf8'); 

      // ✅ Scan for sensitive terms
  const sensitiveWords = ['confidential', 'salary', 'aadhaar', 'pan', 'secret'];
  const found = sensitiveWords.find((word) => content.toLowerCase().includes(word));

   if (found) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    sensitive: true,
    message: `❗ This file contains sensitive data ("${found}") and cannot be previewed or downloaded.`,
  });
}

   // ✅ Log the user activity (either viewed or downloaded)
             const logPath = path.join(__dirname, '../../folder-monitor/folder_log.csv');

          // Add CSV header if not exists
           if (!fs.existsSync(logPath)) {
              fs.writeFileSync(logPath, 'timestamp,action,filename\n');
               }

           const username = 'employee'; // hardcode or get from session if auth exists
           const logEntry = `${new Date().toISOString()},${username},${isDownload ? 'Downloaded' : 'Viewed'},${req.params.filename}\n`;
           fs.appendFile(logPath, logEntry, () => {});


      // ✅ Set response
        if (isDownload) {
            res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename.replace('.enc', '')}"`);
           return res.send(decrypted); // Send and exit
        } else {
             res.setHeader('Content-Type', 'text/plain');
             return res.send(decrypted); // For preview
          }

    } catch (e) {
      res.status(500).json({ success: false, message: 'Decryption failed' });
    }
  });
});

/**
 * @route DELETE /api/uploads/:filename
 * @desc Instantly delete file
 */
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'File delete failed', error: err.message });
    }

    res.json({ success: true, message: 'File deleted' });
  });
});

module.exports = router;