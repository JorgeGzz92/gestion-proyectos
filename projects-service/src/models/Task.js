const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  asignadoA: { type: mongoose.Schema.Types.ObjectId } // ya no usa "ref: User" porque User vive en otro servicio/otra BD
}, { timestamps: true });

taskSchema.index({ proyecto: 1, estado: 1 });

module.exports = mongoose.model('Task', taskSchema);