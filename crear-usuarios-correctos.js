const mongoose = require('mongoose');
require('dotenv').config();

// Usar el modelo real de User
const User = require('./backend/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/LuckasEnt';

async function crearUsuarios() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Eliminar usuarios existentes
        await User.deleteMany({});
        console.log('🗑️ Usuarios existentes eliminados');

        // Crear usuario admin
        const adminUser = new User({
            nombre: 'Administrador',
            apellido: 'Sistema',
            correo: 'admin@luckas.com',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            telefono: '123456789',
            tipoDocumento: 'cedula',
            numeroDocumento: '12345678'
        });

        await adminUser.save();
        console.log('✅ Usuario admin creado');

        // Crear usuario seminarista
        const seminarista = new User({
            nombre: 'Juan',
            apellido: 'Seminarista',
            correo: 'seminarista@luckas.com',
            username: 'seminarista',
            password: 'seminarista123',
            role: 'seminarista',
            telefono: '987654321',
            tipoDocumento: 'cedula',
            numeroDocumento: '87654321'
        });

        await seminarista.save();
        console.log('✅ Usuario seminarista creado');

        console.log('\n🎉 Usuarios creados exitosamente!');
        console.log('\n📋 CREDENCIALES:');
        console.log('👤 ADMIN: admin@luckas.com / admin123');
        console.log('👤 SEMINARISTA: seminarista@luckas.com / seminarista123');

        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

crearUsuarios();
