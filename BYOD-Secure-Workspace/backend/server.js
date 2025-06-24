// 📂 backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const initFolderWatcher = require('./folderWatcher');
// ✅ Import suspiciousStatus object
const { suspiciousStatus } = require('./folderWatcher');

// ✅ Import routes
const deviceRoutes = require('./routes/device');
const adminRoutes = require('./routes/admin');
const logsRoutes = require('./routes/logs');
const uploadRoutes = require('./routes/upload');

//Nikhil Change
const uebaRoutes = require('./routes/ueba');

// ✅ Import suspiciousStatus object
//const { suspiciousStatus } = require('./folderWatcher');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ Mount routes
app.use('/api/device', deviceRoutes); // <- for device-specific routes
app.use('/api/admin', adminRoutes);   // <- for admin-specific routes
app.use('/api/logs', logsRoutes);     // <- for logs
app.use('/api/upload', uploadRoutes); // <- for file uploads

//Nikhil Change
app.use('/api/ueba-alerts', uebaRoutes);

// ✅ API to check device status
app.get('/api/device/status', (req, res) => {
  res.json(suspiciousStatus);
});

// ✅ Initialize folder watcher
initFolderWatcher(() => {
  const secureFolder = 'C:\\CyberSecure_Workspace';
  if (fs.existsSync(secureFolder)) {
    fs.rmSync(secureFolder, { recursive: true, force: true });
    console.log(`✅ Wiped ${secureFolder} due to suspicious file copy activity.`);
  }
});


// ✅ Server start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
