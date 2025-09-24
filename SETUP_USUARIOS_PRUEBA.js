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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['externo'], default: 'externo' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  telefono: String,
  isActive: { type: Boolean, default: true },
  fechaRegistro: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Usuarios de prueba
const usuariosPrueba = [
  {
    username: 'externo',
    email: 'externo@luckas.com',
    password: 'externo123',
    role: 'externo',
    firstName: 'María',
    lastName: 'Externa',
    telefono: '555666777'
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
