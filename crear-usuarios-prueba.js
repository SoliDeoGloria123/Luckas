// Script para crear usuarios de prueba en MongoDB
// Ejecutar con: node crear-usuarios-prueba.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');

// Configuración de conexión
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/LuckasEnt';

// Conectar a MongoDB
async function conectarMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Usuarios de prueba con la estructura correcta
const usuariosPrueba = [
  {
    nombre: 'Administrador',
    apellido: 'Sistema',
    correo: 'admin@luckas.com',
    telefono: '1234567890',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '12345678',
    password: 'admin123',
    role: 'admin',
    estado: 'activo'
  },
  {
    nombre: 'María',
    apellido: 'Tesorera',
    correo: 'tesorero@luckas.com',
    telefono: '0987654321',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '87654321',
    password: 'tesorero123',
    role: 'tesorero',
    estado: 'activo'
  },
  {
    nombre: 'Juan',
    apellido: 'Seminarista',
    correo: 'seminarista@luckas.com',
    telefono: '1122334455',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '11223344',
    password: 'seminarista123',
    role: 'seminarista',
    estado: 'activo'
  },
  {
    nombre: 'Ana',
    apellido: 'Externa',
    correo: 'externo@luckas.com',
    telefono: '5566778899',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '55667788',
    password: 'externo123',
    role: 'externo',
    estado: 'activo'
  }
];

// Función para crear usuarios
async function crearUsuarios() {
  try {
    console.log('🔄 Eliminando usuarios existentes...');
    await User.deleteMany({});
    
    console.log('👥 Creando usuarios de prueba...');
    
    for (const datosUsuario of usuariosPrueba) {
      try {
        const usuario = new User(datosUsuario);
        await usuario.save();
        console.log(`✅ Usuario creado: ${datosUsuario.correo} (${datosUsuario.role})`);
      } catch (error) {
        console.error(`❌ Error creando usuario ${datosUsuario.correo}:`, error.message);
      }
    }
    
    console.log('\n🎉 ¡Usuarios de prueba creados exitosamente!');
    console.log('\n📝 CREDENCIALES DE ACCESO:');
    console.log('============================');
    
    usuariosPrueba.forEach(user => {
      console.log(`
🔐 ${user.role.toUpperCase()}:
   Email: ${user.correo}
   Password: ${user.password}
   Nombre: ${user.nombre} ${user.apellido}`);
    });
    
    console.log('\n🚀 Para acceder al sistema:');
    console.log('1. Asegúrate de que el backend esté corriendo en puerto 3000');
    console.log('2. Asegúrate de que el frontend esté corriendo en puerto 3001');
    console.log('3. Ve a http://localhost:3001/login');
    console.log('4. Usa cualquiera de las credenciales de arriba');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar el script
async function main() {
  await conectarMongoDB();
  await crearUsuarios();
}

main().catch(console.error);
