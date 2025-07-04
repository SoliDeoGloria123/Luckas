// models/ProgramaAcademico.js
const mongoose = require('mongoose');

const programaAcademicoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: ['curso', 'tecnico', 'especializacion', 'diplomado'],
    default: 'curso'
  },
  modalidad: {
    type: String,
    required: [true, 'La modalidad es obligatoria'],
    enum: ['presencial', 'virtual', 'mixta'],
    default: 'presencial'
  },
  duracion: {
    type: String,
    required: [true, 'La duración es obligatoria'],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria']
  },
  fechaFin: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > this.fechaInicio;
      },
      message: 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
  },
  cupos: {
    type: Number,
    required: [true, 'El número de cupos es obligatorio'],
    min: [1, 'Debe haber al menos 1 cupo disponible']
  },
  cuposOcupados: {
    type: Number,
    default: 0,
    min: [0, 'Los cupos ocupados no pueden ser negativos']
  },
  profesor: {
    type: String,
    required: [true, 'El profesor es obligatorio'],
    trim: true
  },
  profesorBio: {
    type: String,
    trim: true
  },
  requisitos: [{
    type: String,
    trim: true
  }],
  pensum: [{
    modulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      trim: true
    },
    horas: {
      type: Number,
      min: 0
    }
  }],
  objetivos: [{
    type: String,
    trim: true
  }],
  metodologia: {
    type: String,
    trim: true
  },
  evaluacion: {
    type: String,
    trim: true
  },
  certificacion: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categorias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorizacion'
  }],
  // Información de inscripciones
  inscripciones: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fechaInscripcion: {
      type: Date,
      default: Date.now
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'pendiente'
    },
    metodoPago: {
      type: String,
      enum: ['total', 'cuotas'],
      default: 'total'
    },
    valorPagado: {
      type: Number,
      default: 0
    },
    nivelEducativo: {
      type: String,
      enum: ['bachiller', 'tecnico', 'tecnologo', 'universitario', 'especialista', 'magister', 'doctor']
    },
    experiencia: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
programaAcademicoSchema.index({ tipo: 1, modalidad: 1, activo: 1 });
programaAcademicoSchema.index({ fechaInicio: 1, activo: 1 });
programaAcademicoSchema.index({ precio: 1 });
programaAcademicoSchema.index({ titulo: 'text', descripcion: 'text' });

// Virtual para cupos disponibles
programaAcademicoSchema.virtual('cuposDisponibles').get(function() {
  return this.cupos - this.cuposOcupados;
});

// Virtual para determinar si está lleno
programaAcademicoSchema.virtual('estaLleno').get(function() {
  return this.cuposOcupados >= this.cupos;
});

// Virtual para calcular duración en meses
programaAcademicoSchema.virtual('duracionMeses').get(function() {
  const match = this.duracion.match(/(\d+)\s*(mes|año)/i);
  if (!match) return 0;
  
  const numero = parseInt(match[1]);
  const unidad = match[2].toLowerCase();
  
  return unidad.includes('año') ? numero * 12 : numero;
});

// Middleware para actualizar cupos ocupados
programaAcademicoSchema.pre('save', function(next) {
  if (this.inscripciones && this.inscripciones.length > 0) {
    this.cuposOcupados = this.inscripciones.filter(
      inscripcion => inscripcion.estado === 'confirmada'
    ).length;
  }
  next();
});

// Método para inscribir usuario
programaAcademicoSchema.methods.inscribirUsuario = function(usuarioId, datosInscripcion) {
  if (this.estaLleno) {
    throw new Error('No hay cupos disponibles');
  }
  
  // Verificar si el usuario ya está inscrito
  const yaInscrito = this.inscripciones.some(
    inscripcion => inscripcion.usuario.toString() === usuarioId.toString() && 
                   inscripcion.estado !== 'cancelada'
  );
  
  if (yaInscrito) {
    throw new Error('El usuario ya está inscrito en este programa');
  }
  
  this.inscripciones.push({
    usuario: usuarioId,
    ...datosInscripcion
  });
  
  return this.save();
};

// Método para cancelar inscripción
programaAcademicoSchema.methods.cancelarInscripcion = function(usuarioId) {
  const inscripcion = this.inscripciones.find(
    inscripcion => inscripcion.usuario.toString() === usuarioId.toString() &&
                   inscripcion.estado !== 'cancelada'
  );
  
  if (!inscripcion) {
    throw new Error('Inscripción no encontrada');
  }
  
  inscripcion.estado = 'cancelada';
  return this.save();
};

// Método estático para buscar programas
programaAcademicoSchema.statics.buscarProgramas = function(filtros = {}) {
  const query = { activo: true };
  
  if (filtros.tipo) {
    query.tipo = filtros.tipo;
  }
  
  if (filtros.modalidad) {
    query.modalidad = filtros.modalidad;
  }
  
  if (filtros.duracion) {
    // Implementar lógica de filtro por duración
    // esto se puede hacer en el frontend o aquí
  }
  
  if (filtros.fechaInicioDesde) {
    query.fechaInicio = { $gte: new Date(filtros.fechaInicioDesde) };
  }
  
  if (filtros.precioMax) {
    query.precio = { $lte: filtros.precioMax };
  }
  
  if (filtros.busqueda) {
    query.$text = { $search: filtros.busqueda };
  }
  
  return this.find(query)
    .populate('creadoPor', 'nombre apellido')
    .populate('categorias', 'nombre codigo')
    .sort({ destacado: -1, fechaInicio: 1 });
};

module.exports = mongoose.model('ProgramaAcademico', programaAcademicoSchema);
