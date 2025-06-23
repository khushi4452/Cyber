// routes/device.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { getOSInfo, checkAntivirus } = require('../utils/systemCheck');
const { createSecureFolder, folderPath } = require('../utils/folderControl');

// ✅ Device check route
router.post('/check', (req, res) => {
  const osInfo = getOSInfo();

  checkAntivirus((status) => {
    const { isAntivirusRunning, productName } = status;

    if (!isAntivirusRunning) {
      return res.status(403).json({
        success: false,
        reason: 'No active antivirus found. Please enable an antivirus product.',
      });
    }

    createSecureFolder((err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to create secure folder' });
      }

      res.json({
        success: true,
        message: 'Device check passed. Secure folder created.',
        osInfo,
        antivirus: `Running (${productName})`,
        folder: folderPath,
      });
    });
  });
});

// 🔥 Wipe route
router.post('/perform-wipe', (req, res) => {
  const secureFolder = 'C:/CyberSecure_Workspace';
  console.log(`Received wipe request for ${secureFolder}`); // 🔍 Debug log

  fs.readdir(secureFolder, (err, files) => {
    if (err) {
      console.error('Error reading secure folder:', err); // 🔍 Debug
      return res.status(500).json({ success: false, error: 'Could not read secure folder' });
    }

    files.forEach((file) => {
      const filePath = path.join(secureFolder, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`); // 🔍 Debug log
      } catch (e) {
        console.error(`Error deleting file ${file}:`, e); // 🔍 Debug log
      }
    });

    return res.status(200).json({ success: true, message: 'Wipe complete' });
  });
});

module.exports = router;
