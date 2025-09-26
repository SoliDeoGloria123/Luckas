// Script para crear un usuario admin manualmente en la colección 'users'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/LuckasEnt';

const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  telefono: String,
  tipoDocumento: { type: String, default: 'Cédula de ciudadanía' },
  numeroDocumento: String,
  fechaNacimiento: Date,
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'tesorero', 'seminarista', 'externo'], default: 'externo' },
  estado: { type: String, default: 'activo' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('users', userSchema);

async function crearAdmin() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const correo = 'admin@seminario.edu.co';
  const passwordPlano = 'admin123';
  const password = await bcrypt.hash(passwordPlano, 10);
  const admin = new User({
    nombre: 'Admin',
    apellido: 'Sistema',
    correo,
    telefono: '123456789',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '10000001',
    fechaNacimiento: new Date('1980-01-01'),
    password,
    role: 'admin',
    estado: 'activo',
    username: 'admin'
  });
  await User.deleteOne({ correo }); // Elimina si ya existe
  await admin.save();
  console.log('✅ Usuario admin creado:', correo);
  mongoose.connection.close();
}

crearAdmin();
