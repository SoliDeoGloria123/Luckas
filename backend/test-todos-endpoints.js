const BASE_URL = 'http://localhost:3000/api';

async function obtenerTokenAdmin() {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            correo: 'admin@luckas.com',
            password: 'admin123'
        })
    });
    
    if (response.ok) {
        const data = await response.json();
        return data.token;
    }
    throw new Error('No se pudo obtener token');
}

async function testearEndpoint(endpoint, token) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: { 'x-access-token': token }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${endpoint}: OK - ${data.data?.length || 0} elementos`);
        } else {
            const errorData = await response.json();
            console.log(`❌ ${endpoint}: ${response.status} - ${errorData.message || 'Error'}`);
        }
    } catch (error) {
        console.log(`❌ ${endpoint}: Error de conexión - ${error.message}`);
    }
}

async function testearTodosLosEndpoints() {
    console.log('🚀 PROBANDO TODOS LOS ENDPOINTS CRUD');
    console.log('===================================\n');
    
    try {
        console.log('🔐 Obteniendo token de admin...');
        const token = await obtenerTokenAdmin();
        console.log('✅ Token obtenido\n');
        
        const endpoints = [
            '/solicitudes',
            '/cabanas',
            '/tareas',
            '/inscripciones',
            '/reservas',
            '/reportes',
            '/eventos',
            '/users',
            '/categorizacion'
        ];
        
        console.log('📋 Probando endpoints...\n');
        for (const endpoint of endpoints) {
            await testearEndpoint(endpoint, token);
        }
        
        console.log('\n🎉 Prueba completada!');
        
    } catch (error) {
        console.log('❌ Error en la prueba:', error.message);
    }
}

// Esperar a que el servidor se inicie
setTimeout(testearTodosLosEndpoints, 5000);
