const API_URL = "http://localhost:3000/api/inscripciones";

export const inscripcionService = {
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener inscripciones");
    return await res.json();
  },

  create: async (inscripcion) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inscripcion),
    });
    if (!res.ok) {
      // Intentar extraer detalle del error devuelto por el servidor
      let errText = 'Error al crear inscripción';
      try {
        const payload = await res.json();
        if (payload && payload.message) errText = payload.message;
        else if (payload && typeof payload === 'string') errText = payload;
      } catch (e) {
        console.error('inscripcionService.create: error parsing error body', e);
      }
      throw new Error(errText);
    }
    return await res.json();
  },

  update: async (id, inscripcion) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inscripcion),
    });
    if (!res.ok) {
      let errText = 'Error al actualizar inscripción';
      try {
        const payload = await res.json();
        if (payload && payload.message) errText = payload.message;
      } catch (e) {
        console.error('inscripcionService.update: error parsing error body', e);
      }
      throw new Error(errText);
    }
    return await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar inscripción");
    return await res.json();
  },
  //Obtener inscripciones por usuario
  getIncripcionesPorUsuario: async (userId) => {
    const res = await fetch(`${API_URL}/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Error al obtener inscripciones por usuario");
    return await res.json();
  },
  gerEstadisticasGenerales: async () => {
    const res = await fetch(`${API_URL}/estadisticas`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Error al obtener estadísticas generales de inscripciones");
    return await res.json();
  }
};