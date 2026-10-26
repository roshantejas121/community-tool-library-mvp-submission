require('dotenv').config();
const express = require('express');
const cors = require('cors');
const toolRoutes = require('./routes/tools');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Main tools route
app.use('/api', toolRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
