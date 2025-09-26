// Script para crear usuarios de prueba en la colección 'usuarios' con el formato correcto
// Ejecutar con: node crear-usuarios-prueba.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/LuckasEnt';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(error => console.error('❌ Error conectando a MongoDB:', error));

const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: { type: String, required: true, unique: true },
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

const User = mongoose.model('usuarios', userSchema);

const usuariosPrueba = [
  {
    nombre: 'Administrador',
    apellido: 'Sistema',
    correo: 'admin@luckas.com',
    telefono: '123456789',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '10000001',
    fechaNacimiento: new Date('1980-01-01'),
    password: 'admin123',
    role: 'admin'
  },
  {
    nombre: 'Juan',
    apellido: 'Seminarista',
    correo: 'seminarista@luckas.com',
    telefono: '987654321',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '10000002',
    fechaNacimiento: new Date('1995-07-25'),
    password: 'seminarista123',
    role: 'seminarista'
  },
  {
    nombre: 'María',
    apellido: 'Externa',
    correo: 'externo@luckas.com',
    telefono: '555666777',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '10000003',
    fechaNacimiento: new Date('1992-03-10'),
    password: 'externo123',
    role: 'externo'
  },
  {
    nombre: 'Carlos',
    apellido: 'Tesorero',
    correo: 'tesorero@luckas.com',
    telefono: '111222333',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '10000004',
    fechaNacimiento: new Date('1988-11-10'),
    password: 'tesorero123',
    role: 'tesorero'
  }
];

async function crearUsuarios() {
  try {
    console.log('🚀 Iniciando creación de usuarios de prueba en la colección usuarios...');
    await User.deleteMany({});
    console.log('🗑️  Usuarios existentes eliminados');

    for (const userData of usuariosPrueba) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      console.log(`✅ Usuario creado: ${user.correo} (${user.role})`);
    }

    console.log('\n🎉 Proceso completado!');
    console.log('\n📋 CREDENCIALES DE PRUEBA:');
    console.log('========================');
    usuariosPrueba.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase()}`);
      console.log(`   Email: ${user.correo}`);
      console.log(`   Contraseña: ${user.password}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    mongoose.connection.close();
  }
}

crearUsuarios();
