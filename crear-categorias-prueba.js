// Script para crear categorías de prueba
const mongoose = require('./backend/node_modules/mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/LuckasEnt';

// Esquema de Categorización
const categorizacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    unique: true
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Categorizacion = mongoose.model('Categorizacion', categorizacionSchema);

// Categorías de prueba
const categoriasPrueba = [
  {
    nombre: 'Académico',
    codigo: 'ACAD',
    activo: true
  },
  {
    nombre: 'Deportivo',
    codigo: 'DEP',
    activo: true
  },
  {
    nombre: 'Cultural',
    codigo: 'CULT',
    activo: true
  },
  {
    nombre: 'Tecnológico',
    codigo: 'TECH',
    activo: true
  }
];

async function main() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    console.log('🔄 Eliminando categorías existentes...');
    await Categorizacion.deleteMany({});
    
    console.log('📂 Creando categorías de prueba...');
    for (const datosCategoria of categoriasPrueba) {
      try {
        const categoria = new Categorizacion(datosCategoria);
        await categoria.save();
        console.log(`✅ Categoría creada: ${datosCategoria.nombre} (${datosCategoria.codigo})`);
      } catch (error) {
        console.error(`❌ Error creando categoría ${datosCategoria.nombre}:`, error.message);
      }
    }
    
    console.log('\n🎉 ¡Categorías de prueba creadas exitosamente!');
    
    // Verificar que se crearon
    const categorias = await Categorizacion.find({});
    console.log(`\n📊 Total de categorías en base de datos: ${categorias.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Conexión cerrada');
    process.exit(0);
  }
}

main().catch(console.error);
