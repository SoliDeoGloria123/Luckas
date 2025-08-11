const mongoose = require('mongoose');

const cabanaSchema = new mongoose.Schema({
  nombre: {
    type: String, 
    required: true, 
    unique: true 
  },
  descripcion:{ 
    type: String 

  },
  capacidad: {
     type: Number, 
     required: true 
    },
  categoria: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Categorizacion', // Relación correcta
    required: true
  },
  precio:{
    type: Number, 
    required: true, 
    min: 0
  },
  ubicacion: {
     type: String,
      trim: true 
    },
  estado: { type: String, 
    enum: ['disponible', 'ocupada', 'mantenimiento'], 
    default: 'disponible' 
  },
  creadoPor: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'usuarios' 
    },
  imagen: {
    type: [String], // URL de imagen o nombre del archivo
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Cabana', cabanaSchema);