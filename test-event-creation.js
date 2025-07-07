// Script para probar la autenticación y creación de eventos
const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3000';

// Test completo
async function testEventCreation() {
    console.log('🧪 PROBANDO CREACIÓN DE EVENTOS\n');
    
    try {
        // 1. Login para obtener token
        console.log('🔐 1. Haciendo login...');
        const loginResponse = await fetch(`${BACKEND_URL}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: 'admin@luckas.com',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (!loginData.success) {
            console.error('❌ Error en login:', loginData.message);
            return;
        }
        
        console.log('✅ Login exitoso');
        console.log('👤 Usuario:', loginData.user.nombre, loginData.user.apellido);
        console.log('🎫 Token obtenido:', loginData.token.slice(-10));
        
        const token = loginData.token;
        
        // 2. Probar GET de eventos
        console.log('\n📂 2. Probando GET eventos...');
        const getEventsResponse = await fetch(`${BACKEND_URL}/api/eventos`, {
            headers: {
                'x-access-token': token
            }
        });
        
        if (getEventsResponse.ok) {
            console.log('✅ GET eventos exitoso');
        } else {
            console.error('❌ GET eventos falló:', getEventsResponse.status, await getEventsResponse.text());
            return;
        }
        
        // 3. Probar GET de categorías
        console.log('\n📋 3. Probando GET categorías...');
        const getCategoriesResponse = await fetch(`${BACKEND_URL}/api/categorizacion`, {
            headers: {
                'x-access-token': token
            }
        });
        
        let categoriaId = null;
        if (getCategoriesResponse.ok) {
            const categoriesData = await getCategoriesResponse.json();
            console.log('✅ GET categorías exitoso');
            if (categoriesData.data && categoriesData.data.length > 0) {
                categoriaId = categoriesData.data[0]._id;
                console.log('📌 Usando categoría:', categoriesData.data[0].nombre, '(ID:', categoriaId, ')');
            }
        } else {
            console.error('❌ GET categorías falló:', getCategoriesResponse.status);
        }
        
        // 4. Crear evento de prueba
        console.log('\n✨ 4. Creando evento de prueba...');
        const eventoData = {
            name: 'Evento de Prueba ' + Date.now(),
            description: 'Evento creado automáticamente para testing',
            price: 25000,
            categoria: categoriaId || 'Académico',
            fechaEvento: '2025-07-15',
            horaInicio: '09:00',
            horaFin: '17:00',
            lugar: 'Aula Virtual',
            cuposTotales: 50,
            cuposDisponibles: 50,
            prioridad: 'Media',
            active: true
        };
        
        const createEventResponse = await fetch(`${BACKEND_URL}/api/eventos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(eventoData)
        });
        
        if (createEventResponse.ok) {
            const eventData = await createEventResponse.json();
            console.log('✅ Evento creado exitosamente!');
            console.log('📅 Evento:', eventData.data?.name || 'N/A');
        } else {
            const errorText = await createEventResponse.text();
            console.error('❌ Error creando evento:', createEventResponse.status);
            console.error('📄 Respuesta:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

// Ejecutar si node-fetch está disponible
if (typeof fetch === 'undefined') {
    console.log('❌ Este script requiere node-fetch');
    console.log('💡 Instalar con: npm install node-fetch@2');
    process.exit(1);
} else {
    testEventCreation();
}
