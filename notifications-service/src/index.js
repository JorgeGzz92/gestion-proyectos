require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { Redis } = require('ioredis');

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

// Historial de mensajes en memoria, agrupado por proyecto
// Nota: se pierde si el servidor se reinicia (no es persistente en base de datos)
const historialMensajes = {}; // { proyectoId: [mensajes] }

const pubClient = new Redis(process.env.REDIS_URL, {
  tls: {}, // Upstash requiere conexion TLS/SSL
  maxRetriesPerRequest: 3,
});
const subClient = pubClient.duplicate();

pubClient.on('connect', () => console.log('Redis (publisher) conectado correctamente'));
pubClient.on('error', (err) => console.error('Error en Redis (publisher):', err.message));
subClient.on('error', (err) => console.error('Error en Redis (subscriber):', err.message));

// Le decimos a Socket.io que use Redis como "adaptador" para distribuir eventos.

io.adapter(createAdapter(pubClient, subClient));

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // El cliente pide el historial reciente de un proyecto especifico
  socket.on('unirse-proyecto', (proyectoId) => {
    socket.join(proyectoId);
    const historial = historialMensajes[proyectoId] || [];
    socket.emit('historial-chat', historial);
  });

  // Evento de chat: alguien manda un mensaje, se guarda y se reenvia a todos
  socket.on('chat-message', (data) => {
    if (!historialMensajes[data.proyectoId]) {
      historialMensajes[data.proyectoId] = [];
    }
    historialMensajes[data.proyectoId].push(data);

    if (historialMensajes[data.proyectoId].length > 50) {
      historialMensajes[data.proyectoId].shift();
    }

    // io.emit ahora viaja a traves del adaptador de Redis (Pub/Sub) automaticamente,
    // sin que tengamos que cambiar la forma en que lo llamamos
    io.emit('chat-message', data);
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