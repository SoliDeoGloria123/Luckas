const BASE_URL = 'http://localhost:3000/api';

async function testCompleteFlow() {
    console.log('\n🚀 PRUEBA COMPLETA DE FLUJO DE AUTENTICACIÓN');
    console.log('=============================================\n');

    try {
        // 1. Login para obtener token fresco
        console.log('🔐 Paso 1: Realizando login...');
        const loginResponse = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: 'admin@luckas.com',
                password: 'admin123'
            })
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('✅ Login exitoso');
            const token = loginData.token; // Cambiar de accessToken a token
            console.log('🔑 Token obtenido:', token.substring(0, 50) + '...');
            
            // Configurar headers para próximas requests
            const headers = { 
                'x-access-token': token,
                'Content-Type': 'application/json' 
            };

            // 2. Probar GET protegido
            console.log('\n📋 Paso 2: Probando GET protegido (/api/usuarios)...');
            const usuariosResponse = await fetch(`${BASE_URL}/usuarios`, { headers });
            const usuariosData = await usuariosResponse.json();
            console.log('✅ GET usuarios exitoso:', usuariosData.length, 'usuarios encontrados');

            // 3. Probar GET eventos
            console.log('\n📅 Paso 3: Probando GET eventos...');
            const eventosResponse = await fetch(`${BASE_URL}/eventos`, { headers });
            const eventosData = await eventosResponse.json();
            console.log('✅ GET eventos exitoso:', eventosData.length, 'eventos encontrados');

            // 4. Probar POST evento (el que estaba fallando)
            console.log('\n🎉 Paso 4: Probando POST evento (el problema original)...');
            const nuevoEvento = {
                nombre: 'Evento de Prueba - ' + new Date().toISOString(),
                descripcion: 'Evento creado por script de prueba',
                fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días en el futuro
                ubicacion: 'Ubicación de prueba',
                categoria: '686c3f24462954c9aeea9f41' // ID de la categoría Conferencias que acabamos de crear
            };

            const eventoResponse = await fetch(`${BASE_URL}/eventos`, {
                method: 'POST',
                headers,
                body: JSON.stringify(nuevoEvento)
            });

            if (eventoResponse.ok) {
                const eventoData = await eventoResponse.json();
                console.log('✅ POST evento EXITOSO!');
                console.log('📝 Evento creado:', eventoData);
                console.log('\n🎉 TODAS LAS PRUEBAS EXITOSAS! El problema está SOLUCIONADO! 🎉');
            } else {
                const errorData = await eventoResponse.json();
                console.log('❌ POST evento falló:', eventoResponse.status, errorData);
            }

        } else {
            const errorData = await loginResponse.json();
            console.log('❌ Login falló:', loginResponse.status, errorData);
        }

    } catch (error) {
        console.log('❌ Error en la prueba:', error.message);
        
        if (error.message.includes('401')) {
            console.log('\n🚨 PROBLEMA: Aún hay error 401. Posibles causas:');
            console.log('   1. El servidor no se reinició completamente');
            console.log('   2. Hay cache en algún lugar');
            console.log('   3. El middleware de auth tiene problemas');
        }
    }
}

// Esperar un poco para que los servidores se inicien
setTimeout(testCompleteFlow, 8000);

console.log('⏳ Esperando 8 segundos para que los servidores se inicien...');
