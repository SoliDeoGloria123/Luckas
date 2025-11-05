const API_URL = "http://localhost:3000/api/reservas";

export const reservaService = {
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener reservas");
    return await res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener la reserva");
    return await res.json();
  },

  create: async (reserva) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reserva),
    });
    if (!res.ok) throw new Error("Error al crear reserva");
    return await res.json();
  },

  update: async (id, reserva) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reserva),
    });
    if (!res.ok) throw new Error("Error al actualizar reserva");
    return await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar reserva");
    return await res.json();
  },
  // Obtener historial de reservas de un usuario
  getReservasPorUsuario: async (userId) => {
    const res = await fetch(`${API_URL}/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener reservas del usuario");
    return await res.json();
  }
  
};

