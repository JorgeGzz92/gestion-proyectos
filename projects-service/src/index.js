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
  res.json({ status: 'ok', service: 'projects-service' });
});

app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`projects-service corriendo en http://localhost:${PORT}`);
});