const BASE_URL = 'http://localhost:3000/api';

async function testLogin() {
    console.log('🔐 Probando login...');
    
    try {
        const response = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: 'admin@luckas.com',
                password: 'admin123'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Login exitoso');
            console.log('📦 Respuesta completa:', JSON.stringify(data, null, 2));
            
            if (data.accessToken) {
                console.log('🔑 Token encontrado:', data.accessToken.substring(0, 50) + '...');
            } else {
                console.log('❌ Token no encontrado en la respuesta');
                console.log('🔍 Propiedades disponibles:', Object.keys(data));
            }
        } else {
            const errorData = await response.json();
            console.log('❌ Login falló:', response.status, errorData);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testLogin();
