// Test simple para verificar la importación del controlador
const authController = require('./backend/controllers/authControllers');

console.log('🧪 VERIFICANDO CONTROLADOR DE AUTENTICACIÓN\n');

console.log('✅ authController importado:', !!authController);
console.log('✅ authController.signin existe:', typeof authController.signin);
console.log('✅ authController.signup existe:', typeof authController.signup);

if (typeof authController.signin === 'function') {
    console.log('✅ signin es una función válida');
} else {
    console.log('❌ signin NO es una función');
}

if (typeof authController.signup === 'function') {
    console.log('✅ signup es una función válida');
} else {
    console.log('❌ signup NO es una función');
}

console.log('\n📋 Propiedades del authController:');
console.log(Object.keys(authController));

console.log('\n🎉 Verificación completada');
