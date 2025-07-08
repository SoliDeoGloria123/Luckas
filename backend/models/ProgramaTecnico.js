const mongoose = require('mongoose');

const programaTecnicoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true,
    enum: ['tecnologia', 'administracion', 'oficios', 'arte_diseno', 'salud', 'otros']
  },
  nivel: {
    type: String,
    required: true,
    enum: ['tecnico_laboral', 'tecnico_profesional', 'especializacion_tecnica']
  },
  duracion: {
    meses: {
      type: Number,
      required: true
    },
    horas: {
      type: Number,
      required: true
    }
  },
  modalidad: {
    type: String,
    required: true,
    enum: ['presencial', 'virtual', 'semipresencial']
  },
  coordinador: {
    type: String,
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  horarios: [{
    dia: {
      type: String,
      enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    },
    horaInicio: String,
    horaFin: String
  }],
  cuposDisponibles: {
    type: Number,
    required: true,
    min: 1
  },
  cuposOcupados: {
    type: Number,
    default: 0
  },
  costo: {
    matricula: {
      type: Number,
      required: true,
      min: 0
    },
    mensualidad: {
      type: Number,
      required: true,
      min: 0
    },
    certificacion: {
      type: Number,
      default: 0
    }
  },
  requisitos: {
    academicos: [{
      type: String
    }],
    documentos: [{
      type: String
    }],
    otros: [{
      type: String
    }]
  },
  competencias: [{
    nombre: String,
    descripcion: String
  }],
  modulos: [{
    nombre: String,
    descripcion: String,
    duracionHoras: Number,
    orden: Number
  }],
  estado: {
    type: String,
    default: 'activo',
    enum: ['activo', 'inactivo', 'en_proceso', 'finalizado', 'cancelado']
  },
  inscripciones: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usuarios'
    },
    fechaInscripcion: {
      type: Date,
      default: Date.now
    },
    estado: {
      type: String,
      enum: ['inscrito', 'matriculado', 'en_curso', 'graduado', 'retirado', 'suspendido'],
      default: 'inscrito'
    },
    pagos: [{
      concepto: {
        type: String,
        enum: ['matricula', 'mensualidad', 'certificacion']
      },
      monto: Number,
      fechaPago: Date,
      metodoPago: String,
      comprobante: String
    }],
    calificaciones: [{
      modulo: String,
      nota: Number,
      fecha: Date
    }],
    progreso: {
      modulosCompletados: Number,
      horasAcumuladas: Number,
      porcentajeAvance: Number
    }
  }],
  certificacion: {
    disponible: {
      type: Boolean,
      default: true
    },
    entidadCertificadora: String,
    requisitosGraduacion: {
      notaMinima: {
        type: Number,
        default: 70
      },
      asistenciaMinima: {
        type: Number,
        default: 85
      },
      proyectoFinal: {
        type: Boolean,
        default: false
      }
    }
  },
  recursos: {
    laboratorios: [{
      nombre: String,
      capacidad: Number,
      equipos: [String]
    }],
    bibliotecaDigital: [{
      titulo: String,
      tipo: String,
      url: String
    }],
    software: [String]
  }
}, {
  timestamps: true
});

// Índices para mejorar consultas
programaTecnicoSchema.index({ area: 1, estado: 1 });
programaTecnicoSchema.index({ fechaInicio: 1 });
programaTecnicoSchema.index({ coordinador: 1 });
programaTecnicoSchema.index({ nivel: 1 });

// Método para verificar si hay cupos disponibles
programaTecnicoSchema.methods.tieneCuposDisponibles = function() {
  return this.cuposOcupados < this.cuposDisponibles;
};

// Método para inscribir un usuario
programaTecnicoSchema.methods.inscribirUsuario = function(usuarioId) {
  if (!this.tieneCuposDisponibles()) {
    throw new Error('No hay cupos disponibles');
  }
  
  // Verificar si el usuario ya está inscrito
  const yaInscrito = this.inscripciones.some(inscripcion => 
    inscripcion.usuario.toString() === usuarioId.toString()
  );
  
  if (yaInscrito) {
    throw new Error('El usuario ya está inscrito en este programa técnico');
  }
  
  this.inscripciones.push({
    usuario: usuarioId,
    fechaInscripcion: new Date(),
    estado: 'inscrito',
    progreso: {
      modulosCompletados: 0,
      horasAcumuladas: 0,
      porcentajeAvance: 0
    }
  });
  
  this.cuposOcupados += 1;
  return this.save();
};

// Método para calcular progreso de un estudiante
programaTecnicoSchema.methods.calcularProgreso = function(usuarioId) {
  const inscripcion = this.inscripciones.find(
    ins => ins.usuario.toString() === usuarioId.toString()
  );
  
  if (!inscripcion) {
    throw new Error('Usuario no inscrito en este programa');
  }
  
  const totalModulos = this.modulos.length;
  const modulosCompletados = inscripcion.progreso.modulosCompletados;
  const porcentajeAvance = totalModulos > 0 ? (modulosCompletados / totalModulos) * 100 : 0;
  
  inscripcion.progreso.porcentajeAvance = porcentajeAvance;
  return porcentajeAvance;
};

module.exports = mongoose.model('ProgramaTecnico', programaTecnicoSchema);
