const mongoose = require('mongoose');


const eventoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  imagen: {
    type: String // URL o nombre del archivo
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorizacion',
    required: true
  },
  etiquetas: [{
    type: String,
    trim: true
  }],
  fechaEvento: {
    type: Date,
    required: true
  },
  horaInicio: {
    type: String, // ejemplo: "09:00"
    required: true
  },
  horaFin: {
    type: String, // ejemplo: "17:00"
    required: true
  },
  lugar: {
    type: String,
    required: true
  },
  direccion: {
    type: String
  },
  duracionDias: {
    type: Number,
    default: 1
  },
  cuposTotales: {
    type: Number,
    required: true
  },
  cuposDisponibles: {
    type: Number,
    required: true
  },
  programa: [{
    horaInicio: String,
    horaFin: String,
    tema: String,
    descripcion: String
  }],
  prioridad: {
    type: String,
    enum: ['Alta', 'Normal', 'Baja'],
    default: 'Normal'
  },
  observaciones: {
    type: String
  },
  categorizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fechaCategorizacion: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Eventos', eventoSchema);