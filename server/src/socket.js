const { Server } = require('socket.io');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // en un proyecto real limitarias esto a tu dominio del frontend
    },
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado por socket:', socket.id);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io no ha sido inicializado');
  return io;
}

module.exports = { initSocket, getIO };