const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// Middleware de diagnóstico
router.use((req, res, next) => {
    console.log('\n[AuthRoutes] Petición recibida: ', {
        method: req.method,
        path: req.path,
        url: req.originalUrl,
        Headers: {
            authorization: req.headers.authorization ? '***' : 'NO', 
            'x-access-token': req.headers['x-access-token'] ? '***' : 'NO'
        }
    });
    next();
});

// Rutas básicas sin middlewares complejos por ahora
router.post('/signin', (req, res, next) => {
    console.log('[AuthRoutes] Ruta /signin ejecutándose');
    console.log('[AuthRoutes] Body recibido:', req.body);
    authController.signin(req, res, next);
});

router.post('/signup', (req, res, next) => {
    console.log('[AuthRoutes] Ruta /signup ejecutándose');
    authController.signup(req, res, next);
});

// Verificación de rutas registradas
console.log('[AuthRoutes] Rutas registradas:');
router.stack.forEach((layer, index) => {
    console.log(`  ${index + 1}. ${layer.route?.stack[0]?.method?.toUpperCase()} ${layer.route?.path}`);
});

module.exports = router;