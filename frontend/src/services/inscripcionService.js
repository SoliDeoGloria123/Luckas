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
    if (!res.ok) throw new Error("Error al crear inscripción");
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
    if (!res.ok) throw new Error("Error al actualizar inscripción");
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
  }
};