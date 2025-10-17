const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del reporte es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de reporte es obligatorio'],
    enum: [  'usuarios','programas', 'eventos', 'reservas', 'inscripciones', 'solicitudes', 'tareas', 'cabañas'],
    trim: true
  },
  // Filtros aplicados al generar el reporte
  filtros: {
    fechaInicio: {
      type: Date,
      default: null
    },
    fechaFin: {
      type: Date,
      default: null
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo', 'pendiente', 'finalizado', 'cancelado', ''],
      default: ''
    },
    categoria: {
      type: String,
      default: ''
    },
    usuario: {
      type: String,
      default: ''
    },
    // Filtros adicionales como objeto para flexibilidad
    otros: {
      type: Object,
      default: {}
    }
  },
  // Datos generados del reporte
  datos: {
    type: Object,
    required: [true, 'Los datos del reporte son obligatorios'],
    default: {}
  },  // Información de creación
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios',
    required: false
  },
  fechaGeneracion: {
    type: Date,
    default: Date.now
  },
  // Estado del reporte
  estado: {
    type: String,
    enum: ['generado', 'procesando', 'error', 'archivado'],
    default: 'generado'
  },
  // Metadatos útiles
  metadatos: {
    tiempoGeneracion: {
      type: Number, // en milisegundos
      default: 0
    },
    version: {
      type: String,
      default: '1.0'
    },
    formatoExportacion: {
      type: [String],
      enum: ['pdf', 'excel', 'csv', 'json'],
      default: ['json']
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para mejorar performance
reporteSchema.index({ tipo: 1, 'filtros.fechaInicio': 1, 'filtros.fechaFin': 1 });
reporteSchema.index({ creadoPor: 1, fechaGeneracion: -1 });
reporteSchema.index({ estado: 1 });

// Métodos virtuales
reporteSchema.virtual('rangoFechas').get(function() {
  if (this.filtros.fechaInicio && this.filtros.fechaFin) {
    const inicio = new Date(this.filtros.fechaInicio).toLocaleDateString('es-ES');
    const fin = new Date(this.filtros.fechaFin).toLocaleDateString('es-ES');
    return `${inicio} - ${fin}`;
  }
  return 'Sin filtro de fechas';
});

reporteSchema.virtual('resumenFiltros').get(function() {
  const filtros = [];
  if (this.filtros.fechaInicio || this.filtros.fechaFin) {
    filtros.push(`Fechas: ${this.rangoFechas}`);
  }
  if (this.filtros.estado) {
    filtros.push(`Estado: ${this.filtros.estado}`);
  }
  if (this.filtros.categoria) {
    filtros.push(`Categoría: ${this.filtros.categoria}`);
  }
  if (this.filtros.usuario) {
    filtros.push(`Usuario: ${this.filtros.usuario}`);
  }
  return filtros.length > 0 ? filtros.join(' | ') : 'Sin filtros aplicados';
});

// Middleware para validaciones personalizadas
reporteSchema.pre('save', function(next) {
  // Validar que fechaFin no sea menor a fechaInicio
  if (this.filtros.fechaInicio && this.filtros.fechaFin) {
    if (new Date(this.filtros.fechaFin) < new Date(this.filtros.fechaInicio)) {
      return next(new Error('La fecha fin no puede ser menor a la fecha inicio'));
    }
    // Validar que fechaFin no sea en el futuro (mes actual)
    const ahora = new Date();
    const fin = new Date(this.filtros.fechaFin);
    if (fin.getFullYear() > ahora.getFullYear() || (fin.getFullYear() === ahora.getFullYear() && fin.getMonth() > ahora.getMonth())) {
      return next(new Error('No se puede crear un reporte de meses futuros.'));
    }
  }

  // Asegurar que hay datos si el estado es 'generado'
  if (this.estado === 'generado' && (!this.datos || Object.keys(this.datos).length === 0)) {
    this.estado = 'error';
  }

  next();
});

// Manejo de errores
reporteSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Ya existe un reporte con ese nombre'));
  } else {
    next(error);
  }
});

// Métodos estáticos útiles
reporteSchema.statics.findByDateRange = function(fechaInicio, fechaFin) {
  return this.find({
    'filtros.fechaInicio': { $gte: fechaInicio },
    'filtros.fechaFin': { $lte: fechaFin }
  });
};

reporteSchema.statics.findByType = function(tipo) {
  return this.find({ tipo }).sort({ fechaGeneracion: -1 });
};

reporteSchema.statics.getRecentReports = function(limit = 10) {
  return this.find({ estado: 'generado' })
    .populate('creadoPor', 'username email')
    .sort({ fechaGeneracion: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Reporte', reporteSchema);