#!/usr/bin/env node

/**
 * Script de diagnóstico y corrección completa para LuckasEnt
 * Ejecutar: node diagnostico-completo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

console.log('🔧 DIAGNÓSTICO COMPLETO DEL SISTEMA LUCKAS\n');

// Colores para la consola
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

// Configuración
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/LuckasEnt';
const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:3001';

// 1. Verificar MongoDB
async function verificarMongoDB() {
  log.info('Verificando conexión a MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    log.success('MongoDB conectado correctamente');
    return true;
  } catch (error) {
    log.error(`MongoDB no disponible: ${error.message}`);
    log.warning('Solución: Asegúrate de que MongoDB esté corriendo');
    return false;
  }
}

// 2. Verificar Backend
async function verificarBackend() {
  log.info('Verificando Backend...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth/signin`, {
      timeout: 5000,
      validateStatus: () => true // Acepta cualquier status code
    });
    
    if (response.status === 405 || response.status === 400) {
      log.success('Backend respondiendo correctamente');
      return true;
    } else {
      log.warning(`Backend responde pero con status: ${response.status}`);
      return true;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log.error('Backend no está corriendo en puerto 3000');
      log.warning('Solución: cd backend && npm start');
    } else {
      log.error(`Error del backend: ${error.message}`);
    }
    return false;
  }
}

// 3. Verificar Frontend
async function verificarFrontend() {
  log.info('Verificando Frontend...');
  try {
    await axios.get(FRONTEND_URL, { timeout: 5000 });
    log.success('Frontend corriendo correctamente');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log.error('Frontend no está corriendo en puerto 3001');
      log.warning('Solución: cd frontend && npm start');
    } else {
      log.error(`Error del frontend: ${error.message}`);
    }
    return false;
  }
}

// 4. Crear usuarios de prueba
async function crearUsuariosPrueba() {
  log.info('Verificando usuarios de prueba...');
  
  try {
    const User = require('./backend/models/User');
    
    // Verificar si ya existen usuarios
    const usuariosExistentes = await User.countDocuments();
    
    if (usuariosExistentes > 0) {
      log.success(`Ya existen ${usuariosExistentes} usuarios en la base de datos`);
      return true;
    }
    
    // Crear usuarios de prueba
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
      }
    ];
    
    for (const datosUsuario of usuariosPrueba) {
      const usuario = new User(datosUsuario);
      await usuario.save();
      log.success(`Usuario creado: ${datosUsuario.correo} (${datosUsuario.role})`);
    }
    
    return true;
  } catch (error) {
    log.error(`Error creando usuarios: ${error.message}`);
    return false;
  }
}

// 5. Probar autenticación
async function probarAutenticacion() {
  log.info('Probando autenticación...');
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
      correo: 'admin@luckas.com',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.token) {
      log.success('Autenticación funcionando correctamente');
      return response.data.token;
    } else {
      log.error('Respuesta de autenticación incorrecta');
      return null;
    }
  } catch (error) {
    log.error(`Error en autenticación: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

// 6. Probar API protegida
async function probarAPIProtegida(token) {
  if (!token) return false;
  
  log.info('Probando API protegida...');
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/categorizacion`, {
      headers: {
        'x-access-token': token
      }
    });
    
    log.success('API protegida funcionando correctamente');
    return true;
  } catch (error) {
    log.error(`Error en API protegida: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Función principal
async function diagnosticoCompleto() {
  console.log('Iniciando diagnóstico completo...\n');
  
  const resultados = {
    mongodb: await verificarMongoDB(),
    backend: await verificarBackend(),
    frontend: await verificarFrontend()
  };
  
  if (resultados.mongodb) {
    resultados.usuarios = await crearUsuariosPrueba();
    
    if (resultados.usuarios && resultados.backend) {
      const token = await probarAutenticacion();
      resultados.auth = !!token;
      resultados.api = await probarAPIProtegida(token);
    }
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log('================================');
  
  Object.entries(resultados).forEach(([componente, estado]) => {
    const icono = estado ? '✅' : '❌';
    console.log(`${icono} ${componente.toUpperCase()}: ${estado ? 'OK' : 'ERROR'}`);
  });
  
  // Instrucciones finales
  if (Object.values(resultados).every(r => r)) {
    console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
    console.log('\n🚀 INSTRUCCIONES PARA ACCEDER:');
    console.log('1. Ve a: http://localhost:3001/login');
    console.log('2. Usa estas credenciales:');
    console.log('   - Admin: admin@luckas.com / admin123');
    console.log('   - Tesorero: tesorero@luckas.com / tesorero123');
  } else {
    console.log('\n🔧 ACCIONES NECESARIAS:');
    
    if (!resultados.mongodb) {
      console.log('- Iniciar MongoDB (mongod)');
    }
    if (!resultados.backend) {
      console.log('- Iniciar backend: cd backend && npm start');
    }
    if (!resultados.frontend) {
      console.log('- Iniciar frontend: cd frontend && npm start');
    }
  }
  
  await mongoose.connection.close();
  process.exit(0);
}

// Ejecutar diagnóstico
diagnosticoCompleto().catch(console.error);
