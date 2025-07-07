// Script simple para crear usuarios de prueba
// No requiere dotenv

const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');

// Configuración directa
const MONGODB_URI = 'mongodb://localhost:27017/LuckasEnt';

// Esquema de Usuario
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, trim: true, lowercase: true },
  telefono: { type: String, required: true, unique: true, trim: true },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'tesorero', 'seminarista', 'externo'], default: 'externo' },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

// Pre-hook para hashear contraseña
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Usuarios de prueba
const usuariosPrueba = [
  {
    nombre: 'Administrador',
    apellido: 'Sistema',
    correo: 'admin@luckas.com',
    telefono: '1234567890',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '12345678',
    password: 'admin123',
    role: 'admin',
    estado: 'activo'
  },
  {
    nombre: 'María',
    apellido: 'Tesorera',
    correo: 'tesorero@luckas.com',
    telefono: '0987654321',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '87654321',
    password: 'tesorero123',
    role: 'tesorero',
    estado: 'activo'
  },
  {
    nombre: 'Juan',
    apellido: 'Seminarista',
    correo: 'seminarista@luckas.com',
    telefono: '1122334455',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '11223344',
    password: 'seminarista123',
    role: 'seminarista',
    estado: 'activo'
  },
  {
    nombre: 'Ana',
    apellido: 'Externa',
    correo: 'externo@luckas.com',
    telefono: '5566778899',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '55667788',
    password: 'externo123',
    role: 'externo',
    estado: 'activo'
  }
];

async function main() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    console.log('🔄 Eliminando usuarios existentes...');
    await User.deleteMany({});
    
    console.log('👥 Creando usuarios de prueba...');
    for (const datosUsuario of usuariosPrueba) {
      try {
        const usuario = new User(datosUsuario);
        await usuario.save();
        console.log(`✅ Usuario creado: ${datosUsuario.correo} (${datosUsuario.role})`);
      } catch (error) {
        console.error(`❌ Error creando usuario ${datosUsuario.correo}:`, error.message);
      }
    }
    
    console.log('\n🎉 ¡Usuarios de prueba creados exitosamente!');
    console.log('\n📝 CREDENCIALES DE ACCESO:');
    console.log('============================');
    
    usuariosPrueba.forEach(user => {
      console.log(`🔐 ${user.role.toUpperCase()}: ${user.correo} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Solución: Asegúrate de que MongoDB esté corriendo (mongod)');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Conexión cerrada');
    process.exit(0);
  }
}

main().catch(console.error);
