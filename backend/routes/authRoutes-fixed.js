const express = require('express');
const router = express.Router();

// Test simple para verificar que la ruta responde
router.get('/test', (req, res) => {
    console.log('[AUTH-TEST] Ruta de test ejecutada');
    res.json({ message: 'Ruta de autenticación funcionando', timestamp: new Date().toISOString() });
});

// Importación del controlador con manejo de errores
let authController;
try {
    authController = require('../controllers/authControllers');
    console.log('[AUTH-ROUTES] ✅ AuthController importado correctamente');
    console.log('[AUTH-ROUTES] Funciones disponibles:', Object.keys(authController));
} catch (error) {
    console.error('[AUTH-ROUTES] ❌ Error importando authController:', error);
}

// Middleware de logging
router.use((req, res, next) => {
    console.log(`[AUTH-ROUTES] ${req.method} ${req.originalUrl} - Body:`, Object.keys(req.body || {}));
    next();
});

// Rutas principales
if (authController) {
    router.post('/signin', (req, res) => {
        console.log('[AUTH-ROUTES] 🔐 Ejecutando signin...');
        try {
            return authController.signin(req, res);
        } catch (error) {
            console.error('[AUTH-ROUTES] Error en signin:', error);
            return res.status(500).json({ success: false, message: 'Error interno en signin' });
        }
    });

    router.post('/signup', (req, res) => {
        console.log('[AUTH-ROUTES] 📝 Ejecutando signup...');
        try {
            return authController.signup(req, res);
        } catch (error) {
            console.error('[AUTH-ROUTES] Error en signup:', error);
            return res.status(500).json({ success: false, message: 'Error interno en signup' });
        }
    });
} else {
    console.error('[AUTH-ROUTES] ❌ AuthController no disponible, rutas no registradas');
}

// Log de rutas registradas
console.log('[AUTH-ROUTES] 📋 Rutas registradas:');
router.stack.forEach((layer, index) => {
    if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        console.log(`  ${index + 1}. ${methods} ${layer.route.path}`);
    }
});

module.exports = router;
