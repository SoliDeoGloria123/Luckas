const mongoose = require('mongoose');
require('dotenv').config();

// Modelos
const User = require('./models/User');
const Categorizacion = require('./models/categorizacion');
const Cabana = require('./models/Cabana');
const Tarea = require('./models/Tarea');
const Reservas = require('./models/Reservas');
const Inscripciones = require('./models/Inscripciones');
const Solicitud = require('./models/Solicitud');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/LuckasEnt';

async function crearDatosDePrueba() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Obtener usuarios y categorías existentes
        const adminUser = await User.findOne({ role: 'admin' });
        const semiUser = await User.findOne({ role: 'seminarista' });
        const categoria = await Categorizacion.findOne();

        if (!adminUser || !semiUser || !categoria) {
            console.log('❌ Faltan usuarios o categorías base');
            return;
        }

        console.log('\n🏠 Creando cabañas...');
        // Crear cabañas
        await Cabana.deleteMany({});
        const cabanas = await Cabana.insertMany([
            {
                nombre: 'Cabaña El Refugio',
                descripcion: 'Cabaña acogedora para 4 personas',
                capacidad: 4,
                categoria: categoria._id,
                precio: 80000,
                ubicacion: 'Km 5 vía Monserrate',
                creadoPor: adminUser._id,
                estado: 'disponible'
            },
            {
                nombre: 'Cabaña Los Pinos',
                descripcion: 'Cabaña familiar para 6 personas',
                capacidad: 6,
                categoria: categoria._id,
                precio: 120000,
                ubicacion: 'Km 8 vía La Calera',
                creadoPor: adminUser._id,
                estado: 'disponible'
            }
        ]);
        console.log(`✅ ${cabanas.length} cabañas creadas`);

        console.log('\n📝 Creando tareas...');
        // Crear tareas
        await Tarea.deleteMany({});
        const tareas = await Tarea.insertMany([
            {
                titulo: 'Revisar solicitudes pendientes',
                descripcion: 'Revisar y procesar todas las solicitudes pendientes',
                estado: 'pendiente',
                prioridad: 'alta',
                asignadoA: semiUser._id,
                asignadoPor: adminUser._id,
                fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            {
                titulo: 'Mantenimiento cabañas',
                descripcion: 'Realizar mantenimiento preventivo de las cabañas',
                estado: 'en progreso',
                prioridad: 'media',
                asignadoA: adminUser._id,
                asignadoPor: adminUser._id,
                fechaLimite: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            }
        ]);
        console.log(`✅ ${tareas.length} tareas creadas`);

        console.log('\n🏨 Creando reservas...');
        // Crear reservas
        await Reservas.deleteMany({});
        const reservas = await Reservas.insertMany([
            {
                usuario: semiUser._id,
                cabana: cabanas[0]._id,
                fechaInicio: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                estado: 'Confirmada',
                numeroPersonas: 3,
                total: 160000
            },
            {
                usuario: adminUser._id,
                cabana: cabanas[1]._id,
                fechaInicio: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                fechaFin: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                estado: 'Pendiente',
                numeroPersonas: 5,
                total: 240000
            }
        ]);
        console.log(`✅ ${reservas.length} reservas creadas`);

        console.log('\n📋 Omitiendo inscripciones (requieren más datos)...');
        // Las inscripciones requieren eventos específicos y más campos
        await Inscripciones.deleteMany({});
        console.log('✅ Tabla de inscripciones limpiada');

        console.log('\n📄 Creando más solicitudes...');
        // Crear más solicitudes
        const solicitudesAdicionales = await Solicitud.insertMany([
            {
                solicitante: semiUser._id,
                correo: semiUser.correo,
                telefono: semiUser.telefono,
                tipoSolicitud: 'Hospedaje',
                modeloReferencia: 'Cabana',
                referencia: cabanas[0]._id,
                categoria: categoria._id,
                descripcion: 'Solicitud de hospedaje para retiro espiritual',
                estado: 'Nueva',
                prioridad: 'Alta',
                responsable: adminUser._id
            },
            {
                solicitante: adminUser._id,
                correo: adminUser.correo,
                telefono: adminUser.telefono,
                tipoSolicitud: 'Administrativa',
                categoria: categoria._id,
                descripcion: 'Solicitud de reporte financiero mensual',
                estado: 'En Revisión',
                prioridad: 'Media',
                responsable: adminUser._id
            }
        ]);
        console.log(`✅ ${solicitudesAdicionales.length} solicitudes adicionales creadas`);

        console.log('\n🎉 DATOS DE PRUEBA CREADOS EXITOSAMENTE!');
        console.log('=======================================');
        console.log(`👥 Usuarios: ${await User.countDocuments()}`);
        console.log(`📂 Categorías: ${await Categorizacion.countDocuments()}`);
        console.log(`🏠 Cabañas: ${await Cabana.countDocuments()}`);
        console.log(`📝 Tareas: ${await Tarea.countDocuments()}`);
        console.log(`🏨 Reservas: ${await Reservas.countDocuments()}`);
        console.log(`📋 Inscripciones: ${await Inscripciones.countDocuments()}`);
        console.log(`📄 Solicitudes: ${await Solicitud.countDocuments()}`);
        
        console.log('\n✨ Ahora el admin debería ver datos en todas las tablas!');

    } catch (error) {
        console.error('❌ Error creando datos:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');
    }
}

crearDatosDePrueba();
