// ✅ server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// ✅ Import routes AFTER app initialization
const deviceRoutes = require('./routes/device');
const logsRoutes = require('./routes/logs');
const uploadRoutes = require('./routes/upload');

// ✅ NEW: Import the files router
const filesRouter = require('./routes/files'); 

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // to parse application/json

// ✅ Existing routes
app.use('/api/device', deviceRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ NEW: Mount the files router
app.use('/api/files', filesRouter); 

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
