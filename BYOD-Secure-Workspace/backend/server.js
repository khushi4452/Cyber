const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// ✅ Import routes AFTER initializing app
const deviceRoutes = require('./routes/device');

const logsRoutes = require('./routes/logs');
const uploadRoutes = require('./routes/upload'); // ✅ Add this line


const app = express(); // ✅ You were missing this line
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // to parse application/json

// ✅ Now it's safe to use app.use
app.use('/api/device', deviceRoutes);
// Routes
app.use('/api/device', deviceRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/upload', uploadRoutes); // ✅ Mount upload route

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
