require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: { origin: '*' },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'notifications-service' });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Evento de chat: alguien manda un mensaje, se lo reenviamos a todos
  socket.on('chat-message', (data) => {
    io.emit('chat-message', data); // reenvia el mensaje a todos los conectados
  });

  // Evento generico de notificacion (ej. tarea creada, proyecto actualizado)
  socket.on('notify', (data) => {
    io.emit('notify', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 5003;
httpServer.listen(PORT, () => {
  console.log(`notifications-service corriendo en http://localhost:${PORT}`);
});