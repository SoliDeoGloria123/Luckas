const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { authJwt, role } = require('../middlewares');
const { body } = require('express-validator');
// INCORRECTO
const { uploadMultiple, uploadMultipleToCloudinary } = require('../middlewares/uploadCloudinary');

// Validaciones para el evento
const validarEvento = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  body('price').isNumeric().withMessage('El precio debe ser numérico'),
  body('categoria').isMongoId().withMessage('ID de categoría inválido')
];

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (admin, tesorero, seminarista, externo)
router.get('/', role.checkRole('admin', 'tesorero', 'seminarista', 'externo'), eventosController.getAllEvents);
router.get('/:id', role.checkRole('admin', 'tesorero', 'seminarista', 'externo'), eventosController.getEventById);
router.get('/categoria', role.checkRole('admin', 'tesorero', 'seminarista', 'externo'), eventosController.getEventosPorCategoria);

// Ruta temporal para activar todos los eventos (solo admin)
router.patch('/activar-todos', role.isAdmin, eventosController.activarTodosLosEventos);

// Rutas de creación y modificación (admin y tesorero)
router.post(
  '/',
  (req, res, next) => { req.tipoImagen = 'eventos'; next(); }, // Carpeta dinámica
  uploadMultiple,
  uploadMultipleToCloudinary,
  role.checkRole('admin', 'tesorero'),
  eventosController.createEvent
);
router.put(
  '/:id',
  (req, res, next) => { req.tipoImagen = 'eventos'; next(); }, // Carpeta dinámica
  uploadMultiple,
  uploadMultipleToCloudinary,
  role.checkRole('admin', 'tesorero'),
 eventosController.updateEvent
);
router.patch('/:id/disable', role.checkRole('admin', 'tesorero'), eventosController.disableEvent);
router.patch('/:id/categorizar', role.checkRole('admin', 'tesorero'), eventosController.categorizarEvento);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, eventosController.deleteEvent);
module.exports = router;