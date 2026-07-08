const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  asignadoA: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);