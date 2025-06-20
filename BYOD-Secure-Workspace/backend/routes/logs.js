const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const LOG_FILE_PATH = path.join(__dirname, '../../folder-monitor/folder_log.txt');

router.get('/', (req, res) => {
  fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error reading log file.' });
    }

    const logLines = data.trim().split('\n').map(line => line.trim()).reverse(); // latest first
    res.json({ success: true, logs: logLines });
  });
});

module.exports = router;
