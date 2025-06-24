// routes/admin.js
const express = require('express');
const router = express.Router();

let wipeRequested = false;

router.post('/wipe-request', (req, res) => {
  wipeRequested = true;
  console.log('📢 Wipe request triggered by admin');
  return res.status(200).json({ success: true, message: 'Wipe requested' });
});

router.get('/wipe-status', (req, res) => {
  return res.status(200).json({ wipeRequested });
});

router.post('/wipe-reset', (req, res) => {
  wipeRequested = false;
  return res.status(200).json({ success: true, message: 'Wipe status reset' });
});

module.exports = router;