require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');

const app = express();
const httpServer = http.createServer(app); // envolvemos Express en un servidor HTTP normal

app.use(cors());
app.use(express.json());

connectDB();
initSocket(httpServer); // activamos Socket.io sobre ese mismo servidor

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => { // OJO: ahora es httpServer.listen, no app.listen
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});