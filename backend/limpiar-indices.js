const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/LuckasEnt';

async function limpiarIndices() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Ver índices existentes
        const indices = await collection.indexes();
        console.log('📋 Índices existentes:', indices);

        // Eliminar el índice problemático de username
        try {
            await collection.dropIndex('username_1');
            console.log('✅ Índice username_1 eliminado');
        } catch (error) {
            console.log('⚠️ No se pudo eliminar índice username_1:', error.message);
        }

        // Eliminar toda la colección para empezar limpio
        await collection.drop();
        console.log('✅ Colección users eliminada completamente');

        await mongoose.disconnect();
        console.log('✅ Desconectado de MongoDB');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

limpiarIndices();
