const mongoose = require('mongoose');
const Reserva = require('../models/Reservas');
const Inscripcion = require('../models/Inscripciones');
const Solicitud = require('../models/Solicitud');
const Usuario = require('../models/User');
const Evento = require('../models/Eventos');
const Cabana = require('../models/Cabana');
const Categorizacion = require('../models/categorizacion');
const Tarea = require('../models/Tarea');

// Reporte general del dashboard
exports.getDashboardReport = async (req, res) => {
  try {
    const [
      totalUsuarios,
      totalReservas,
      totalInscripciones,
      totalEventos,
      totalCabanas,
      totalSolicitudes,
      totalTareas,
      solicitudesPendientes,
      reservasActivas,
      eventosProximos
    ] = await Promise.all([
      Usuario.countDocuments(),
      Reserva.countDocuments({}), // Total de reservas sin filtro de fecha
      Inscripcion.countDocuments(),
      Evento.countDocuments({ active: true }),
      Cabana.countDocuments(),
      Solicitud.countDocuments(),
      Tarea.countDocuments(),
      Solicitud.countDocuments({ estado: { $in: ['Nueva', 'En Revisión', 'Pendiente Info'] } }),
      Reserva.countDocuments({ estado: { $in: ['Pendiente', 'Confirmada'] }, $or: [{ activo: true }, { activo: "true" }] }),// Activas por estado y activo
      Evento.countDocuments({
        fechaEvento: { $gte: new Date() },
        active: true
      })
    ]);

    const dashboard = {
      resumen: {
        totalUsuarios,
        totalReservas,
        totalInscripciones,
        totalEventos,
        totalCabanas,
        totalSolicitudes,
        totalTareas,
        solicitudesPendientes,
        reservasActivas,
        eventosProximos
      },
      fechaGeneracion: new Date()
    };

    res.json({ success: true, data: dashboard });
  } catch (error) {
      console.error('Error en getDashboardReport:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reporte de reservas
exports.getReservasReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estado, cabana } = req.query;

    let filtros = {};
    if (fechaInicio && fechaFin) {
      filtros.fechaInicio = { $gte: new Date(fechaInicio) };
      filtros.fechaFin = { $lte: new Date(fechaFin) };
    }
    if (cabana) filtros.cabana = cabana;


    let reservas = await Reserva.find(filtros)
      .populate('usuario', 'username email phone')
      .populate('cabana', 'nombre descripcion capacidad categoria estado')
      .populate('solicitud', 'estado prioridad fechaSolicitud')
      .sort({ fechaInicio: -1 });

    // Forzar el campo activo a booleano en cada reserva (por si hay datos antiguos o inconsistentes)
    reservas = reservas.map(r => {
      r.activo = typeof r.activo === 'string' ? r.activo === 'true' : Boolean(r.activo);
      return r;
    });

    // Estadísticas
    const estadisticas = {
      total: reservas.length,
      activos: reservas.filter(r => r.activo).length,
      inactivos: reservas.filter(r => !r.activo).length,
      porEstado: await Reserva.aggregate([
        { $match: filtros },
        { $group: { _id: '$estado', count: { $sum: 1 } } }
      ]),
      porCabana: await Reserva.aggregate([
        { $match: filtros },
        { $lookup: { from: 'cabanas', localField: 'cabana', foreignField: '_id', as: 'cabanaInfo' } },
        { $unwind: '$cabanaInfo' },
        { $group: { _id: '$cabanaInfo.nombre', count: { $sum: 1 } } }
      ]),
      ingresosPotenciales: await Reserva.aggregate([
        { $match: filtros },
        { $lookup: { from: 'cabanas', localField: 'cabana', foreignField: '_id', as: 'cabanaInfo' } },
        { $unwind: '$cabanaInfo' },
        { $group: { _id: null, total: { $sum: '$cabanaInfo.precio' } } }
      ])
    };

    res.json({
      success: true,
      data: {
        reservas,
        estadisticas,
        fechaGeneracion: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reporte de inscripciones
exports.getInscripcionesReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, evento, categoria } = req.query;

    let filtros = {};
    if (fechaInicio && fechaFin) {
      filtros.createdAt = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    if (evento) filtros.evento = evento;
    if (categoria) filtros.categoria = categoria;

    const inscripciones = await Inscripcion.find(filtros)
      .populate('usuario', 'username email phone')
      .populate('evento', 'name description price fecha')
      .populate('categoria', 'nombre descripcion codigo')
      .populate('solicitud', 'estado prioridad fechaSolicitud')
      .sort({ createdAt: -1 });

    // Estadísticas
    const estadisticas = {
      total: inscripciones.length,
      porEvento: await Inscripcion.aggregate([
        { $match: filtros },
        { $lookup: { from: 'eventos', localField: 'evento', foreignField: '_id', as: 'eventoInfo' } },
        { $unwind: '$eventoInfo' },
        { $group: { _id: '$eventoInfo.name', count: { $sum: 1 } } }
      ]),
      porCategoria: await Inscripcion.aggregate([
        { $match: filtros },
        { $lookup: { from: 'categorizacions', localField: 'categoria', foreignField: '_id', as: 'categoriaInfo' } },
        { $unwind: '$categoriaInfo' },
        { $group: { _id: '$categoriaInfo.nombre', count: { $sum: 1 } } }
      ]),
      ingresosPotenciales: await Inscripcion.aggregate([
        { $match: filtros },
        { $lookup: { from: 'eventos', localField: 'evento', foreignField: '_id', as: 'eventoInfo' } },
        { $unwind: '$eventoInfo' },
        { $group: { _id: null, total: { $sum: '$eventoInfo.price' } } }
      ])
    };

    res.json({
      success: true,
      data: {
        inscripciones,
        estadisticas,
        fechaGeneracion: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reporte de solicitudes
exports.getSolicitudesReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estado, tipoSolicitud, prioridad } = req.query;

    let filtros = {};
    if (fechaInicio && fechaFin) {
      filtros.fechaSolicitud = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    if (estado) filtros.estado = estado;
    if (tipoSolicitud) filtros.tipoSolicitud = tipoSolicitud;
    if (prioridad) filtros.prioridad = prioridad;

    const solicitudes = await Solicitud.find(filtros)
      .populate('solicitante', 'username email phone')
      .populate('responsable', 'username email')
      .populate('categoria', 'nombre descripcion codigo')
      .sort({ fechaSolicitud: -1 });

    // Estadísticas
    const estadisticas = {
      total: solicitudes.length,
      porEstado: await Solicitud.aggregate([
        { $match: filtros },
        { $group: { _id: '$estado', count: { $sum: 1 } } }
      ]),
      porTipo: await Solicitud.aggregate([
        { $match: filtros },
        { $group: { _id: '$tipoSolicitud', count: { $sum: 1 } } }
      ]),
      porPrioridad: await Solicitud.aggregate([
        { $match: filtros },
        { $group: { _id: '$prioridad', count: { $sum: 1 } } }
      ]),
      tiempoPromedioProcesamiento: await Solicitud.aggregate([
        {
          $match: {
            ...filtros,
            fechaRespuesta: { $exists: true },
            estado: { $in: ['Aprobada', 'Rechazada', 'Completada'] }
          }
        },
        {
          $project: {
            tiempoProcesamiento: {
              $divide: [
                { $subtract: ['$fechaRespuesta', '$fechaSolicitud'] },
                1000 * 60 * 60 * 24 // Convertir a días
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            tiempoPromedio: { $avg: '$tiempoProcesamiento' }
          }
        }
      ])
    };

    res.json({
      success: true,
      data: {
        solicitudes,
        estadisticas,
        fechaGeneracion: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reporte de usuarios
exports.getUsuariosReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, rol, activo } = req.query;

    let filtros = {};
    if (fechaInicio && fechaFin) {
      filtros.createdAt = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    if (rol) filtros.roles = { $in: [rol] };
    if (activo !== undefined) filtros.active = activo === 'true';

    const usuarios = await Usuario.find(filtros)
      .select('-password')
      .sort({ createdAt: -1 });

    // Estadísticas
    const estadisticas = {
      total: usuarios.length,
      porRol: await Usuario.aggregate([
        { $match: filtros },
        { $unwind: '$roles' },
        { $group: { _id: '$roles', count: { $sum: 1 } } }
      ]),
      activos: await Usuario.countDocuments({ ...filtros, active: true }),
      inactivos: await Usuario.countDocuments({ ...filtros, active: false }),
      registrosPorMes: await Usuario.aggregate([
        { $match: filtros },
        {
          $group: {
            _id: {
              año: { $year: '$createdAt' },
              mes: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.año': 1, '_id.mes': 1 } }
      ])
    };

    res.json({
      success: true,
      data: {
        usuarios,
        estadisticas,
        fechaGeneracion: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reporte de eventos
exports.getEventosReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, categoria, activo } = req.query;


    let filtros = {};
    // Usar el campo correcto: fechaEvento
    if (fechaInicio && fechaFin) {
      filtros.fechaEvento = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    if (categoria) filtros.categoria = categoria;
    if (activo !== undefined) filtros.active = (activo === 'true' || activo === true);


    const eventos = await Evento.find(filtros)
      .populate('categoria', 'nombre descripcion codigo')
      .sort({ fechaEvento: -1 });

    // Obtener inscripciones por evento
    const eventosConInscripciones = await Promise.all(
      eventos.map(async (evento) => {
        const inscripciones = await Inscripcion.countDocuments({ evento: evento._id });
        return {
          ...evento.toObject(),
          totalInscripciones: inscripciones
        };
      })
    );

    // Estadísticas
    const estadisticas = {
      total: eventos.length,
      activos: await Evento.countDocuments({ ...filtros, active: true }),
      inactivos: await Evento.countDocuments({ ...filtros, active: false }),
      porCategoria: await Evento.aggregate([
        { $match: filtros },
        { $lookup: { from: 'categorizacions', localField: 'categoria', foreignField: '_id', as: 'categoriaInfo' } },
        { $unwind: '$categoriaInfo' },
        { $group: { _id: '$categoriaInfo.nombre', count: { $sum: 1 } } }
      ]),
      ingresosPotenciales: await Evento.aggregate([
        { $match: filtros },
        { $group: { _id: null, total: { $sum: '$precio' } } }
      ])
    };

    res.json({
      success: true,
      data: {
        eventos: eventosConInscripciones,
        estadisticas,
        fechaGeneracion: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reporte financiero consolidado
exports.getReporteFinanciero = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let filtrosFecha = {};
    if (fechaInicio && fechaFin) {
      filtrosFecha = {
        createdAt: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin)
        }
      };
    }

    // Ingresos por reservas
    const ingresosCabanas = await Reserva.aggregate([
      { $match: filtrosFecha },
      { $lookup: { from: 'cabanas', localField: 'cabana', foreignField: '_id', as: 'cabanaInfo' } },
      { $unwind: '$cabanaInfo' },
      {
        $group: {
          _id: null,
          totalReservas: { $sum: 1 },
          ingresoTotal: { $sum: '$cabanaInfo.precio' },
          promedioPorReserva: { $avg: '$cabanaInfo.precio' }
        }
      }
    ]);

    // Ingresos por eventos
    const ingresosEventos = await Inscripcion.aggregate([
      { $match: filtrosFecha },
      { $lookup: { from: 'eventos', localField: 'evento', foreignField: '_id', as: 'eventoInfo' } },
      { $unwind: '$eventoInfo' },
      {
        $group: {
          _id: null,
          totalInscripciones: { $sum: 1 },
          ingresoTotal: { $sum: '$eventoInfo.price' },
          promedioPorInscripcion: { $avg: '$eventoInfo.price' }
        }
      }
    ]);

    const reporte = {
      cabanas: ingresosCabanas[0] || { totalReservas: 0, ingresoTotal: 0, promedioPorReserva: 0 },
      eventos: ingresosEventos[0] || { totalInscripciones: 0, ingresoTotal: 0, promedioPorInscripcion: 0 },
      resumen: {
        ingresoTotalConsolidado:
          (ingresosCabanas[0]?.ingresoTotal || 0) + (ingresosEventos[0]?.ingresoTotal || 0),
        transaccionesTotales:
          (ingresosCabanas[0]?.totalReservas || 0) + (ingresosEventos[0]?.totalInscripciones || 0)
      },
      fechaGeneracion: new Date()
    };

    res.json({ success: true, data: reporte });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reporte de actividad por usuario
exports.getActividadUsuarios = async (req, res) => {
  try {
    const { usuarioId, fechaInicio, fechaFin } = req.query;

    let filtros = {};
    if (usuarioId) filtros.usuario = usuarioId;
    if (fechaInicio && fechaFin) {
      filtros.createdAt = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }

    const [reservas, inscripciones, solicitudes] = await Promise.all([
      Reserva.find(filtros)
        .populate('usuario', 'username email')
        .populate('cabana', 'nombre precio'),
      Inscripcion.find(filtros)
        .populate('usuario', 'username email')
        .populate('evento', 'name price'),
      Solicitud.find({ solicitante: usuarioId, ...filtros })
        .populate('solicitante', 'username email')
    ]);

    const actividad = {
      usuario: usuarioId ? await Usuario.findById(usuarioId).select('-password') : null,
      reservas: {
        total: reservas.length,
        datos: reservas
      },
      inscripciones: {
        total: inscripciones.length,
        datos: inscripciones
      },
      solicitudes: {
        total: solicitudes.length,
        datos: solicitudes
      },
      resumen: {
        actividadTotal: reservas.length + inscripciones.length + solicitudes.length
      },
      fechaGeneracion: new Date()
    };

    res.json({ success: true, data: actividad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};