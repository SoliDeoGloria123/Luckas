const API_URL = "http://localhost:3000/api/tareas";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-access-token": localStorage.getItem("token")
});

export const tareaService = {
  // Obtener todas las tareas
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al obtener tareas");
    return await res.json();
  },

  // Obtener tarea por ID
  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al obtener tarea");
    return await res.json();
  },

  // Crear nueva tarea
  create: async (tareaData) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(tareaData)
    });
    if (!res.ok) throw new Error("Error al crear tarea");
    return await res.json();
  },

  // Actualizar tarea
  update: async (id, tareaData) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(tareaData)
    });
    if (!res.ok) throw new Error("Error al actualizar tarea");
    return await res.json();
  },

  // Eliminar tarea
  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al eliminar tarea");
    return await res.json();
  },

  // Obtener tareas asignadas a un usuario
  getByUsuario: async (usuarioId) => {
    const res = await fetch(`${API_URL}/usuario/${usuarioId}`, {
      headers: { "x-access-token": localStorage.getItem("token") }
    });
    if (!res.ok) throw new Error("Error al obtener tareas del usuario");
    return await res.json();
  },

  // Cambiar estado de tarea
  cambiarEstado: async (id, estado) => {
    const res = await fetch(`${API_URL}/${id}/estado`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ estado })
    });
    if (!res.ok) throw new Error("Error al cambiar estado de tarea");
    return await res.json();
  },

  // Agregar comentario a tarea
  agregarComentario: async (id, comentario) => {
    const res = await fetch(`${API_URL}/${id}/comentario`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(comentario)
    });
    if (!res.ok) throw new Error("Error al agregar comentario");
    return await res.json();
  }
};