require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const compression = require('compression');

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());


connectDB();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'users-service' });
});

app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`users-service corriendo en http://localhost:${PORT}`);
});