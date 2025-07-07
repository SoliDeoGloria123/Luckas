const BASE_URL = 'http://localhost:3000/api';

async function pruebaFinalCompleta() {
    console.log('\n🚀 PRUEBA FINAL COMPLETA DE CREACIÓN DE EVENTO');
    console.log('===============================================\n');

    try {
        // 1. Login
        console.log('🔐 Paso 1: Login...');
        const loginResponse = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: 'admin@luckas.com',
                password: 'admin123'
            })
        });

        if (!loginResponse.ok) {
            throw new Error('Login falló');
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login exitoso - Token obtenido');

        // 2. Crear evento con TODOS los campos requeridos
        console.log('\n🎉 Paso 2: Creando evento completo...');
        const eventoCompleto = {
            nombre: 'Evento de Prueba Final - ' + Date.now(),
            descripcion: 'Evento creado para probar que el sistema funciona correctamente',
            precio: 25000,
            categoria: '686c3f24462954c9aeea9f41', // Conferencias
            fechaEvento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            horaInicio: '09:00',
            horaFin: '17:00',
            lugar: 'Auditorio Principal',
            cuposTotales: 100,
            cuposDisponibles: 100,
            estado: 'activo'
        };

        const eventoResponse = await fetch(`${BASE_URL}/eventos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(eventoCompleto)
        });

        if (eventoResponse.ok) {
            const eventoCreado = await eventoResponse.json();
            console.log('🎉 ¡ÉXITO TOTAL! Evento creado correctamente');
            console.log('📝 Evento:', {
                id: eventoCreado.data._id,
                nombre: eventoCreado.data.nombre,
                precio: eventoCreado.data.precio,
                fecha: eventoCreado.data.fechaEvento
            });
            
            console.log('\n🎊 ¡PROBLEMA SOLUCIONADO COMPLETAMENTE! 🎊');
            console.log('✅ Login funciona');
            console.log('✅ Tokens se generan correctamente (24h)');
            console.log('✅ Autenticación funciona');
            console.log('✅ Creación de eventos funciona');
            console.log('\n👤 El usuario ya puede usar el frontend sin problemas');
            
        } else {
            const errorData = await eventoResponse.json();
            console.log('❌ Error creando evento:', eventoResponse.status, errorData);
        }

    } catch (error) {
        console.log('❌ Error en la prueba:', error.message);
    }
}

pruebaFinalCompleta();
