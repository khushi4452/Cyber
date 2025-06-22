// routes/device.js
const express = require('express');
const router = express.Router();

const { getOSInfo, checkAntivirus } = require('../utils/systemCheck');
const { createSecureFolder, folderPath } = require('../utils/folderControl');

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

module.exports = router;
