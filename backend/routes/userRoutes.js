const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authJwt, role } = require('../middlewares');

// Middleware de diagnóstico para todas las rutas
router.use((req, res, next) => {
    console.log('\n=== DIAGNÓSTICO DE RUTA ===');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', {
        'authorization': req.headers.authorization ? '***' + req.headers.authorization.slice(-8) : null,
        'x-access-token': req.headers['x-access-token'] ? '***' + req.headers['x-access-token'].slice(-8) : null,
        'user-agent': req.headers['user-agent']
    });
    next();
});

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (admin y tesorero)
router.get('/', role.checkRole('admin', 'tesorero', 'seminarista'), userController.getAllUsers);
router.get('/documento/:numeroDocumento', role.checkRole('admin', 'tesorero', 'externo', 'seminarista'), userController.getUserByDocumento);
//ruta de obtener estadisticas de usuarios
router.get('/estadistica', role.checkRole('admin', 'tesorero'), userController.getUserStats);
router.get('/:id', role.checkRole('admin', 'tesorero'), userController.getUserById);
// Ruta para actualizar perfil propio
router.put('/profile/update', userController.updateOwnProfile);
// Ruta para cambiar contraseña propia
router.put('/change-password', userController.changePassword);
// Rutas de creación y modificación (admin y tesorero)
router.post('/', role.checkRole('admin', 'tesorero'), userController.createUser);
router.put('/:id', role.checkRole('admin', 'tesorero'), userController.updateUser);
// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, userController.deleteUser);
//ruta de activar y desdeactivar usuario
router.patch('/toggle-activation/:id', role.checkRole('admin', 'tesorero'), userController.toggleUserActivation);

module.exports = router;