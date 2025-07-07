// models/Categorizacion.js
const mongoose = require('mongoose');

const categorizacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    unique: true
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Categorizacion', categorizacionSchema);