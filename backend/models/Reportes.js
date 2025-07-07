const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del reporte es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de reporte es obligatorio'],
    trim: true
  },
  filtros: {
    type: Object,
    default: {}
  },
  datos: {
    type: Object,
    required: [true, 'Los datos del reporte son obligatorios']
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  fechaGeneracion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Manejo de errores de duplicado
reporteSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Ya existe un reporte con ese nombre'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Reporte', reporteSchema);