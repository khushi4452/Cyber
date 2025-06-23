// 📂 backend/routes/admin.js
const express = require('express');
const router = express.Router();

let wipeRequested = false; // For demo; ideally store in DB

// POST to request a wipe
router.post('/wipe-request', (req, res) => {
  wipeRequested = true;
  return res.status(200).json({ success: true, message: 'Wipe requested' });
});

// GET to check status
router.get('/wipe-status', (req, res) => {
  return res.status(200).json({ wipeRequested });
});

// RESET after completion
router.post('/wipe-reset', (req, res) => {
  wipeRequested = false;
  return res.status(200).json({ success: true, message: 'Wipe status reset' });
});

module.exports = router;
