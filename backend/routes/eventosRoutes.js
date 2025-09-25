const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { authJwt, role } = require('../middlewares');
const { body } = require('express-validator');
const {uploadMultiple} = require('../middlewares/upload');

// Validaciones para el evento
const validarEvento = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  body('price').isNumeric().withMessage('El precio debe ser numérico'),
  body('categoria').isMongoId().withMessage('ID de categoría inválido')
];


// Rutas públicas (sin autenticación)
router.get('/publicos', eventosController.getPublicEvents);

// Middleware de autenticación para rutas protegidas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', eventosController.getAllEvents);
router.get('/:id', eventosController.getEventById);
router.get('/categoria', eventosController.getEventosPorCategoria);

// Ruta temporal para activar todos los eventos (solo admin)
router.patch('/activar-todos', role.isAdmin, eventosController.activarTodosLosEventos);

// Rutas de creación y modificación (admin y tesorero)
router.post('/',(req, res, next) => { req.tipoImagen = 'eventos'; next(); },uploadMultiple, role.checkRole('admin', 'tesorero'), validarEvento, eventosController.createEvent);
router.put('/:id', (req, res, next) => { req.tipoImagen = 'eventos'; next(); },uploadMultiple, role.checkRole('admin', 'tesorero'), eventosController.updateEvent);
router.patch('/:id/disable', role.checkRole('admin', 'tesorero'), eventosController.disableEvent);
router.patch('/:id/categorizar', role.checkRole('admin', 'tesorero'), eventosController.categorizarEvento);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, eventosController.deleteEvent);
module.exports = router;