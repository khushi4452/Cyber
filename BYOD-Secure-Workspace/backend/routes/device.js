// routes/device.js
const express = require('express');
const router = express.Router();

const { getOSInfo, checkAntivirus } = require('../utils/systemCheck');
const { createSecureFolder, folderPath } = require('../utils/folderControl');

router.post('/check', (req, res) => {
  const osInfo = getOSInfo();

  checkAntivirus((isAntivirusRunning) => {
    if (!isAntivirusRunning) {
      return res.status(403).json({
        success: false,
        reason: 'Antivirus not running. Please enable Windows Defender.',
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
        antivirus: 'Running',
        folder: folderPath,
      });
    });
  });
});

module.exports = router;
