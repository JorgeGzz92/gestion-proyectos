const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // fuerza a Node a usar DNS de Google

const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;