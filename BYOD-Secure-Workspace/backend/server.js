const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const deviceRoutes = require('./routes/device');
const logsRoutes = require('./routes/logs'); // ✅ NEW

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/device', deviceRoutes);
app.use('/api/logs', logsRoutes); // ✅ NEW

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
