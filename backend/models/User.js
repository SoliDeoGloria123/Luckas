const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true, 
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[0-9]{7,15}$/  // solo dígitos, mínimo 7 y máximo 15 caracteres
  },
  tipoDocumento: {
    type: String,
    enum: ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Tarjeta de identidad'],
    required: true
   },
   numeroDocumento: {
    type: String,
    required: true,
    unique: true,
    trim: true,
   },
  password: {
    type: String,
    required: true,
    select: false // No devolver el password en las consultas
  },
  role: {
    type: String,
     enum: ['admin', 'tesorero', 'seminarista', 'externo'],
    default: 'externo'
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  // Campos para recuperación de contraseña
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('usuarios', userSchema);