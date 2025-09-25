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
    validate: {
      validator: function(value) {
        // Validación basada en el tipo de documento
        switch (this.tipoDocumento) {
          case 'Cédula de ciudadanía':
          case 'Cédula de extranjería':
            // Para cédulas: solo números, mínimo 8 dígitos, máximo 10
            return /^[0-9]{8,10}$/.test(value);
          case 'Pasaporte':
            // Para pasaporte: alfanumérico, mínimo 6 caracteres, máximo 15
            return /^[A-Za-z0-9]{6,15}$/.test(value);
          case 'Tarjeta de identidad':
            // Para tarjeta de identidad: solo números, mínimo 10 dígitos, máximo 15
            return /^[0-9]{10,15}$/.test(value);
          default:
            return false;
        }
      },
      message: function(props) {
        switch (this.tipoDocumento) {
          case 'Cédula de ciudadanía':
          case 'Cédula de extranjería':
            return 'La cédula debe contener solo números y tener entre 8 y 10 dígitos';
          case 'Pasaporte':
            return 'El pasaporte debe ser alfanumérico y tener entre 6 y 15 caracteres';
          case 'Tarjeta de identidad':
            return 'La tarjeta de identidad debe contener solo números y tener entre 10 y 15 dígitos';
          default:
            return 'Número de documento inválido';
        }
      }
    }
  },
  fechaNacimiento: {
    type: Date,
    required: true
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
  resetPasswordCode: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
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
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('usuarios', userSchema);