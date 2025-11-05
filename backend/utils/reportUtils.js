// backend/utils/reportUtils.js

/**
 * Construye filtros de fecha para consultas de MongoDB
 * @param {Object} query - Query parameters que contienen fechaInicio y fechaFin
 * @returns {Object} - Objeto de filtros de fecha
 */
function construirFiltrosFecha(query) {
  const { fechaInicio, fechaFin } = query;
  const filtrosFecha = {};
  
  if (fechaInicio || fechaFin) {
    filtrosFecha.fechaCreacion = {};
    if (fechaInicio) filtrosFecha.fechaCreacion.$gte = new Date(fechaInicio);
    if (fechaFin) filtrosFecha.fechaCreacion.$lte = new Date(fechaFin);
  }
  
  return filtrosFecha;
}

/**
 * Genera estadísticas agregadas básicas
 * @param {Object} modelo - Modelo de MongoDB
 * @param {Object} filtros - Filtros para la consulta
 * @param {Array} agregaciones - Pipeline de agregación personalizada
 * @returns {Promise<Object>} - Estadísticas agregadas
 */
async function generarEstadisticasAgregadas(modelo, filtros, agregaciones = []) {
  try {
    const pipelineBase = [{ $match: filtros }];
    const pipeline = [...pipelineBase, ...agregaciones];
    return await modelo.aggregate(pipeline);
  } catch (error) {
    console.error('Error en agregación:', error);
    return [];
  }
}

/**
 * Construye respuesta estándar para reportes
 * @param {Object} data - Datos del reporte
 * @param {Object} estadisticas - Estadísticas del reporte
 * @returns {Object} - Respuesta estandarizada
 */
function construirRespuestaReporte(data, estadisticas = {}) {
  return {
    success: true,
    data,
    estadisticas,
    fechaGeneracion: new Date(),
    metadata: {
      total: Array.isArray(data) ? data.length : 0
    }
  };
}

module.exports = {
  construirFiltrosFecha,
  generarEstadisticasAgregadas,
  construirRespuestaReporte
};