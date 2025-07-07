const mongoose = require('mongoose');
require('dotenv').config();

// Modelos
const Solicitud = require('./models/Solicitud');
const User = require('./models/User');
const Categorizacion = require('./models/categorizacion');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/LuckasEnt';

async function testearCRUDCompleto() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // 1. Obtener usuario admin y categoría
        const adminUser = await User.findOne({ role: 'admin' });
        const categoria = await Categorizacion.findOne();
        
        if (!adminUser) {
            console.log('❌ No se encontró usuario admin');
            return;
        }
        
        if (!categoria) {
            console.log('❌ No se encontró categoría');
            return;
        }

        console.log('✅ Usuario admin encontrado:', adminUser.correo);
        console.log('✅ Categoría encontrada:', categoria.nombre);

        // 2. Crear solicitud de prueba
        console.log('\n🧪 Creando solicitud de prueba...');
        const nuevaSolicitud = new Solicitud({
            solicitante: adminUser._id,
            correo: adminUser.correo,
            telefono: '987654321',
            tipoSolicitud: 'Certificados', // Usar valor válido del enum
            categoria: categoria._id,
            descripcion: 'Solicitud de prueba para testing CRUD',
            estado: 'Nueva', // Usar valor válido del enum
            prioridad: 'Media',
            responsable: adminUser._id, // Debe ser ObjectId, no string
            observaciones: 'Solicitud creada por script de prueba'
        });

        const solicitudCreada = await nuevaSolicitud.save();
        console.log('✅ Solicitud creada exitosamente:', {
            id: solicitudCreada._id,
            tipo: solicitudCreada.tipoSolicitud,
            estado: solicitudCreada.estado
        });

        // 3. Leer solicitudes
        console.log('\n📋 Obteniendo todas las solicitudes...');
        const todasLasSolicitudes = await Solicitud.find()
            .populate('solicitante', 'nombre apellido correo')
            .populate('categoria', 'nombre');
        
        console.log(`✅ Total de solicitudes encontradas: ${todasLasSolicitudes.length}`);
        todasLasSolicitudes.forEach((sol, index) => {
            console.log(`${index + 1}. ${sol.tipoSolicitud} - ${sol.estado} - Solicitante: ${sol.solicitante?.nombre || 'Sin asignar'}`);
        });

        // 4. Actualizar solicitud
        console.log('\n🔄 Actualizando solicitud...');
        const solicitudActualizada = await Solicitud.findByIdAndUpdate(
            solicitudCreada._id,
            { 
                estado: 'En Revisión', // Usar valor válido del enum
                observaciones: 'Solicitud actualizada por script de prueba'
            },
            { new: true }
        );
        console.log('✅ Solicitud actualizada:', {
            id: solicitudActualizada._id,
            estadoNuevo: solicitudActualizada.estado
        });

        // 5. Eliminar solicitud
        console.log('\n🗑️ Eliminando solicitud...');
        await Solicitud.findByIdAndDelete(solicitudCreada._id);
        console.log('✅ Solicitud eliminada exitosamente');

        // 6. Verificar eliminación
        const solicitudEliminada = await Solicitud.findById(solicitudCreada._id);
        if (!solicitudEliminada) {
            console.log('✅ Verificación: Solicitud eliminada correctamente');
        } else {
            console.log('❌ Error: La solicitud no se eliminó');
        }

        console.log('\n🎉 CRUD de solicitudes funciona correctamente!');

    } catch (error) {
        console.error('❌ Error en el test CRUD:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');
    }
}

testearCRUDCompleto();
