const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  solicitante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios',
    required: true
  },
  correo: {
    type: String,
    required: [true,'el email es obligatorio'],
    lowercase: true,
    trim : true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  tipoSolicitud: {
    type: String,
    enum: ['Inscripción', 'Hospedaje', 'Alimentación','Otra'],
    required: true
  },
  modeloReferencia: {
    type: String,
    enum: ['Eventos', 'Cabana', 'Inscripcion', 'Reserva', 'Curso', 'ProgramaTecnico', 'Comedor'],
    required: function () {
      return this.tipoSolicitud === 'Inscripción' || this.tipoSolicitud === 'Hospedaje';
    }
  },
  referencia: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'modeloReferencia'
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorizacion',
    required: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  estado: {
    type: String,
    enum: ['Nueva', 'En Revisión', 'Aprobada', 'Rechazada', 'Completada', 'Pendiente Info'],
    default: 'Nueva'
  },
  prioridad: {
    type: String,
    enum: ['Alta', 'Media', 'Baja'],
    default: 'Media'
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  fechaRespuesta: {
    type: Date
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios',
    required: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios'
  },
  modificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios'
  },
  origen: {
    type: String,
    enum: ['formulario', 'reserva', 'inscripcion'],
    default: 'formulario'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Solicitud', solicitudSchema);