// Helpers para generación de datos de reportes (tendencia y distribución)
// Exporta funciones reutilizables para reducir duplicación en ReportesTabla.jsx

export const extraerDataArray = (datos) => {
  if (!datos) return [];
  if (datos.usuarios) return datos.usuarios;
  if (datos.inscripciones) return datos.inscripciones;
  if (datos.reservas) return datos.reservas;
  if (datos.eventos) return datos.eventos;
  if (datos.solicitudes) return datos.solicitudes;
  if (Array.isArray(datos)) return datos;
  return [];
};

export const countBy = (arr, keyFn) => {
  const counts = {};
  for (const item of arr) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

export const generarDistribucionReservas = (dataArray) =>
  countBy(dataArray, (r) => r.estado || r.status || 'Sin estado');

export const generarDistribucionInscripciones = (dataArray) =>
  countBy(
    dataArray,
    (i) => i.referencia?.name || i.referencia?.nombre || i.programa || i.evento?.name || i.evento?.nombre || 'Sin referencia'
  );

export const generarDistribucionSolicitudes = (dataArray) =>
  countBy(dataArray, (s) => s.estado || 'Sin estado');

export const generarDistribucionCabanas = (dataArray) =>
  countBy(dataArray, (c) => (c.disponible ? 'Disponibles' : 'No disponibles'));

export const generarDistribucionTareas = (dataArray) =>
  countBy(dataArray, (t) => (t.estado || (t.completada ? 'Completadas' : 'Pendientes')));

export const generarDistribucionProgramas = (dataArray) =>
  countBy(dataArray, (p) => (p.activo ? 'Activos' : 'Inactivos')).filter((d) => d.value > 0);

export const generarDistribucionUsuarios = (dataArray) =>
  countBy(dataArray, (u) => u.role || u.rol || u.tipo || 'Sin rol');

export const generarDistribucionEventos = (dataArray) =>
  countBy(dataArray, (e) => e.estado || e.status || e.tipo || 'Sin estado');

export const obtenerDistribucionPorTipo = (tipoReporte, dataArray) => {
  const distribuidores = {
    usuarios: generarDistribucionUsuarios,
    eventos: generarDistribucionEventos,
    reservas: generarDistribucionReservas,
    inscripciones: generarDistribucionInscripciones,
    solicitudes: generarDistribucionSolicitudes,
    'cabañas': generarDistribucionCabanas,
    cabanas: generarDistribucionCabanas,
    tareas: generarDistribucionTareas,
    programas: generarDistribucionProgramas,
  };

  const distribuidor = distribuidores[tipoReporte];
  return distribuidor ? distribuidor(dataArray) : [];
};

export const extraerFechaDelItem = (item) => {
  if (!item) return null;
  if (item.fechaEvento) return new Date(item.fechaEvento);
  if (item.createdAt) return new Date(item.createdAt);
  if (item.fechaRegistro) return new Date(item.fechaRegistro);
  if (item.fecha) return new Date(item.fecha);
  if (item.fechaInicio) return new Date(item.fechaInicio);
  return null;
};

export const generarTendenciaTemporal = (dataArray) => {
  const monthCount = {};
  for (const item of dataArray) {
    const date = extraerFechaDelItem(item);
    if (date && !Number.isNaN(date.getTime())) {
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
    }
  }
  return Object.entries(monthCount)
    .sort(([a], [b]) => {
      const [aMonth, aYear] = a.split('/').map(Number);
      const [bMonth, bYear] = b.split('/').map(Number);
      return aYear - bYear || aMonth - bMonth;
    })
    .map(([mes, total]) => ({ mes, total }));
};

export const generateChartsFromRawData = (activeReport) => {
  if (!activeReport) return { trend: [], distribution: [] };
  const datos = activeReport.datos;
  const tipoReporte = activeReport.tipo || activeReport.type;
  const dataArray = extraerDataArray(datos);
  if (!dataArray || dataArray.length === 0) return { trend: [], distribution: [] };
  const distribution = obtenerDistribucionPorTipo(tipoReporte, dataArray);
  const trend = generarTendenciaTemporal(dataArray);
  return { trend, distribution };
};

export const generateChartData = (activeReport) => {
  if (!activeReport || !activeReport.datos) return { trend: [], distribution: [] };
  const est = activeReport.datos.estadisticas || {};
  if (!est || Object.keys(est).length === 0) return generateChartsFromRawData(activeReport);

  let distribution = [];
  if (est.porRol) distribution = est.porRol.map((e) => ({ name: e._id, value: e.count }));
  else if (est.porEstado) distribution = est.porEstado.map((e) => ({ name: e._id, value: e.count }));
  else if (est.porCategoria) distribution = est.porCategoria.map((e) => ({ name: e._id, value: e.count }));
  else if (est.porEvento) distribution = est.porEvento.map((e) => ({ name: e._id, value: e.count }));
  else if (est.porReferencia) distribution = est.porReferencia.map((e) => ({ name: e._id, value: e.count }));
  else if (est.porTipoReferencia) distribution = est.porTipoReferencia.map((e) => ({ name: e._id, value: e.count }));
  else if (est.porTipo) distribution = est.porTipo.map((e) => ({ name: e._id, value: e.count }));

  let trend = [];
  if (est.registrosPorMes) {
    trend = est.registrosPorMes.map((e) => ({ mes: e._id.mes ? `${e._id.mes}/${e._id.año}` : e._id, total: e.count }));
  } else if (est.registrosPorFecha) {
    trend = est.registrosPorFecha.map((e) => ({ mes: e._id, total: e.count }));
  }
  return { trend, distribution };
};
