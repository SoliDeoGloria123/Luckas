const mongoose = require('mongoose');

const cabanaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String },
  capacidad: { type: Number, required: true },
  categoria: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Categorizacion', // Relación correcta
    required: true
  },
  ubicacion: { type: String, trim: true },
  estado: { type: String, enum: ['disponible', 'ocupada', 'mantenimiento'], default: 'disponible' },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ubicacion: { type: String, trim: true },
  imagen: {
  type: String // URL de imagen o nombre del archivo
}
}, { timestamps: true });

module.exports = mongoose.model('Cabana', cabanaSchema);