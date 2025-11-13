const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const Usuario = require('./models/User');
const { notificarNuevaInscripcion, notificarNuevaReserva, notificarNuevaSolicitud } = require('./utils/notificationUtils');

// Conectar a la base de datos
async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seminario', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Función para probar el sistema de notificaciones
async function probarNotificaciones() {
  try {
    console.log('\n🔍 Buscando usuarios en la base de datos...');
    
    // Buscar usuarios por rol
    const admins = await Usuario.find({ role: 'admin', estado: 'activo' });
    const tesoreros = await Usuario.find({ role: 'tesorero', estado: 'activo' });
    const seminaristas = await Usuario.find({ role: 'seminarista', estado: 'activo' }).limit(1);
    
    console.log(`📊 Usuarios encontrados:`);
    console.log(`   - Administradores: ${admins.length}`);
    console.log(`   - Tesoreros: ${tesoreros.length}`);
    console.log(`   - Seminaristas: ${seminaristas.length}`);
    
    if (admins.length === 0 && tesoreros.length === 0) {
      console.log('⚠️  No hay administradores ni tesoreros activos para recibir notificaciones');
      return;
    }
    
    if (seminaristas.length === 0) {
      console.log('⚠️  No hay seminaristas para simular acciones');
      return;
    }
    
    const seminarista = seminaristas[0];
    console.log(`\n👤 Usando seminarista: ${seminarista.nombre} ${seminarista.apellido} (${seminarista.correo})`);
    
    // Simular datos para pruebas
    const mockInscripcion = {
      tipoReferencia: 'Eventos',
      _id: new mongoose.Types.ObjectId()
    };
    
    const mockEvento = {
      nombre: 'Retiro Espiritual de Prueba',
      _id: new mongoose.Types.ObjectId()
    };
    
    const mockReserva = {
      fechaInicio: new Date('2025-12-01'),
      fechaFin: new Date('2025-12-03'),
      _id: new mongoose.Types.ObjectId()
    };
    
    const mockCabana = {
      nombre: 'Cabaña de Prueba',
      _id: new mongoose.Types.ObjectId()
    };
    
    const mockSolicitud = {
      tipoSolicitud: 'Hospedaje',
      titulo: 'Solicitud de Prueba',
      _id: new mongoose.Types.ObjectId()
    };
    
    // Probar notificaciones
    console.log('\n🧪 Probando sistema de notificaciones...\n');
    
    console.log('1️⃣ Probando notificación de inscripción...');
    const resultInscripcion = await notificarNuevaInscripcion(mockInscripcion, seminarista, mockEvento);
    if (resultInscripcion.success) {
      console.log(`   ✅ ${resultInscripcion.count} notificación(es) enviada(s)`);
    } else {
      console.log(`   ❌ Error: ${resultInscripcion.message}`);
    }
    
    console.log('\n2️⃣ Probando notificación de reserva...');
    const resultReserva = await notificarNuevaReserva(mockReserva, seminarista, mockCabana);
    if (resultReserva.success) {
      console.log(`   ✅ ${resultReserva.count} notificación(es) enviada(s)`);
    } else {
      console.log(`   ❌ Error: ${resultReserva.message}`);
    }
    
    console.log('\n3️⃣ Probando notificación de solicitud...');
    const resultSolicitud = await notificarNuevaSolicitud(mockSolicitud, seminarista);
    if (resultSolicitud.success) {
      console.log(`   ✅ ${resultSolicitud.count} notificación(es) enviada(s)`);
    } else {
      console.log(`   ❌ Error: ${resultSolicitud.message}`);
    }
    
    console.log('\n🎉 Pruebas completadas!');
    console.log('\n💡 Para verificar las notificaciones:');
    console.log('   - Haz login con un usuario admin o tesorero');
    console.log('   - Llama a GET /api/notifications');
    console.log('   - Deberías ver las 3 notificaciones de prueba');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📴 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  await conectarDB();
  await probarNotificaciones();
}

module.exports = { probarNotificaciones };