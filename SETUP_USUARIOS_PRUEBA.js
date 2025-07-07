// Script para crear usuarios de prueba en MongoDB
// Ejecutar con: node SETUP_USUARIOS_PRUEBA.js

// Cargar dependencias del backend
const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');

// Configuración directa
const MONGODB_URI = 'mongodb://localhost:27017/LuckasEnt';

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(error => console.error('❌ Error conectando a MongoDB:', error));

// Esquema de Usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seminarista', 'externo', 'tesorero'], default: 'externo' },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: String,
  isActive: { type: Boolean, default: true },
  fechaRegistro: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Usuarios de prueba
const usuariosPrueba = [
  {
    username: 'admin',
    correo: 'admin@luckas.com',
    password: 'admin123',
    role: 'admin',
    nombre: 'Administrador',
    apellido: 'Sistema',
    telefono: '123456789'
  },
  {
    username: 'seminarista',
    correo: 'seminarista@luckas.com',
    password: 'seminarista123',
    role: 'seminarista',
    nombre: 'Juan',
    apellido: 'Seminarista',
    telefono: '987654321'
  },
  {
    username: 'externo',
    correo: 'externo@luckas.com',
    password: 'externo123',
    role: 'externo',
    nombre: 'María',
    apellido: 'Externa',
    telefono: '555666777'
  },
  {
    username: 'tesorero',
    correo: 'tesorero@luckas.com',
    password: 'tesorero123',
    role: 'tesorero',
    nombre: 'Carlos',
    apellido: 'Tesorero',
    telefono: '111222333'
  }
];

async function crearUsuarios() {
  try {
    console.log('🚀 Iniciando creación de usuarios de prueba...');
    
    // Limpiar usuarios existentes (opcional)
    const respuesta = await new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('¿Deseas eliminar todos los usuarios existentes? (s/N): ', (answer) => {
        readline.close();
        resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'si');
      });
    });
    
    if (respuesta) {
      await User.deleteMany({});
      console.log('🗑️  Usuarios existentes eliminados');
    }
    
    // Crear nuevos usuarios
    for (const userData of usuariosPrueba) {
      try {
        const existeUsuario = await User.findOne({ 
          $or: [{ username: userData.username }, { email: userData.email }]
        });
        
        if (existeUsuario) {
          console.log(`⚠️  Usuario ${userData.username} ya existe, saltando...`);
          continue;
        }
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const nuevoUsuario = new User({
          ...userData,
          password: hashedPassword
        });
        
        await nuevoUsuario.save();
        console.log(`✅ Usuario creado: ${userData.username} (${userData.role})`);
        
      } catch (error) {
        console.error(`❌ Error creando usuario ${userData.username}:`, error.message);
      }
    }
    
    console.log('\n🎉 Proceso completado!');
    console.log('\n📋 CREDENCIALES DE PRUEBA:');
    console.log('========================');
    usuariosPrueba.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase()}`);
      console.log(`   Usuario: ${user.username}`);
      console.log(`   Email: ${user.email}`);
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
