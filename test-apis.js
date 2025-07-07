// Script para probar las APIs problemáticas
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000';

// Test de autenticación
async function testLogin() {
  try {
    console.log('🔐 Probando login...');
    const response = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
      correo: 'admin@luckas.com',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.token) {
      console.log('✅ Login exitoso');
      return response.data.token;
    } else {
      console.log('❌ Login falló');
      return null;
    }
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test de categorías GET
async function testCategoriasGet(token) {
  try {
    console.log('📂 Probando GET /api/categorizacion...');
    const response = await axios.get(`${BACKEND_URL}/api/categorizacion`, {
      headers: {
        'x-access-token': token
      }
    });
    
    console.log('✅ GET categorías exitoso');
    console.log(`📊 Categorías encontradas: ${response.data.data?.length || 0}`);
    return true;
  } catch (error) {
    console.error('❌ Error en GET categorías:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test de categorías POST
async function testCategoriasPost(token) {
  try {
    console.log('📝 Probando POST /api/categorizacion...');
    const nuevaCategoria = {
      nombre: 'Test Categoría',
      codigo: 'TEST'
    };
    
    const response = await axios.post(`${BACKEND_URL}/api/categorizacion`, nuevaCategoria, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ POST categoría exitoso');
    console.log('📄 Categoría creada:', response.data.data?.nombre);
    return true;
  } catch (error) {
    console.error('❌ Error en POST categoría:', error.response?.data?.message || error.message);
    console.error('📋 Datos enviados:', error.config?.data);
    return false;
  }
}

// Test principal
async function runTests() {
  console.log('🧪 INICIANDO TESTS DE API\n');
  
  // Test 1: Login
  const token = await testLogin();
  if (!token) {
    console.log('❌ No se puede continuar sin token');
    process.exit(1);
  }
  
  console.log('');
  
  // Test 2: GET Categorías
  await testCategoriasGet(token);
  
  console.log('');
  
  // Test 3: POST Categoría
  await testCategoriasPost(token);
  
  console.log('\n🎉 Tests completados');
}

runTests().catch(console.error);
