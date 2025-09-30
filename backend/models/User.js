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
        console.log('Validando numeroDocumento:', value, 'con tipoDocumento:', this.tipoDocumento);
        // Validación basada en el tipo de documento
        switch (this.tipoDocumento) {
          case 'Cédula de ciudadanía':
          case 'Cédula de extranjería':
            // Para cédulas: solo números, mínimo 7 dígitos, máximo 12
            return /^[0-9]{7,12}$/.test(value);
          case 'Pasaporte':
            // Para pasaporte: alfanumérico, mínimo 6 caracteres, máximo 15
            return /^[A-Za-z0-9]{6,15}$/.test(value);
          case 'Tarjeta de identidad':
            // Para tarjeta de identidad: solo números, mínimo 8 dígitos, máximo 15
            return /^[0-9]{8,15}$/.test(value);
          default:
            // Por defecto, permitir números y letras de 6 a 15 caracteres
            return /^[A-Za-z0-9]{6,15}$/.test(value);
        }
      },
      message: function(props) {
        console.log('Error de validación en numeroDocumento:', props.value, 'tipoDocumento:', this.tipoDocumento);
        switch (this.tipoDocumento) {
          case 'Cédula de Ciudadanía':
          case 'Cédula de Extranjería':
            return 'La cédula debe contener solo números y tener entre 7 y 12 dígitos';
          case 'Pasaporte':
            return 'El pasaporte debe ser alfanumérico y tener entre 6 y 15 caracteres';
          case 'Tarjeta de identidad':
            return 'La tarjeta de identidad debe contener solo números y tener entre 8 y 15 dígitos';
          default:
            return 'El número de documento debe ser alfanumérico y tener entre 6 y 15 caracteres';
        }
      }
    }
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  direccion: {
    type: String,
    trim: true
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
  
  // Campos específicos para seminaristas
  nivelAcademico: {
    type: String,
    trim: true
  },
  fechaIngreso: {
    type: Date
  },
  directorEspiritual: {
    type: String,
    trim: true
  },
  idiomas: {
    type: String,
    trim: true
  },
  especialidad: {
    type: String,
    trim: true
  },
  
  // Cursos relacionados con el usuario
  cursos: [{
    cursoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso'
    },
    nombreCurso: {
      type: String,
      trim: true
    },
    fechaInscripcion: {
      type: Date,
      default: Date.now
    },
    estado: {
      type: String,
      enum: ['inscrito', 'en_progreso', 'completado', 'abandonado'],
      default: 'inscrito'
    },
    calificacion: {
      type: Number,
      min: 0,
      max: 5
    },
    fechaCompletado: {
      type: Date
    }
  }],
  
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

module.exports = mongoose.model('User', userSchema);