const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { authJwt, role } = require('../middlewares');
const Inscripcion = require('../models/Inscripciones');
const Reserva = require('../models/Reservas');
const Solicitud = require('../models/Solicitud');

// Validaciones para crear y actualizar solicitud
const validarSolicitud = [
  body('solicitante')
    .trim()
    .notEmpty()
    .withMessage('El nombre del solicitante es requerido'),
  body('correo')
    .trim()
    .isEmail()
    .withMessage('Email inválido'),
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido'),
  body('tipoSolicitud')
    .isIn(['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Administrativa', 'Otra'])
    .withMessage('Tipo de solicitud inválido'),
  body('modeloReferencia')
    .optional()
    .isIn(['Eventos', 'Cabana', 'Inscripcion', 'Reserva', 'ProgramaAcademico', 'Comedor'])
    .withMessage('Modelo de referencia debe ser Eventos, Cabana, Inscripcion, Reserva, ProgramaAcademico o Comedor'),
  body('referencia')
    .optional()
    .isMongoId()
    .withMessage('ID de referencia inválido'),
  body('categoria')
    .isMongoId()
    .withMessage('ID de categoría inválido'),
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida'),
  body('prioridad')
    .isIn(['Alta', 'Media', 'Baja'])
    .withMessage('Prioridad inválida'),
  body('responsable')
    .isMongoId()
    .withMessage('ID de responsable inválido')
];

// Validación para ID
const validarId = [
  param('id').isMongoId().withMessage('ID inválido')
];

// Validaciones específicas para actualización
const validarActualizacion = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('estado')
    .optional()
    .isIn(['Nueva', 'En Revisión', 'Aprobada', 'Rechazada', 'Completada', 'Pendiente Info'])
    .withMessage('Estado inválido'),
  body('prioridad')
    .optional()
    .isIn(['Alta', 'Media', 'Baja'])
    .withMessage('Prioridad inválida'),
  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres'),
  body('tipoSolicitud')
    .optional()
    .isIn(['Inscripción', 'Hospedaje', 'Alimentación', 'Otra'])
    .withMessage('Tipo de solicitud inválido')
];

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta - Todos los roles autenticados
router.get('/usuario/:id', solicitudController.obtenerSolicitudesPorUsuario);
router.get('/unificado', async (req, res) => {
  try {
    const solicitudes = await Solicitud.find()
      .populate('solicitante', 'nombre apellido correo')
      .populate('categoria', 'nombre descripcion codigo')
      .populate('responsable', 'nombre apellido correo')
      .lean();

    const inscripciones = await Inscripcion.find()
      .populate('usuario', 'nombre apellido correo')
      .populate('evento', 'nombre')
      .populate('categoria', 'nombre descripcion codigo')
      .lean();

    const reservas = await Reserva.find()
      .populate('cabana', 'nombre descripcion capacidad categoria estado')
      .lean();

    res.json({
      success: true,
      data: {
        solicitudes,
        inscripciones,
        reservas
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rutas de consulta - Solo admin y tesorero
router.get('/',solicitudController.obtenerSolicitudes);
router.get('/:id', validarId, solicitudController.obtenerSolicitudPorId);

// Rutas de creación - Admin, tesorero, seminarista y externo pueden crear solicitudes
router.post('/', solicitudController.crearSolicitud);

// Rutas de modificación - Solo admin y tesorero
router.put('/:id', validarActualizacion, solicitudController.actualizarSolicitud);

// Rutas de eliminación - Solo admin
router.delete('/:id', role.isAdmin, validarId, solicitudController.eliminarSolicitud);

module.exports = router;