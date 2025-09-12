const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

async function recrearCredencialesPrueba() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(config.DB.URL);
        console.log('✅ Conectado a MongoDB');
        
        console.log('🔄 Eliminando credenciales de prueba anteriores...');
        
        // Eliminar usuarios existentes para evitar duplicados
        await User.deleteMany({
            correo: {
                $in: [
                    'externo@seminario.edu.co',
                    'admin@seminario.edu.co', 
                    'tesorero@seminario.edu.co',
                    'seminarista@seminario.edu.co'
                ]
            }
        });
        
        console.log('🔄 Creando nuevas credenciales de prueba...');
        
        // Usuario Externo (sin hashear manualmente - el modelo lo hace automáticamente)
        const usuarioExterno = new User({
            nombre: 'Juan Carlos',
            apellido: 'Pérez García',
            correo: 'externo@seminario.edu.co',
            password: '123456', // Sin hashear manualmente
            role: 'externo',
            tipoDocumento: 'Cédula de ciudadanía',
            numeroDocumento: '12345678',
            telefono: '3001234567',
            fechaNacimiento: new Date('1990-05-15'),
            direccion: 'Calle 123 #45-67',
            ciudad: 'Bogotá'
        });
        await usuarioExterno.save();
        
        // Usuario Admin
        const usuarioAdmin = new User({
            nombre: 'María Elena',
            apellido: 'Rodríguez López',
            correo: 'admin@seminario.edu.co',
            password: 'admin123', // Sin hashear manualmente
            role: 'admin',
            tipoDocumento: 'Cédula de ciudadanía',
            numeroDocumento: '87654321',
            telefono: '3007654321',
            fechaNacimiento: new Date('1985-03-20'),
            direccion: 'Carrera 15 #20-30',
            ciudad: 'Medellín'
        });
        await usuarioAdmin.save();
        
        // Usuario Tesorero
        const usuarioTesorero = new User({
            nombre: 'Carlos Andrés',
            apellido: 'Martínez Silva',
            correo: 'tesorero@seminario.edu.co',
            password: 'tesorero123', // Sin hashear manualmente
            role: 'tesorero',
            tipoDocumento: 'Cédula de ciudadanía',
            numeroDocumento: '11223344',
            telefono: '3009876543',
            fechaNacimiento: new Date('1988-11-10'),
            direccion: 'Avenida 68 #12-34',
            ciudad: 'Cali'
        });
        await usuarioTesorero.save();
        
        // Usuario Seminarista
        const usuarioSeminarista = new User({
            nombre: 'David Santiago',
            apellido: 'González Herrera',
            correo: 'seminarista@seminario.edu.co',
            password: 'semi123', // Sin hashear manualmente
            role: 'seminarista',
            tipoDocumento: 'Cédula de ciudadanía',
            numeroDocumento: '55667788',
            telefono: '3005555555',
            fechaNacimiento: new Date('1995-07-25'),
            direccion: 'Transversal 10 #8-15',
            ciudad: 'Barranquilla'
        });
        await usuarioSeminarista.save();
        
        console.log('✅ ¡Credenciales de prueba recreadas exitosamente!');
        console.log('');
        console.log('🔐 CREDENCIALES ACTUALIZADAS:');
        console.log('');
        console.log('👤 Usuario Externo:');
        console.log('   Correo: externo@seminario.edu.co');
        console.log('   Contraseña: 123456');
        console.log('   Rol: externo');
        console.log('');
        console.log('👨‍💻 Usuario Admin:');
        console.log('   Correo: admin@seminario.edu.co');
        console.log('   Contraseña: admin123');
        console.log('   Rol: admin');
        console.log('');
        console.log('💰 Usuario Tesorero:');
        console.log('   Correo: tesorero@seminario.edu.co');
        console.log('   Contraseña: tesorero123');
        console.log('   Rol: tesorero');
        console.log('');
        console.log('🎓 Usuario Seminarista:');
        console.log('   Correo: seminarista@seminario.edu.co');
        console.log('   Contraseña: semi123');
        console.log('   Rol: seminarista');
        console.log('');
        console.log('🌐 URL de Login: http://localhost:3000/external/templates/login-unified.html');
        
    } catch (error) {
        console.error('❌ Error recreando credenciales:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

recrearCredencialesPrueba();
