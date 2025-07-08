const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['biblico', 'ministerial', 'liderazgo', 'evangelismo', 'pastoral', 'otros']
  },
  nivel: {
    type: String,
    required: true,
    enum: ['basico', 'intermedio', 'avanzado']
  },
  duracion: {
    horas: {
      type: Number,
      required: true
    },
    semanas: {
      type: Number,
      required: true
    }
  },
  modalidad: {
    type: String,
    required: true,
    enum: ['presencial', 'virtual', 'semipresencial']
  },
  instructor: {
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
  horario: {
    dias: [{
      type: String,
      enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    }],
    horaInicio: {
      type: String,
      required: true
    },
    horaFin: {
      type: String,
      required: true
    }
  },
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
    type: Number,
    required: true,
    min: 0
  },
  requisitos: [{
    type: String
  }],
  material: [{
    type: String
  }],
  estado: {
    type: String,
    default: 'activo',
    enum: ['activo', 'inactivo', 'finalizado', 'cancelado']
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
      enum: ['inscrito', 'aprobado', 'reprobado', 'retirado'],
      default: 'inscrito'
    },
    calificacion: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  certificacion: {
    disponible: {
      type: Boolean,
      default: true
    },
    requisitosAprobacion: {
      notaMinima: {
        type: Number,
        default: 70
      },
      asistenciaMinima: {
        type: Number,
        default: 80
      }
    }
  }
}, {
  timestamps: true
});

// Índices para mejorar consultas
cursoSchema.index({ categoria: 1, estado: 1 });
cursoSchema.index({ fechaInicio: 1 });
cursoSchema.index({ instructor: 1 });

// Método para verificar si hay cupos disponibles
cursoSchema.methods.tieneCuposDisponibles = function() {
  return this.cuposOcupados < this.cuposDisponibles;
};

// Método para inscribir un usuario
cursoSchema.methods.inscribirUsuario = function(usuarioId) {
  if (!this.tieneCuposDisponibles()) {
    throw new Error('No hay cupos disponibles');
  }
  
  // Verificar si el usuario ya está inscrito
  const yaInscrito = this.inscripciones.some(inscripcion => 
    inscripcion.usuario.toString() === usuarioId.toString()
  );
  
  if (yaInscrito) {
    throw new Error('El usuario ya está inscrito en este curso');
  }
  
  this.inscripciones.push({
    usuario: usuarioId,
    fechaInscripcion: new Date(),
    estado: 'inscrito'
  });
  
  this.cuposOcupados += 1;
  return this.save();
};

module.exports = mongoose.model('Curso', cursoSchema);
