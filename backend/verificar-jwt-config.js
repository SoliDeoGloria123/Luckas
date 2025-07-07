const jwt = require('jsonwebtoken');
const config = require('./config/auth.config');

console.log('\n🔍 VERIFICADOR DE CONFIGURACIÓN JWT');
console.log('=====================================\n');

console.log('📋 Configuración actual:');
console.log('   Secret:', config.secret ? '✅ Definido' : '❌ No definido');
console.log('   Expiración:', config.jwtExpiration);
console.log('   Salt Rounds:', config.saltRounds);

console.log('\n🧪 Generando token de prueba...');

try {
    const testPayload = {
        id: 'test123',
        role: 'admin',
        test: true
    };

    const token = jwt.sign(
        testPayload,
        config.secret,
        { expiresIn: config.jwtExpiration }
    );

    console.log('✅ Token generado exitosamente');
    console.log('🔢 Token:', token.substring(0, 50) + '...');
    
    // Decodificar el token para verificar
    const decoded = jwt.decode(token, { complete: true });
    console.log('\n📊 Información del token:');
    console.log('   Algoritmo:', decoded.header.alg);
    console.log('   Tipo:', decoded.header.typ);
    console.log('   Emisión:', new Date(decoded.payload.iat * 1000).toLocaleString());
    console.log('   Expiración:', new Date(decoded.payload.exp * 1000).toLocaleString());
    
    const tiempoVida = (decoded.payload.exp - decoded.payload.iat);
    console.log('   Tiempo de vida:', tiempoVida, 'segundos (', tiempoVida / 3600, 'horas)');

    // Verificar que el token es válido
    const verified = jwt.verify(token, config.secret);
    console.log('\n✅ Token verificado correctamente');
    console.log('   Payload verificado:', verified);

} catch (error) {
    console.log('❌ Error generando o verificando token:', error.message);
}

console.log('\n🔍 Variables de entorno:');
console.log('   JWT_EXPIRATION:', process.env.JWT_EXPIRATION);
console.log('   AUTH_SECRET:', process.env.AUTH_SECRET ? '✅ Definido' : '❌ No definido');

console.log('\n✅ Verificación completada\n');
