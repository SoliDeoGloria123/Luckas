const API_URL = "http://localhost:3000/api";

// Helpers para reducir duplicación
function buildParams(filtros = {}) {
  const params = new URLSearchParams();
  for (const key of Object.keys(filtros)) {
    const v = filtros[key];
    if (v !== undefined && v !== null && v !== '') params.append(key, v);
  }
  return params;
}

function getHeaders(json = true) {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const reporteService = {
  // Reporte del dashboard
  getDashboard: async () => {
    const res = await fetch(`${API_URL}/reportes/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener reporte del dashboard");
    return await res.json();
  },

  // Reporte de reservas
  getReservas: async (filtros = {}) => {
    const params = buildParams(filtros);
    const res = await fetch(`${API_URL}/reservas?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Error al obtener reporte de reservas");
    return await res.json();
  },

  // Reporte de inscripciones
  getInscripciones: async (filtros = {}) => {
    const params = buildParams(filtros);
    const res = await fetch(`${API_URL}/inscripciones?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Error al obtener reporte de inscripciones");
    return await res.json();
  },

  // Reporte de solicitudes
  getSolicitudes: async (filtros = {}) => {
    const params = buildParams(filtros);
    const res = await fetch(`${API_URL}/solicitudes?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Error al obtener reporte de solicitudes");
    return await res.json();
  },

  // Reporte de usuarios
  getUsuarios: async (filtros = {}) => {
    const params = buildParams(filtros);
    const res = await fetch(`${API_URL}/usuarios?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Error al obtener reporte de usuarios");
    return await res.json();
  },

  // Reporte de eventos
  getEventos: async (filtros = {}) => {
    const params = buildParams(filtros);
    const res = await fetch(`${API_URL}/eventos?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Error al obtener reporte de eventos");
    return await res.json();
  },

  // Reporte financiero
  getFinanciero: async (filtros = {}) => {
    const params = buildParams(filtros);
    const res = await fetch(`${API_URL}/financiero?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Error al obtener reporte financiero");
    return await res.json();
  },

  // Reporte de actividad de usuarios
  getActividadUsuarios: async (filtros = {}) => {
    const params = buildParams(filtros);
    const res = await fetch(`${API_URL}/actividad-usuarios?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Error al obtener actividad de usuarios");
    return await res.json();
  },

  // Exportar reporte a PDF (funcionalidad futura)
  exportToPDF: async (tipoReporte, filtros = {}) => {
    const params = buildParams(filtros);
    params.append('format', 'pdf');

    const res = await fetch(`${API_URL}/${tipoReporte}?${params}`, { headers: getHeaders(false) });
    if (!res.ok) throw new Error("Error al exportar reporte");

    const blob = await res.blob();
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${tipoReporte}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    globalThis.URL.revokeObjectURL(url);
    a.remove();
  },

  // Exportar reporte a Excel (funcionalidad futura)
  exportToExcel: async (tipoReporte, filtros = {}) => {
    const params = buildParams(filtros);
    params.append('format', 'excel');

    const res = await fetch(`${API_URL}/${tipoReporte}?${params}`, { headers: getHeaders(false) });
    if (!res.ok) throw new Error("Error al exportar reporte");

    const blob = await res.blob();
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${tipoReporte}-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    globalThis.URL.revokeObjectURL(url);
    a.remove();
  },

  guardarReporte: async (reporte) => {
    const res = await fetch(`${API_URL}/reportes`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(reporte),
    });
    if (!res.ok) throw new Error('Error al guardar el reporte');
    return await res.json();
  },
  getReportesGuardados: async () => {
    const res = await fetch(`${API_URL}/reportes`, { method: 'GET', headers: getHeaders(true) });
    if (!res.ok) throw new Error('Error al obtener reportes guardados');
    return await res.json();
  },
  editarReporte: async (id, datosActualizados) => {
    const res = await fetch(`${API_URL}/reportes/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(datosActualizados),
    });
    if (!res.ok) throw new Error('Error al editar el reporte');
    return await res.json();
  },
  eliminarReporte: async (id) => {
    const res = await fetch(`${API_URL}/reportes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al eliminar el reporte');
    return await res.json();
  }

};