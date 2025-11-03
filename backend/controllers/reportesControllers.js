

const mongoose = require('mongoose');
const Reserva = require('../models/Reservas');
const Inscripcion = require('../models/Inscripciones');
const Solicitud = require('../models/Solicitud');
const Usuario = require('../models/User');
const Evento = require('../models/Eventos');
const Cabana = require('../models/Cabana');
const Categorizacion = require('../models/categorizacion');
const Tarea = require('../models/Tarea');
const Reporte = require('../models/Reportes');

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
    const { fechaInicio, fechaFin, cabana } = req.query;

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
    if (evento) filtros.referencia = evento;
    if (categoria) filtros.categoria = categoria;

    const inscripciones = await Inscripcion.find(filtros)
      .populate('usuario', 'username email phone')
      .populate('referencia')
      .populate('categoria', 'nombre descripcion codigo')
      .populate('solicitud', 'estado prioridad fechaSolicitud')
      .sort({ createdAt: -1 });

    // Estadísticas
    const estadisticas = {
      total: inscripciones.length,
      porReferencia: await Inscripcion.aggregate([
        { $match: filtros },
        { $lookup: { from: 'eventos', localField: 'referencia', foreignField: '_id', as: 'eventoInfo' } },
        { $lookup: { from: 'programaacademicos', localField: 'referencia', foreignField: '_id', as: 'programaInfo' } },
        { $project: {
          referenciaNombre: {
            $cond: [
             { $eq: ['$tipoReferencia', 'Evento'] },
             { $ifNull: [{ $arrayElemAt: ['$eventoInfo.name', 0] }, 'Evento sin nombre'] },
             { $ifNull: [{ $arrayElemAt: ['$programaInfo.nombre', 0] }, 'Programa sin nombre'] }
            ]
          }
        }},
        { $group: { _id: '$referenciaNombre', count: { $sum: 1 } } }
      ]),
      porCategoria: await Inscripcion.aggregate([
        { $match: filtros },
        { $lookup: { from: 'categorizacions', localField: 'categoria', foreignField: '_id', as: 'categoriaInfo' } },
        { $unwind: '$categoriaInfo' },
        { $group: { _id: '$categoriaInfo.nombre', count: { $sum: 1 } } }
      ]),
      porTipoReferencia: await Inscripcion.aggregate([
        { $match: filtros },
        { $group: { _id: '$tipoReferencia', count: { $sum: 1 } } }
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
        const inscripciones = await Inscripcion.countDocuments({ referencia: evento._id, tipoReferencia: 'Evento' });
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

// Obtener todos los reportes guardados
exports.getReportesGuardados = async (req, res) => {
  try {
    const reportes = await Reporte.find().populate('creadoPor', 'username email');
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Función auxiliar para normalizar filtros
function normalizarFiltros(filtrosInput) {
  return {
    fechaInicio: filtrosInput.fechaInicio ? new Date(filtrosInput.fechaInicio) : null,
    fechaFin: filtrosInput.fechaFin ? new Date(filtrosInput.fechaFin) : null,
    estado: typeof filtrosInput.estado === 'string' ? filtrosInput.estado : '',
    categoria: '',
    usuario: '',
    otros: filtrosInput.otros || {}
  };
}

// Función auxiliar para resolver categoría
async function resolverCategoria(categoria) {
  if (!categoria) return { filtrosToSave: '', queryCategoriaForDB: null };
  
  if (mongoose.Types.ObjectId.isValid(categoria)) {
    const categoriaObjById = await Categorizacion.findById(categoria).select('nombre');
    if (categoriaObjById) {
      return {
        filtrosToSave: categoriaObjById.nombre || String(categoria),
        queryCategoriaForDB: categoriaObjById._id
      };
    }
    return {
      filtrosToSave: String(categoria),
      queryCategoriaForDB: categoria
    };
  }
  
    const categoriaEscapada = String(categoria).replaceAll(/[.*+?^${}()|[\]\\]/g, '$&');
    const categoriaObj = await Categorizacion.findOne({ 
      nombre: { $regex: String.raw`^${categoriaEscapada}$`, $options: 'i' } 
    });
  return {
    filtrosToSave: String(categoria).trim(),
    queryCategoriaForDB: categoriaObj?._id || null
  };
}

// Función auxiliar para resolver usuario
async function resolverUsuario(usuario) {
  if (!usuario) return { filtrosToSave: '', queryUsuarioForDB: null };
  
  if (mongoose.Types.ObjectId.isValid(usuario)) {
    const usuarioObjById = await Usuario.findById(usuario).select('username email');
    if (usuarioObjById) {
      return {
        filtrosToSave: usuarioObjById.username || usuarioObjById.email || String(usuario),
        queryUsuarioForDB: usuarioObjById._id
      };
    }
    return {
      filtrosToSave: String(usuario),
      queryUsuarioForDB: usuario
    };
  }
  
  const usuarioObj = await Usuario.findOne({ $or: [{ username: usuario }, { email: usuario }] }).select('_id');
  return {
    filtrosToSave: String(usuario).trim(),
    queryUsuarioForDB: usuarioObj?._id || null
  };
}

// Función auxiliar para generar estadísticas por estado
function generarEstadisticasPorEstado(elementos, campoEstado = 'estado') {
  const porEstado = {};
  for (const elemento of elementos) {
    const estado = elemento[campoEstado] || 'Sin estado';
    porEstado[estado] = (porEstado[estado] || 0) + 1;
  }
  return Object.entries(porEstado).map(([estado, count]) => ({ _id: estado, count }));
}

// Función auxiliar para generar estadísticas por mes
function generarEstadisticasPorMes(elementos, campoFecha) {
  const registrosPorMes = {};
  for (const elemento of elementos) {
    if (elemento[campoFecha]) {
      const fecha = new Date(elemento[campoFecha]);
      const mes = fecha.getMonth() + 1;
      const año = fecha.getFullYear();
      const clave = `${mes}/${año}`;
      registrosPorMes[clave] = (registrosPorMes[clave] || 0) + 1;
    }
  }
  return Object.entries(registrosPorMes)
    .sort(([a], [b]) => {
      const [aMonth, aYear] = a.split('/').map(Number);
      const [bMonth, bYear] = b.split('/').map(Number);
      return aYear - bYear || aMonth - bMonth;
    })
    .map(([mes, count]) => ({ _id: { mes: mes.split('/')[0], año: mes.split('/')[1] }, count }));
}

// Función auxiliar para generar reporte de reservas
async function generarReporteReservas(filtrosInput, queryCategoriaForDB, queryUsuarioForDB) {
  const query = {};
  if (filtrosInput?.fechaInicio && filtrosInput?.fechaFin) {
    query.fechaInicio = { $gte: new Date(filtrosInput.fechaInicio) };
    query.fechaFin = { $lte: new Date(filtrosInput.fechaFin) };
  }
  if (filtrosInput?.estado) query.estado = filtrosInput.estado;
  if (queryCategoriaForDB) query.categoria = queryCategoriaForDB;
  if (queryUsuarioForDB) query.usuario = queryUsuarioForDB;

  const reservas = await Reserva.find(query)
    .populate('usuario', 'username email phone')
    .populate('cabana', 'nombre descripcion capacidad categoria estado')
    .sort({ fechaInicio: -1 });

  const reservasNorm = reservas.map(r => {
    r.activo = typeof r.activo === 'string' ? r.activo === 'true' : Boolean(r.activo);
    return r;
  });

  return {
    reservas: reservasNorm,
    estadisticas: {
      total: reservasNorm.length,
      activos: reservasNorm.filter(r => r.activo).length,
      inactivos: reservasNorm.filter(r => !r.activo).length,
      porEstado: generarEstadisticasPorEstado(reservasNorm),
      registrosPorMes: generarEstadisticasPorMes(reservasNorm, 'fechaInicio')
    }
  };
}

// Función auxiliar para generar reporte de inscripciones
async function generarReporteInscripciones(filtrosInput, queryCategoriaForDB, queryUsuarioForDB) {
  const query = {};
  if (filtrosInput?.fechaInicio && filtrosInput?.fechaFin) {
    query.createdAt = { $gte: new Date(filtrosInput.fechaInicio), $lte: new Date(filtrosInput.fechaFin) };
  }
  if (queryCategoriaForDB) query.categoria = queryCategoriaForDB;
  if (queryUsuarioForDB) query.usuario = queryUsuarioForDB;

  const inscripciones = await Inscripcion.find(query)
    .populate('usuario', 'username email phone')
    .populate('referencia')
    .populate('categoria', 'nombre descripcion codigo')
    .sort({ createdAt: -1 });

  const porReferencia = {};
  for (const inscripcion of inscripciones) {
    let referenciaNombre = 'Sin referencia';
    if (inscripcion.referencia) {
      if (inscripcion.tipoReferencia === 'Eventos') {
        referenciaNombre = inscripcion.referencia.name || 'Evento sin nombre';
      } else if (inscripcion.tipoReferencia === 'ProgramaAcademico') {
        referenciaNombre = inscripcion.referencia.nombre || 'Programa sin nombre';
      } else {
        referenciaNombre = inscripcion.referencia.nombre || inscripcion.referencia.name || 'Referencia sin nombre';
      }
    }
    porReferencia[referenciaNombre] = (porReferencia[referenciaNombre] || 0) + 1;
  }

  return {
    inscripciones,
    estadisticas: {
      total: inscripciones.length,
      porReferencia: Object.entries(porReferencia).map(([referencia, count]) => ({ _id: referencia, count })),
      registrosPorMes: generarEstadisticasPorMes(inscripciones, 'createdAt')
    }
  };
}

// Función auxiliar para generar datos según tipo de reporte
async function generarDatosReporte(tipo, filtrosInput, queryCategoriaForDB, queryUsuarioForDB) {
  switch (tipo) {
    case 'reservas':
      return await generarReporteReservas(filtrosInput, queryCategoriaForDB, queryUsuarioForDB);
    case 'inscripciones':
      return await generarReporteInscripciones(filtrosInput, queryCategoriaForDB, queryUsuarioForDB);
    default:
      return { mensaje: 'Tipo de reporte no soportado' };
  }
}

// Guardar un reporte generado en la base de datos
exports.guardarReporte = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, filtros, formatoExportacion } = req.body;
    const creadoPor = req.user?._id || null;

    if (!nombre || !descripcion || !tipo) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }

    const filtrosInput = filtros || {};
    const filtrosToSave = normalizarFiltros(filtrosInput);

    const categoriaResult = await resolverCategoria(filtrosInput.categoria);
    filtrosToSave.categoria = categoriaResult.filtrosToSave;
    const queryCategoriaForDB = categoriaResult.queryCategoriaForDB;

    const usuarioResult = await resolverUsuario(filtrosInput.usuario);
    filtrosToSave.usuario = usuarioResult.filtrosToSave;
    const queryUsuarioForDB = usuarioResult.queryUsuarioForDB;

    const startedAt = Date.now();
    const datos = await generarDatosReporte(tipo, filtrosInput, queryCategoriaForDB, queryUsuarioForDB);
    const tiempoGeneracion = Date.now() - startedAt;

    const formatosAceptados = new Set(['pdf', 'excel', 'csv', 'json']);
    const formatos = Array.isArray(formatoExportacion) && formatoExportacion.length > 0
      ? formatoExportacion.filter(f => formatosAceptados.has(f))
      : ['json'];

    const reporteToSave = new Reporte({
      nombre,
      descripcion,
      tipo,
      filtros: filtrosToSave,
      datos: datos || {},
      creadoPor,
      fechaGeneracion: new Date(),
      estado: (datos && Object.keys(datos).length > 0) ? 'generado' : 'error',
      metadatos: {
        tiempoGeneracion,
        version: '1.0',
        formatoExportacion: formatos
      }
    });

    await reporteToSave.save();
    res.status(201).json({ success: true, message: 'Reporte guardado correctamente', data: reporteToSave });
  } catch (error) {
    console.error('Error al guardar el reporte:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Editar un reporte guardado por ID
exports.editarReporteGuardado = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se proporcionaron datos para actualizar' 
      });
    }
    
    const reporteActualizado = await Reporte.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!reporteActualizado) {
      return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    }
    
    res.json({ success: true, message: 'Reporte actualizado correctamente', data: reporteActualizado });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar un reporte guardado por ID
exports.eliminarReporteGuardado = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByIdAndDelete(id);
    if (!reporte) {
      return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    }
    res.json({ success: true, message: 'Reporte eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

