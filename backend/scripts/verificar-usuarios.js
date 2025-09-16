const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

async function verificarUsuarios() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(config.DB.URL);
        console.log('✅ Conectado a MongoDB');
        
        console.log('\n🔍 Verificando usuarios en la base de datos...');
        
        const usuarios = await User.find({}).select('+password');
        
        console.log(`\n📊 Total de usuarios encontrados: ${usuarios.length}\n`);
        
        usuarios.forEach((usuario, index) => {
            console.log(`👤 Usuario ${index + 1}:`);
            console.log(`   📧 Correo: ${usuario.correo}`);
            console.log(`   👥 Nombre: ${usuario.nombre} ${usuario.apellido}`);
            console.log(`   🎭 Rol: ${usuario.role}`);
            console.log(`   📱 Teléfono: ${usuario.telefono}`);
            console.log(`   🆔 Documento: ${usuario.tipoDocumento} - ${usuario.numeroDocumento}`);
            console.log(`   🔒 Password hash: ${usuario.password.substring(0, 20)}...`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

verificarUsuarios();
