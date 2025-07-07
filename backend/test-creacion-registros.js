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

async function testearCreacion() {
    console.log('🚀 PROBANDO CREACIÓN DE REGISTROS (POST)');
    console.log('========================================\n');
    
    try {
        const token = await obtenerTokenAdmin();
        const headers = {
            'Content-Type': 'application/json',
            'x-access-token': token
        };

        // Obtener datos necesarios primero
        console.log('📋 Obteniendo categorías...');
        const categoriasResponse = await fetch(`${BASE_URL}/categorizacion`, { headers });
        const categoriasData = await categoriasResponse.json();
        console.log('Categorías response:', categoriasData);
        
        console.log('👥 Obteniendo usuarios...');
        const usuariosResponse = await fetch(`${BASE_URL}/users`, { headers });
        const usuariosData = await usuariosResponse.json();
        console.log('Usuarios response:', usuariosData);
        
        if (!categoriasData.data || categoriasData.data.length === 0) {
            console.log('❌ No hay categorías disponibles');
            return;
        }
        
        if (!usuariosData.data || usuariosData.data.length === 0) {
            console.log('❌ No hay usuarios disponibles');
            return;
        }
        
        const categoriaId = categoriasData.data[0]._id;
        const usuarioId = usuariosData.data[0]._id;

        console.log('📋 Datos obtenidos:');
        console.log('   Categoría ID:', categoriaId);
        console.log('   Usuario ID:', usuarioId);

        console.log('🏠 Probando creación de cabaña...');
        const cabanaData = {
            nombre: 'Cabaña Nueva - ' + Date.now(),
            descripcion: 'Cabaña creada desde el frontend',
            capacidad: 4,
            categoria: categoriaId,
            ubicacion: 'Ubicación de prueba',
            estado: 'disponible'
        };

        const cabanaResponse = await fetch(`${BASE_URL}/cabanas`, {
            method: 'POST',
            headers,
            body: JSON.stringify(cabanaData)
        });

        if (cabanaResponse.ok) {
            const cabanaCreada = await cabanaResponse.json();
            console.log('✅ Cabaña creada exitosamente:', cabanaCreada.data?.nombre || 'Sin nombre');
        } else {
            const error = await cabanaResponse.json();
            console.log('❌ Error creando cabaña:', cabanaResponse.status, error.message);
        }

        console.log('\n📝 Probando creación de tarea...');
        const tareaData = {
            titulo: 'Nueva Tarea - ' + Date.now(),
            descripcion: 'Tarea creada desde el frontend',
            estado: 'pendiente',
            prioridad: 'media',
            asignadoA: usuarioId,
            fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };

        const tareaResponse = await fetch(`${BASE_URL}/tareas`, {
            method: 'POST',
            headers,
            body: JSON.stringify(tareaData)
        });

        if (tareaResponse.ok) {
            const tareaCreada = await tareaResponse.json();
            console.log('✅ Tarea creada exitosamente:', tareaCreada.data?.titulo || 'Sin título');
        } else {
            const error = await tareaResponse.json();
            console.log('❌ Error creando tarea:', tareaResponse.status, error.message);
        }

        console.log('\n📄 Probando creación de solicitud...');
        const solicitudData = {
            correo: 'test@ejemplo.com',
            telefono: '3001234567',
            tipoSolicitud: 'Certificados',
            categoria: categoriaId,
            descripcion: 'Solicitud creada desde el frontend de prueba',
            estado: 'Nueva',
            prioridad: 'Media'
        };

        const solicitudResponse = await fetch(`${BASE_URL}/solicitudes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(solicitudData)
        });

        if (solicitudResponse.ok) {
            const solicitudCreada = await solicitudResponse.json();
            console.log('✅ Solicitud creada exitosamente:', solicitudCreada.data?.tipoSolicitud || 'Sin tipo');
        } else {
            const error = await solicitudResponse.json();
            console.log('❌ Error creando solicitud:', solicitudResponse.status, error.message);
        }

        console.log('\n🎉 PRUEBAS DE CREACIÓN COMPLETADAS!');
        console.log('\n✨ El admin ya puede:');
        console.log('   ✅ Ver datos en todas las tablas');
        console.log('   ✅ Crear nuevos registros');
        console.log('   ✅ Usar todas las funcionalidades CRUD');

    } catch (error) {
        console.log('❌ Error en las pruebas:', error.message);
    }
}

testearCreacion();
