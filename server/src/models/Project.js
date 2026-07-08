const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: String, enum: ['activo', 'pausado', 'completado'], default: 'activo' },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);