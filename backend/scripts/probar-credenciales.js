async function probarCredenciales() {
    console.log('🔧 PROBANDO CREDENCIALES DEL PROYECTO LUCKAS');
    console.log('═'.repeat(50));
    
    const credenciales = [
        {
            nombre: 'Usuario Externo',
            correo: 'externo@seminario.edu.co',
            password: '123456',
            rolEsperado: 'externo'
        },
        {
            nombre: 'Usuario Admin',
            correo: 'admin@seminario.edu.co', 
            password: 'admin123',
            rolEsperado: 'admin'
        },
        {
            nombre: 'Usuario Tesorero',
            correo: 'tesorero@seminario.edu.co',
            password: 'tesorero123',
            rolEsperado: 'tesorero'
        },
        {
            nombre: 'Usuario Seminarista',
            correo: 'seminarista@seminario.edu.co',
            password: 'semi123',
            rolEsperado: 'seminarista'
        }
    ];
    
    for (const credencial of credenciales) {
        try {
            console.log(`\n🔍 Probando: ${credencial.nombre}`);
            
            const response = await fetch('http://localhost:3000/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: credencial.correo,
                    password: credencial.password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`   ✅ Login exitoso`);
                console.log(`   📧 Correo: ${credencial.correo}`);
                console.log(`   👤 Nombre: ${data.user.nombre} ${data.user.apellido}`);
                console.log(`   🎭 Rol: ${data.user.role}`);
                console.log(`   🔑 Token: ${data.token.substring(0, 20)}...`);
                
                if (data.user.role === credencial.rolEsperado) {
                    console.log(`   ✅ Rol correcto`);
                } else {
                    console.log(`   ❌ Rol incorrecto. Esperado: ${credencial.rolEsperado}, Obtenido: ${data.user.role}`);
                }
            } else {
                console.log(`   ❌ Error en login: ${data.message}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Error de conexión: ${error.message}`);
        }
    }
    
    console.log('\n' + '═'.repeat(50));
    console.log('🌐 URLS PARA PROBAR EN EL NAVEGADOR:');
    console.log('');
    console.log('🔗 Login Unificado:');
    console.log('   http://localhost:3000/external/templates/login-unified.html');
    console.log('');
    console.log('🔗 Dashboard Externo (después del login):');
    console.log('   http://localhost:3000/external/templates/dashboard.html');
    console.log('');
    console.log('🔗 Dashboard Admin (React):');
    console.log('   http://localhost:3001');
    console.log('');
    console.log('📝 INSTRUCCIONES:');
    console.log('1. Ve al login unificado');
    console.log('2. Usa cualquiera de las credenciales probadas arriba');
    console.log('3. El sistema te redirigirá automáticamente según tu rol');
    console.log('4. ¡Explora las funcionalidades!');
    console.log('');
}

probarCredenciales().catch(console.error);
