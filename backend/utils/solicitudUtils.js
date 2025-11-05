// backend/utils/solicitudUtils.js

/**
 * Construye filtros para consultas de solicitudes
 * @param {Object} query - Query parameters de la request
 * @returns {Object} - Objeto de filtros para MongoDB
 */
function construirFiltros(query) {
  const { categoria, estado, prioridad, responsable, fechaDesde, fechaHasta } = query;
  const filtros = {};
  if (categoria && categoria !== 'todos') filtros.categoria = categoria;
  if (estado && estado !== 'todos') filtros.estado = estado;
  if (prioridad && prioridad !== 'todos') filtros.prioridad = prioridad;
  if (responsable) filtros.responsableAsignado = responsable;
  if (fechaDesde || fechaHasta) {
    filtros.fechaSolicitud = {};
    if (fechaDesde) filtros.fechaSolicitud.$gte = new Date(fechaDesde);
    if (fechaHasta) filtros.fechaSolicitud.$lte = new Date(fechaHasta);
  }
  return filtros;
}

/**
 * Configura parámetros de paginación
 * @param {Object} query - Query parameters de la request
 * @returns {Object} - Configuración de paginación {skip, limit, page}
 */
function configurarPaginacion(query) {
  const page = Number.parseInt(query.page) || 1;
  const limit = Number.parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { skip, limit, page };
}

/**
 * Genera pipeline de agregación para estadísticas de solicitudes
 * @param {Object} filtros - Filtros aplicados a la consulta
 * @returns {Array} - Pipeline de agregación para MongoDB
 */
function generarPipelineEstadisticasSolicitudes(filtros) {
  return [
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
  ];
}

module.exports = { 
  construirFiltros, 
  configurarPaginacion, 
  generarPipelineEstadisticasSolicitudes 
};