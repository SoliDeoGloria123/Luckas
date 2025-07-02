const Solicitud = require('../models/Solicitud');
const { validationResult } = require('express-validator');

// Obtener todas las solicitudes con filtros
exports.obtenerSolicitudes = async (req, res) => {
    try {
      const { 
        categoria, 
        estado, 
        prioridad, 
        responsable,
        fechaDesde,
        fechaHasta,
        page = 1, 
        limit = 10,
        sortBy = 'fechaSolicitud',
        sortOrder = 'desc'
      } = req.query;

      // Construir filtros
      const filtros = {};
      
      if (categoria && categoria !== 'todas') filtros.categoria = categoria;
      if (estado && estado !== 'todos') filtros.estado = estado;
      if (prioridad && prioridad !== 'todas') filtros.prioridad = prioridad;
      if (responsable) filtros.responsableAsignado = responsable;
      
      // Filtro por fechas
      if (fechaDesde || fechaHasta) {
        filtros.fechaSolicitud = {};
        if (fechaDesde) filtros.fechaSolicitud.$gte = new Date(fechaDesde);
        if (fechaHasta) filtros.fechaSolicitud.$lte = new Date(fechaHasta);
      }

      // Configurar paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Ejecutar consulta
      const solicitudes = await Solicitud.find(filtros)
        .populate('solicitante', 'username nombre correo telefono role')
        .populate('categoria', 'nombre descripcion codigo')
        .populate('responsable', 'username nombre email')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Contar total para paginación
      const total = await Solicitud.countDocuments(filtros);

      // Estadísticas
      const estadisticas = await Solicitud.aggregate([
        { $match: filtros },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            nuevas: { $sum: { $cond: [{ $eq: ['$estado', 'Nueva'] }, 1, 0] } },
            enRevision: { $sum: { $cond: [{ $eq: ['$estado', 'En Revisión'] }, 1, 0] } },
            urgentes: { $sum: { $cond: [{ $eq: ['$prioridad', 'Urgente'] }, 1, 0] } },
            completadas: { $sum: { $cond: [{ $eq: ['$estado', 'Completada'] }, 1, 0] } }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: solicitudes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        },
        estadisticas: estadisticas[0] || {
          total: 0, nuevas: 0, enRevision: 0, urgentes: 0, completadas: 0
        }
      });

    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Obtener solicitud por ID
  exports.obtenerSolicitudPorId = async (req, res) => {
    try {
      const { id } = req.params;
      
      const solicitud = await Solicitud.findById(id);
      
      if (!solicitud) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: solicitud
      });

    } catch (error) {
      console.error('Error al obtener solicitud:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Crear nueva solicitud
  exports.crearSolicitud = async (req, res) => {
    try {
      // Validar errores de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      // Validación personalizada para modeloReferencia y referencia
      const { tipoSolicitud, modeloReferencia, referencia } = req.body;
      
      if ((tipoSolicitud === 'Inscripción' || tipoSolicitud === 'Hospedaje')) {
        if (!modeloReferencia) {
          return res.status(400).json({
            success: false,
            message: 'modeloReferencia es requerido para solicitudes de Inscripción y Hospedaje'
          });
        }
        
        if (tipoSolicitud === 'Inscripción' && modeloReferencia !== 'Eventos') {
          return res.status(400).json({
            success: false,
            message: 'Para solicitudes de Inscripción, modeloReferencia debe ser "Eventos"'
          });
        }
        
        if (tipoSolicitud === 'Hospedaje' && modeloReferencia !== 'Cabana') {
          return res.status(400).json({
            success: false,
            message: 'Para solicitudes de Hospedaje, modeloReferencia debe ser "Cabana"'
          });
        }
      }

      const nuevaSolicitud = new Solicitud({
        solicitante: req.body.solicitante,
        correo: req.body.correo,
        telefono: req.body.telefono,
        tipoSolicitud: req.body.tipoSolicitud,
        modeloReferencia: req.body.modeloReferencia,
        referencia: req.body.referencia,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        estado: req.body.estado || 'Nueva',
        prioridad: req.body.prioridad,
        observaciones: req.body.observaciones,
        fechaSolicitud: req.body.fechaSolicitud,
        responsable: req.body.responsable
      });

      const solicitudGuardada = await nuevaSolicitud.save();

      res.status(201).json({
        success: true,
        message: 'Solicitud creada exitosamente',
        data: solicitudGuardada
      });

    } catch (error) {
      console.error('Error al crear solicitud:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la solicitud',
        error: error.message
      });
    }
  };

  // Actualizar solicitud
  exports.actualizarSolicitud = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validar errores de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const datosActualizacion = {
        ...req.body,
        modificadoPor: req.user?.id // Si tienes autenticación
      };

      const solicitudActualizada = await Solicitud.findByIdAndUpdate(
        id,
        datosActualizacion,
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!solicitudActualizada) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Solicitud actualizada exitosamente',
        data: solicitudActualizada
      });

    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Eliminar solicitud
  exports.eliminarSolicitud = async (req, res) => {
    try {
      const solicitud = await Solicitud.findById(req.params.id);
      if (!solicitud) {
        return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      }
      // Solo admin o creador puede eliminar
      if (req.userRole !== 'admin' && solicitud.creadoPor.toString() !== req.userId) {
        return res.status(403).json({ success: false, message: 'No autorizado' });
      }
      await solicitud.deleteOne();
      res.status(200).json({ success: true, message: 'Solicitud eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
  };

  // Categorizar solicitud (cambiar categoría)
  exports.categorizarSolicitud = async (req, res) => {
    try {
      const { id } = req.params;
      const { categoria } = req.body;

      if (!categoria) {
        return res.status(400).json({
          success: false,
          message: 'La categoría es requerida'
        });
      }

      const solicitudActualizada = await Solicitud.findByIdAndUpdate(
        id,
        { 
          categoria,
          modificadoPor: req.user?.id
        },
        { new: true, runValidators: true }
      );

      if (!solicitudActualizada) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Solicitud categorizada exitosamente',
        data: solicitudActualizada
      });

    } catch (error) {
      console.error('Error al categorizar solicitud:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Asignar responsable
  exports.asignarResponsable = async (req, res) => {
    try {
      const { id } = req.params;
      const { responsableAsignado } = req.body;

      const solicitudActualizada = await Solicitud.findByIdAndUpdate(
        id,
        { 
          responsableAsignado,
          estado: responsableAsignado ? 'En Revisión' : 'Nueva',
          modificadoPor: req.user?.id
        },
        { new: true, runValidators: true }
      );

      if (!solicitudActualizada) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Responsable asignado exitosamente',
        data: solicitudActualizada
      });

    } catch (error) {
      console.error('Error al asignar responsable:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Obtener estadísticas por categoría
  exports.obtenerEstadisticasPorCategoria = async (req, res) => {
    try {
      const estadisticas = await Solicitud.aggregate([
        {
          $group: {
            _id: '$categoria',
            total: { $sum: 1 },
            nuevas: { $sum: { $cond: [{ $eq: ['$estado', 'Nueva'] }, 1, 0] } },
            enRevision: { $sum: { $cond: [{ $eq: ['$estado', 'En Revisión'] }, 1, 0] } },
            completadas: { $sum: { $cond: [{ $eq: ['$estado', 'Completada'] }, 1, 0] } },
            urgentes: { $sum: { $cond: [{ $eq: ['$prioridad', 'Urgente'] }, 1, 0] } }
          }
        },
        {
          $sort: { total: -1 }
        }
      ]);

      res.status(200).json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Consultar solicitudes por usuario autenticado
exports.obtenerSolicitudesPorUsuario = async (req, res) => {
  try {
    // Busca solicitudes creadas por el usuario autenticado
    const solicitudes = await Solicitud.find({ creadoPor: req.userId });
    res.status(200).json({
      success: true,
      data: solicitudes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus solicitudes',
      error: error.message
    });
  }
};

