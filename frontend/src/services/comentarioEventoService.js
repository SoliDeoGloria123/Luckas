const API_URL = "http://localhost:3000/api/comentarios-evento";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const comentarioEventoService = {
  // Obtener comentarios de un evento
  getComentarios: async (eventoId) => {
    const res = await fetch(`${API_URL}/evento/${eventoId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener comentarios");
    return await res.json();
  },
  // Crear comentario
  crearComentario: async (eventoId, texto) => {
    const res = await fetch(`${API_URL}/evento/${eventoId}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ texto })
    });
    if (!res.ok) throw new Error("Error al crear comentario");
    return await res.json();
  },
  // Like
  likeComentario: async (comentarioId) => {
    const res = await fetch(`${API_URL}/${comentarioId}/like`, {
      method: "POST",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Error al dar like");
    return await res.json();
  },
  // Dislike
  dislikeComentario: async (comentarioId) => {
    const res = await fetch(`${API_URL}/${comentarioId}/dislike`, {
      method: "POST",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Error al dar dislike");
    return await res.json();
  },
  // Responder comentario
  responderComentario: async (comentarioId, texto) => {
    const res = await fetch(`${API_URL}/${comentarioId}/responder`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ texto })
    });
    if (!res.ok) throw new Error("Error al responder comentario");
    return await res.json();
  },
  // Editar comentario
  editarComentario: async (eventoId, comentarioId, texto) => {
    const res = await fetch(`${API_URL}/evento/${eventoId}/comentario/${comentarioId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ texto })
    });
    if (!res.ok) throw new Error("Error al editar comentario");
    return await res.json();
  },
  // Eliminar comentario
  eliminarComentario: async (eventoId, comentarioId) => {
    const res = await fetch(`${API_URL}/evento/${eventoId}/comentario/${comentarioId}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Error al eliminar comentario");
    return await res.json();
  },
  // Moderar comentario (admin)
  moderaComentario: async (eventoId, comentarioId) => {
    const res = await fetch(`${API_URL}/evento/${eventoId}/comentario/${comentarioId}/moderar`, {
      method: "PATCH",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Error al moderar comentario");
    return await res.json();
  }
};
