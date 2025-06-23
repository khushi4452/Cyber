// employee-app/backend/routes/files.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ✅ Absolute path to your secure drive:
const secureDrivePath = path.resolve('C:\\CyberSecure_Workspace');

// ✅ Debug log to verify path
console.log('✅ Secure Drive Path:', secureDrivePath);

// ⬇️ INSERT existence check right here:
if (!fs.existsSync(secureDrivePath)) {
  console.error('❌ Secure drive path does not exist:', secureDrivePath);
} else {
  console.log('✅ Secure drive path exists:', secureDrivePath);
}

// ✅ Modified route handler with existence check:
router.get('/', (req, res) => {
  if (!fs.existsSync(secureDrivePath)) {
    return res.status(500).json({ error: "Secure Drive path doesn't exist" });
  }

  fs.readdir(secureDrivePath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err.message);
      return res.status(500).json({ error: "Cannot read Secure Drive folder" });
    }
    res.json({ files });
  });
});

module.exports = router;
