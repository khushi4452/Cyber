const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// ✅ Import routes AFTER initializing app
const deviceRoutes = require('./routes/device');

const app = express(); // ✅ You were missing this line
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Now it's safe to use app.use
app.use('/api/device', deviceRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
