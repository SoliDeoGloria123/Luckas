const mongoose = require('mongoose');
require('dotenv').config();

// Usar el modelo real
const Categorizacion = require('./models/categorizacion');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/LuckasEnt';

async function crearCategorias() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar categorías existentes primero para evitar conflictos
        await Categorizacion.collection.drop().catch(() => console.log('⚠️ Colección no existía'));
        console.log('🗑️ Categorías existentes eliminadas');

        // Crear categorías de prueba
        const categorias = [
            { nombre: 'Conferencias', codigo: 'CONF', activo: true },
            { nombre: 'Talleres', codigo: 'TALL', activo: true },
            { nombre: 'Seminarios', codigo: 'SEM', activo: true },
            { nombre: 'Eventos Sociales', codigo: 'SOC', activo: true }
        ];

        // Crear categorías
        const categoriasCreadas = await Categorizacion.insertMany(categorias);
        console.log('✅ Categorías creadas exitosamente');

        // Mostrar IDs para usar en pruebas
        console.log('\n📋 CATEGORÍAS CREADAS:');
        categoriasCreadas.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.nombre} - ID: ${cat._id}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');

        return categoriasCreadas[0]._id; // Retornar el primer ID para usar en pruebas

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

crearCategorias();
